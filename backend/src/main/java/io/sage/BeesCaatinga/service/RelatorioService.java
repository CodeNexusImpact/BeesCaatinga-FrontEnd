package io.sage.BeesCaatinga.service;

import io.sage.BeesCaatinga.controller.dto.FiltroBuscaDTO;
import io.sage.BeesCaatinga.controller.dto.IntervaloDatas;
import io.sage.BeesCaatinga.controller.dto.relatorios.producao.LoteMelDTO;
import io.sage.BeesCaatinga.controller.dto.relatorios.producao.ProducaoMensalDTO;
import io.sage.BeesCaatinga.controller.dto.relatorios.producao.RelatorioProducaoDTO;
import io.sage.BeesCaatinga.controller.dto.relatorios.producao.StatusColmeiasDTO;
import io.sage.BeesCaatinga.controller.dto.relatorios.rastreabilidade.*;
import io.sage.BeesCaatinga.controller.dto.relatorios.vistoria.RelatorioVistoriaDTO;
import io.sage.BeesCaatinga.controller.dto.relatorios.vistoria.VistoriaMensalDTO;
import io.sage.BeesCaatinga.controller.dto.relatorios.vistoria.VistoriaTabelaDTO;
import io.sage.BeesCaatinga.model.Insumo;
import io.sage.BeesCaatinga.model.enums.StatusColmeia;
import io.sage.BeesCaatinga.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Month;
import java.time.Year;
import java.time.format.TextStyle;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RelatorioService {

    private final ApiarioRepository apiarioRepository;
    private final ColmeiaRepository colmeiaRepository;
    private final ProducaoRepository producaoRepository;
    private final LoteRepository loteRepository;
    private final VistoriaRepository vistoriaRepository;
    private final InsumoRepository insumoRepository;
    private final ProdutorService produtorService;

    public RelatorioProducaoDTO gerarRelatorioProducao(FiltroBuscaDTO filtro){
        IntervaloDatas range = calcularIntervaloDatas(filtro);

        LocalDate inicio = range.inicio();
        LocalDate fim = range.fim();

        Long apiarioId = filtro.apiarioId();
        Long colmeiaId = filtro.colmeiaId();

        // ----------- PRODUÇÃO TOTAL -----------
        Double total = producaoRepository.obterProducaoTotal(inicio, fim, apiarioId, colmeiaId);
        total = total != null ? total : 0.0;

        // ----------- PRODUÇÃO MENSAL -----------
        List<ProducaoMensalDTO> producaoMensal =
                producaoRepository.obterProducaoMensal(inicio, fim, apiarioId, colmeiaId)
                        .stream()
                        .map(o -> new ProducaoMensalDTO(
                                nomeMes((Integer) o[0]),
                                ((Number) o[1]).doubleValue()
                        )).toList();

        // ----------- STATUS DAS COLMEIAS -----------
        List<StatusColmeiasDTO> statusColmeias =
                colmeiaRepository.obterStatusColmeias(apiarioId, colmeiaId)
                        .stream()
                        .map(o -> new StatusColmeiasDTO(
                                (String) o[0],
                                (Long) o[1]
                        )).toList();

        // ----------- NÚMERO DE VISTORIAS -----------
        Long vistorias = vistoriaRepository.contarVistorias(inicio, fim, apiarioId, colmeiaId);

        // ----------- LOTES PARA TABELA -----------
        List<LoteMelDTO> lotes =
                loteRepository.obterLotes(inicio, fim, apiarioId)
                        .stream()
                        .map(l -> new LoteMelDTO(
                                l.getId(),
                                l.getDataProducao(),
                                l.getQuantidadeProduzida()
                        )).toList();

        // ----------- PRODUTIVIDADES -----------
        double totalKg = total != null ? total : 0.0;

        long qtdColmeiasEnvolvidas = colmeiaRepository.count();
        long qtdApiariosEnvolvidos = apiarioRepository.count();

        double produtividadeColmeia =
                qtdColmeiasEnvolvidas == 0 ? 0.0 : totalKg / qtdColmeiasEnvolvidas;

        double produtividadeApiario =
                qtdApiariosEnvolvidos == 0 ? 0.0 : totalKg / qtdApiariosEnvolvidos;

        return new RelatorioProducaoDTO(
                total,
                produtividadeColmeia,
                produtividadeApiario,
                vistorias,
                producaoMensal,
                statusColmeias,
                lotes
        );
    }

    public RelatorioVistoriaDTO gerarRelatorioVistoria(FiltroBuscaDTO filtro) {

        IntervaloDatas range = calcularIntervaloDatas(filtro);

        Long totalVistorias = vistoriaRepository.contarVistorias(
                range.inicio(), range.fim(),
                filtro.apiarioId(),
                filtro.colmeiaId()
        );

        Long saudaveis = colmeiaRepository.countBySituacaoFiltrando(
                StatusColmeia.SAUDAVEL, filtro.apiarioId(), filtro.colmeiaId()
        );

        Long emAtencao = colmeiaRepository.countBySituacaoFiltrando(
                StatusColmeia.MANUTENCAO_NECESSARIA, filtro.apiarioId(), filtro.colmeiaId()
        );

        List<StatusColmeiasDTO> statusColmeias =
                colmeiaRepository.obterStatusColmeias(filtro.apiarioId(), filtro.colmeiaId())
                        .stream()
                        .map(o -> {
                            var situacaoEnum = (StatusColmeia) o[0];
                            Long quantidade = o[1] == null ? 0L : ((Number) o[1]).longValue();
                            return new StatusColmeiasDTO(situacaoEnum.name(), quantidade);
                        })
                        .toList();

        List<VistoriaMensalDTO> vistoriasMensais =
                vistoriaRepository.obterVistoriasMensais(
                                range.inicio(),
                                range.fim(),
                                filtro.apiarioId(),
                                filtro.colmeiaId()
                        ).stream()
                        .map(arr -> new VistoriaMensalDTO(
                                (Integer) arr[0],
                                ((Number) arr[1]).longValue()
                        ))
                        .toList();

        List<VistoriaTabelaDTO> tabela =
                vistoriaRepository.listarVistorias(
                        range.inicio(),
                        range.fim(),
                        filtro.apiarioId(),
                        filtro.colmeiaId()
                );

        return new RelatorioVistoriaDTO(
                totalVistorias,
                saudaveis,
                emAtencao,
                statusColmeias,
                vistoriasMensais,
                tabela
        );
    }


    public RelatorioRastreabilidadeDTO gerarRelatorioRastreabilidade(FiltroBuscaDTO filtro) {

        IntervaloDatas range = calcularIntervaloDatas(filtro);

        LocalDate inicio = range.inicio();
        LocalDate fim = range.fim();

        Long apiarioId = filtro.apiarioId();
        Long colmeiaId = filtro.colmeiaId();

        // ---------- CARDS ----------
        Long totalLotes = loteRepository.contarLotes(inicio, fim, apiarioId, colmeiaId);
        totalLotes = totalLotes == null ? 0L : totalLotes;

        Double pesoTotal = loteRepository.somarPesoTotal(inicio, fim, apiarioId, colmeiaId);
        double pesoTotalRastreavel = pesoTotal == null ? 0.0 : pesoTotal;

        Long vendidos = loteRepository.contarVendidos(inicio, fim, apiarioId, colmeiaId);
        vendidos = vendidos == null ? 0L : vendidos;

        double porcentagemVendidos = totalLotes == 0 ? 0.0 : (vendidos.doubleValue() * 100.0 / totalLotes);

        // tempo médio em dias = média da diferença entre dataProducao e fim do período
        List<LoteTabelaDTO> todosLotes = loteRepository.listarLotesTabela(inicio, fim, apiarioId, colmeiaId);
        double tempoMedioDias;
        if (todosLotes.isEmpty()) {
            tempoMedioDias = 0.0;
        } else {
            double media = todosLotes.stream()
                    .mapToLong(l -> ChronoUnit.DAYS.between(l.dataProducao(), fim))
                    .average().orElse(0.0);
            tempoMedioDias = media;
        }

        // ---------- GRAFICOS ----------
        List<LotesPorTipoAbelhaDTO> graficoTipoAbelha = loteRepository.agruparPorTipoAbelha(inicio, fim, apiarioId, colmeiaId)
                .stream()
                .map(o -> {
                    // o[0] = enum TipoAbelha, o[1] = COUNT
                    String tipo = o[0] == null ? "N/A" : o[0].toString();
                    Long qtd = o[1] == null ? 0L : ((Number) o[1]).longValue();
                    return new LotesPorTipoAbelhaDTO(tipo, qtd);
                })
                .collect(Collectors.toList());

        List<LotesPorFloradaDTO> graficoFlorada = loteRepository.agruparPorFlorada(inicio, fim, apiarioId, colmeiaId)
                .stream()
                .map(o -> {
                    String florada = o[0] == null ? "N/A" : o[0].toString();
                    Long qtd = o[1] == null ? 0L : ((Number) o[1]).longValue();
                    return new LotesPorFloradaDTO(florada, qtd);
                })
                .collect(Collectors.toList());

        VendidosNaoVendidosDTO graficoVendidos = new VendidosNaoVendidosDTO(vendidos, totalLotes - vendidos);

        // ---------- TABELA ----------
        List<LoteTabelaDTO> tabela = todosLotes;

        return new RelatorioRastreabilidadeDTO(
                totalLotes,
                pesoTotalRastreavel,
                porcentagemVendidos,
                tempoMedioDias,
                graficoTipoAbelha,
                graficoVendidos,
                graficoFlorada,
                tabela
        );
    }

    /*
    public RelatorioInsumosDTO gerarRelatorioInsumos(FiltroBuscaDTO filtro) {

//         Long produtorId = produtorService.getProdutorIdLogado();

//         IntervaloDatas intervalo = calcularIntervaloDatas(filtro);

//         List<Insumo> insumos = insumoRepository.buscarPorPeriodo(
//                 produtorId, intervalo.inicio(), intervalo.fim()
//         );

//         Long total = (long) insumos.size();

//         Long estoqueBaixo = insumos.stream()
//                 .filter(i -> i.getQuantidade() != null && i.getQuantidade() < 10)
//                 .count();

//         // Consumo médio estimado = total quantidade dividido por número de meses do período
//         double consumoMedioMensal = calcularConsumoEstimado(insumos, intervalo);

//         // Validade pizza
//         Long ok = insumos.stream()
//                 .filter(i -> i.getDataValidade().isAfter(LocalDate.now().plusMonths(1)))
//                 .count();

//         Long proximoVenc = insumos.stream()
//                 .filter(i -> !i.getDataValidade().isAfter(LocalDate.now().plusMonths(1)))
//                 .count();

//         // Gráfico por tipo
//         List<TipoInsumoQuantidadeDTO> porTipo =
//                 insumoRepository.contarPorTipo(produtorId)
//                         .stream()
//                         .map(o -> new TipoInsumoQuantidadeDTO(
//                                 (String) o[0],
//                                 ((Number) o[1]).longValue()
//                         ))
//                         .toList();

//         // Tabela
//         List<InsumoTabelaDTO> tabela = insumos.stream()
//                 .map(i -> new InsumoTabelaDTO(
//                         i.getId(),
//                         i.getDataEntrada(),
//                         i.getNome(),
//                         i.getTipo(),
//                         i.getQuantidade(),
//                         i.getUnidadeMedida().name(),
//                         i.getStatusInsumo().name(),
//                         i.getDataValidade()
//                 ))
//                 .toList();

//         return new RelatorioInsumosDTO(
//                 total,
//                 estoqueBaixo,
//                 consumoMedioMensal,
//                 ok,
//                 proximoVenc,
//                 porTipo,
//                 tabela
//         );
//     }

     */

    private double calcularConsumoEstimado(List<Insumo> insumos, IntervaloDatas intervalo) {
        double totalQtd = insumos.stream()
                .map(i -> i.getQuantidade() == null ? 0 : i.getQuantidade())
                .reduce(0.0, Double::sum);

        long meses = ChronoUnit.MONTHS.between(intervalo.inicio(), intervalo.fim());
        if (meses <= 0) meses = 1;

        return totalQtd / meses;
    }

    private IntervaloDatas calcularIntervaloDatas(FiltroBuscaDTO filtro) {
        int ano = filtro.ano();

        LocalDate inicio;
        LocalDate fim;

        // --- Se NÃO escolheu estação: retorna o ANO INTEIRO ---
        if (filtro.estacao() == null || filtro.estacao().isBlank()) {
            inicio = LocalDate.of(ano, 1, 1);
            fim = LocalDate.of(ano, 12, 31);
            return new IntervaloDatas(inicio, fim);
        }

        // ------------------ ESTACAO SELECIONADA ------------------
        String estacao = filtro.estacao().toUpperCase();

        // Definimos o intervalo da estação inteira
        switch (estacao) {
            case "VERAO" -> {
                // Dezembro do ano → Janeiro e Fevereiro do ano seguinte
                inicio = LocalDate.of(ano, 12, 1);

                int anoSeguinte = ano + 1;
                if (Year.isLeap(anoSeguinte)) {
                    fim = LocalDate.of(anoSeguinte, 2, 29);
                } else {
                    fim = LocalDate.of(anoSeguinte, 2, 28);
                }
            }
            case "OUTONO" -> {
                inicio = LocalDate.of(ano, 3, 1);
                fim = LocalDate.of(ano, 5, 31);
            }
            case "INVERNO" -> {
                inicio = LocalDate.of(ano, 6, 1);
                fim = LocalDate.of(ano, 8, 31);
            }
            case "PRIMAVERA" -> {
                inicio = LocalDate.of(ano, 9, 1);
                fim = LocalDate.of(ano, 11, 30);
            }
            default -> throw new IllegalArgumentException("Estação inválida");
        }

        // ------------------ MÊS DENTRO DA ESTAÇÃO ------------------
        // Se não veio mês → retorna a estação inteira
        if (filtro.mes() == null) {
            return new IntervaloDatas(inicio, fim);
        }

        // Se veio mês → recortamos apenas aquele mês dentro da estação
        int mesSelecionado = filtro.mes(); // ex: 1 = Janeiro, 2 = Fevereiro...

        // Ajuste para o verão — meses JAN/FEV pertencem ao ANO SEGUINTE
        boolean mesDoAnoSeguinte = (estacao.equals("VERAO") && (mesSelecionado == 1 || mesSelecionado == 2));

        int anoDoMes = mesDoAnoSeguinte ? ano + 1 : ano;

        LocalDate primeiroDia = LocalDate.of(anoDoMes, mesSelecionado, 1);
        LocalDate ultimoDia = primeiroDia.with(TemporalAdjusters.lastDayOfMonth());

        return new IntervaloDatas(primeiroDia, ultimoDia);
    }


    private String nomeMes(int numero) {
        return Month.of(numero).getDisplayName(TextStyle.SHORT, new Locale("pt", "BR"));
    }
}

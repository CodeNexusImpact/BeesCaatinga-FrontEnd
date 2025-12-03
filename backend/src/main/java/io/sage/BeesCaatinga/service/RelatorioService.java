package io.sage.BeesCaatinga.service;

import io.sage.BeesCaatinga.controller.dto.FiltroBuscaDTO;
import io.sage.BeesCaatinga.controller.dto.IntervaloDatas;
import io.sage.BeesCaatinga.controller.dto.relatorios.producao.LoteMelDTO;
import io.sage.BeesCaatinga.controller.dto.relatorios.producao.ProducaoMensalDTO;
import io.sage.BeesCaatinga.controller.dto.relatorios.producao.RelatorioProducaoDTO;
import io.sage.BeesCaatinga.controller.dto.relatorios.producao.StatusColmeiasDTO;
import io.sage.BeesCaatinga.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Month;
import java.time.Year;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class RelatorioService {

    private final ApiarioRepository apiarioRepository;
    private final ColmeiaRepository colmeiaRepository;
    private final ProducaoRepository producaoRepository;
    private final LoteRepository loteRepository;
    private final VistoriaRepository vistoriaRepository;

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

    /*
    resultados:
    * tabelas e cards
    * gráficos de pizza, de colunas (quantidades), de barras (com porcentagem), de área (area chart)
    */

    public IntervaloDatas calcularIntervaloDatas(FiltroBuscaDTO filtro) {

        int ano = filtro.ano(); // obrigatório

        // Se usuário não selecionou estação → filtrar o ano inteiro
        if (filtro.estacao() == null) {
            return new IntervaloDatas(
                    LocalDate.of(ano, 1, 1),
                    LocalDate.of(ano, 12, 31)
            );
        }

        // Descobrir intervalo da estação
        LocalDate inicioEstacao;
        LocalDate fimEstacao;

        switch (filtro.estacao()) {
            case "VERAO" -> {
                // Verão: Dezembro (ano) + Janeiro e Fevereiro (ano + 1)
                inicioEstacao = LocalDate.of(ano, 12, 1);
                fimEstacao = LocalDate.of(ano + 1, 2, 28); // tratamento de ano bissexto abaixo
                if (Year.isLeap(ano + 1)) {
                    fimEstacao = LocalDate.of(ano + 1, 2, 29);
                }
            }
            case "OUTONO" -> {
                // Março, Abril, Maio
                inicioEstacao = LocalDate.of(ano, 3, 1);
                fimEstacao = LocalDate.of(ano, 5, 31);
            }
            case "INVERNO" -> {
                // Junho, Julho, Agosto
                inicioEstacao = LocalDate.of(ano, 6, 1);
                fimEstacao = LocalDate.of(ano, 8, 31);
            }
            case "PRIMAVERA" -> {
                // Setembro, Outubro, Novembro
                inicioEstacao = LocalDate.of(ano, 9, 1);
                fimEstacao = LocalDate.of(ano, 11, 30);
            }
            default -> throw new IllegalArgumentException("Estação inválida");
        }

        // Se NÃO selecionou mês → retorna só a estação inteira
        if (filtro.mes() == null) {
            return new IntervaloDatas(inicioEstacao, fimEstacao);
        }

        // Se selecionou estação + mês → filtrar apenas aquele mês
        int mes = filtro.mes(); // 1 a 12
        return new IntervaloDatas(
                LocalDate.of(ano, mes, 1),
                LocalDate.of(ano, mes, YearMonth.of(ano, mes).lengthOfMonth())
        );
    }

    private String nomeMes(int numero) {
        return Month.of(numero).getDisplayName(TextStyle.SHORT, new Locale("pt", "BR"));
    }
}

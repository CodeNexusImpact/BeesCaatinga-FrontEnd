package io.sage.BeesCaatinga.service;

import io.sage.BeesCaatinga.repository.ApiarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RelatorioService {

    private final ApiarioRepository repository;

    public void test(){
        repository.count();
        // conta quantos apiarios existem no banco de dados
        // retorna long
        // SELECT COUNT(*) FROM apiario;

        /*
        long totalProjetos = projetoRepository.count();
        long totalTarefas   = tarefaRepository.count();
        long totalUsuarios  = usuarioRepository.count();
        long totalEquipes   = equipeRepository.count();

        Map<String, Long> tarefasPorStatus = new HashMap<>();
        for (StatusTarefa status : StatusTarefa.values()) {
            tarefasPorStatus.put(status.name(),
                    tarefaRepository.countByStatus(status)
            );
        }

        Map<String, Long> projetosPorStatus = new HashMap<>();
        for (StatusProjeto status : StatusProjeto.values()) {
            projetosPorStatus.put(status.name(),
                    projetoRepository.countByStatus(status)
            );
        }

        return new DashboardResumoDTO(
                totalProjetos,
                totalTarefas,
                totalUsuarios,
                totalEquipes,
                tarefasPorStatus,
                projetosPorStatus
        );
        */
    }


    // para os períodos: SELECT COUNT(*) FROM tarefa WHERE data_criacao BETWEEN ...;

    /*
    O controller recebe o filtro:
    @GetMapping("/resumo")
    public ResponseEntity<DashboardResumoDTO> getResumo(
        @RequestParam(required = false) Integer mes,
        @RequestParam(required = false) Integer ano
    ) {
        return ResponseEntity.ok(dashboardService.gerarResumo(mes, ano));
    }
    */

    /*
    como seria o service com lógica adicional:
    public DashboardResumoDTO gerarResumo(Integer mes, Integer ano) {

    LocalDate inicio = null;
    LocalDate fim = null;

    if (mes != null && ano != null) {
        inicio = LocalDate.of(ano, mes, 1);
        fim = inicio.withDayOfMonth(inicio.lengthOfMonth());
    }

    long totalProjetos = (inicio != null)
            ? projetoRepository.countByDataInicioBetween(inicio, fim)
            : projetoRepository.count();

    long totalTarefas = (inicio != null)
            ? tarefaRepository.countByDataCriacaoBetween(inicio, fim)
            : tarefaRepository.count();
    */

    /*
    repositories precisam de métodos extras:
    long countByDataCriacaoBetween(LocalDate inicio, LocalDate fim);
    long countByStatusAndDataCriacaoBetween(StatusTarefa status, LocalDate inicio, LocalDate fim);
    */

    /*
    o front quem chama a rota aplicando filtros:
    api.get("/dashboard/resumo", {
        params: { mes: selectedMonth, ano: selectedYear }
    });
    */


    /*
    Filtros: Ano (Obrigatório), estação (opcional, corresponde a 3 meses), mes (opcional)
             Apiário (Obrigatório), Colméia (opcional)

    resultados:
    * tabelas e cards
    * gráficos de pizza, de colunas (quantidades), de barras (com porcentagem), de área (area chart)
    */




    /*
    Pensar... dto para cada tipo de tabela e grafico ou tudo em um só (mais poluído)?

    estações (Hemisferio sul - Brasil):
    * Verão: Dezembro, Janeiro, Fevereiro
    * Outono: Março, Abril, Maio
    * Inverno: Junho, Julho, Agosto
    * Primavera: Setembro, Outubro, Novembro

    Provavelmente um metodo para cada tipo:
    * Apenas ano
    * Ano + estação
    * Ano + estação + mês
    ou fazer ifs para reconhecer presença desses parâmetros

    public graficodadosdto gerarDadosGraficoTalTipo(periodo de tempo, apiario/colmeia){
        counts das quantidades totais de algo (para %)

        obtenção de dados com pesquisas query

        calculos necessarios com dados

        return do dto construido com esses dados
    }
    */
}

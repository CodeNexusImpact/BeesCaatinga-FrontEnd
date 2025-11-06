package io.sage.BeesCaatinga.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RelatorioService {

    //Relatorio Vistoria (tela vistoria)
    /*
    recebe: apiario (para filtrar colmeias) e colmeia
    recebe: filtro mes ou estação

    retorna:
    * grafico pizza com nome 'Colméias' e dividido em 'Ativas' e 'Inativas/Vazias'
    * gráfico pizza com nome 'Colméias' e dividido em TipoColmeia (enum)
    * gráfico pizza com nome 'Abelhas' e dividido em TipoAbelha (enum)
      - seria legal colocar tipo de abelha como atributo de colmeia para o gráfico fazer sentido
    * gráfico de barras horizontais com nome 'Perdas por tipo' ele é uma junção dos enums TipoPerda e TipoPraga com a % porcentagem de perdas para cada tipo
    */

    //Relatório Produção (tela rastreabilidade)
    /*
    recebe:

    retorna:
    */

}

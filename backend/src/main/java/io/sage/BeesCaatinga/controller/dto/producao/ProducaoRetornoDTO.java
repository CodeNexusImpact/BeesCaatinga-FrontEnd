package io.sage.BeesCaatinga.controller.dto.producao;

import io.sage.BeesCaatinga.model.enums.StatusProduto;
import io.sage.BeesCaatinga.model.enums.StatusQualidade;

import java.time.LocalDate;

public record ProducaoRetornoDTO(
        Long id,
        String tipoProducao,
        Double quantidade,
        StatusProduto statusProduto,
        LocalDate dataColeta,
        LocalDate dataVenda,
        String nomeApiario,
        String nomeColmeia,
        StatusQualidade statusQualidade
) {
}

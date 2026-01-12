package io.sage.BeesCaatinga.controller.dto.relatorios.rastreabilidade;

import io.sage.BeesCaatinga.model.enums.TipoAbelha;
import io.sage.BeesCaatinga.model.enums.TipoFlorada;

import java.time.LocalDate;

public record LoteTabelaDTO(
        Long id,
        LocalDate dataProducao,
        Double quantidadeProduzida,
        TipoFlorada tipoFlorada,
        String nomeDaPropriedade,
        TipoAbelha tipoAbelha
) {
}

package io.sage.BeesCaatinga.controller.dto.lote;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.sage.BeesCaatinga.model.enums.TipoAbelha;
import io.sage.BeesCaatinga.model.enums.TipoFlorada;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record LoteCriadoDTO(
        @JsonFormat(pattern = "dd/MM/yyyy")
        @NotNull(message = "Campo data produção/extração é obrigatório!")
        LocalDate dataProducao,
        @NotNull(message = "Campo quantidade produzida é obrigatório!")
        Double quantidadeProduzida,
        @NotNull(message = "Campo apiário é obrigatório!")
        String nomeApiario,
        TipoFlorada tipoFlorada,
        @NotNull(message = "Campo latitude é obrigatório!")
        BigDecimal latitude,
        @NotNull(message = "Campo longitude é obrigatório!")
        BigDecimal longitude,
        @NotNull(message = "Campo tipo de abelha é obrigatório!")
        TipoAbelha tipoAbelha
) {
}

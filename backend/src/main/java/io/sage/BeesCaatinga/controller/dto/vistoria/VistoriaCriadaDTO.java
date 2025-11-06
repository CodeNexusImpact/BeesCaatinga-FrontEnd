package io.sage.BeesCaatinga.controller.dto.vistoria;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.sage.BeesCaatinga.model.enums.CondicaoVistoria;
import io.sage.BeesCaatinga.model.enums.TipoPerda;
import io.sage.BeesCaatinga.model.enums.TipoPraga;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

public record VistoriaCriadaDTO(
        @NotNull(message = "Campo data da vistoria é obrigatório")
        @JsonFormat(pattern = "dd/MM/yyyy")
        LocalDate dataVistoria,
        @NotNull(message = "Campo apiário é obrigatório!")
        Long apiario_id,
        @NotNull(message = "Campo colmeia é obrigatório!")
        Long colmeia_id,
        @NotNull(message = "Campo condição é obrigatório!")
        CondicaoVistoria condicao,
        List<TipoPraga> pragasIdentificadas,
        List<TipoPerda> perdasIdentificadas,
        String observacoes
) {
}

package io.sage.BeesCaatinga.controller.dto.vistoria;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.sage.BeesCaatinga.model.enums.CondicaoVistoria;
import io.sage.BeesCaatinga.model.enums.TipoPerda;
import io.sage.BeesCaatinga.model.enums.TipoPraga;

import java.time.LocalDate;
import java.util.List;

public record VistoriaAtualizadaDTO(
        @JsonFormat(pattern = "dd/MM/yyyy")
        LocalDate dataVistoria,
        CondicaoVistoria condicao,
        List<TipoPraga> pragasIdentificadas,
        List<TipoPerda> perdasIdentificadas,
        String observacoes
) {
}

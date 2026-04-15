package io.sage.BeesCaatinga.controller.dto.vistoria;

import io.sage.BeesCaatinga.model.enums.CondicaoVistoria;
import io.sage.BeesCaatinga.model.enums.TipoPerda;
import io.sage.BeesCaatinga.model.enums.TipoPraga;

import java.time.LocalDate;
import java.util.List;

public record VistoriaRetornoDTO(
        Long id,
        LocalDate dataVistoria,
        CondicaoVistoria condicao,
        String nomeColmeia,
        String nomeApiario,
        List<TipoPraga> pragasIdentificadas,
        List<TipoPerda> perdasIdentificadas,
        String observacoes
) {
}

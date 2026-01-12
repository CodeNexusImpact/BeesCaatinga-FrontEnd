package io.sage.BeesCaatinga.controller.dto.relatorios.vistoria;

import io.sage.BeesCaatinga.model.enums.StatusColmeia;
import io.sage.BeesCaatinga.model.enums.TipoPerda;
import io.sage.BeesCaatinga.model.enums.TipoPraga;

import java.time.LocalDate;
import java.util.List;

public class VistoriaTabelaDTO {

    private LocalDate dataVistoria;
    private String observacoes;
    private StatusColmeia situacao;

    private List<TipoPraga> pragasIdentificadas;
    private List<TipoPerda> perdasIdentificadas;

    public VistoriaTabelaDTO(LocalDate dataVistoria, String observacoes, StatusColmeia situacao) {
        this.dataVistoria = dataVistoria;
        this.observacoes = observacoes;
        this.situacao = situacao;
    }

}

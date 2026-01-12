package io.sage.BeesCaatinga.controller.dto.relatorios.vistoria;

import io.sage.BeesCaatinga.controller.dto.relatorios.producao.StatusColmeiasDTO;

import java.util.List;

public record RelatorioVistoriaDTO(
        Long vistoriasTotais,
        Long colmeiasSaudaveis,
        Long colmeiasEmAtencao,

        List<StatusColmeiasDTO> statusColmeias,
        List<VistoriaMensalDTO> vistoriasMensais,
        List<VistoriaTabelaDTO> tabela
) {
}

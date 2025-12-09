package io.sage.BeesCaatinga.controller.mapper;

import io.sage.BeesCaatinga.controller.dto.insumo.InsumoAtualizadoDTO;
import io.sage.BeesCaatinga.controller.dto.insumo.InsumoCriadoDTO;
import io.sage.BeesCaatinga.controller.dto.insumo.InsumoRetornoDTO;
import io.sage.BeesCaatinga.model.Insumo;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface InsumoMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "produtor", ignore = true)
    @Mapping(target = "statusInsumo", expression = "java(StatusInsumo.DISPONIVEL)")
    Insumo toEntityFromCriado(InsumoCriadoDTO dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "produtor", ignore = true)
    Insumo toEntityFromAtualizado(InsumoAtualizadoDTO dto);

    InsumoRetornoDTO toRetornoDTO(Insumo entidade);

    default String mapObservacoes(String observacoes) {
        return (observacoes == null || observacoes.isBlank()) ? "Não informado" : observacoes;
    }
}

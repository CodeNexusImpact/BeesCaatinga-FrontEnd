package io.sage.BeesCaatinga.controller.mapper;

import io.sage.BeesCaatinga.controller.dto.ProdutorAtualizadoDTO;
import io.sage.BeesCaatinga.controller.dto.ProdutorCriadoDTO;
import io.sage.BeesCaatinga.controller.dto.ProdutorRetornoDTO;
import io.sage.BeesCaatinga.model.Produtor;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProdutorMapper {
    @Mapping(target = "id", ignore = true)
    Produtor toEntityFromCriado(ProdutorCriadoDTO dto);
    Produtor toEntityFromAtualizado(ProdutorAtualizadoDTO dto);
    ProdutorRetornoDTO toRetornoDTO(Produtor entidade);
}

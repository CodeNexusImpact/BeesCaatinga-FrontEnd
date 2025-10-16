package io.sage.BeesCaatinga.controller.mapper;

import io.sage.BeesCaatinga.controller.dto.ProdutorDTO;
import io.sage.BeesCaatinga.controller.dto.ProdutorSimplificadoDTO;
import io.sage.BeesCaatinga.model.Produtor;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProdutorMapper {

    @Mapping(target = "id", ignore = true)
    Produtor toEntity(ProdutorDTO dto);
    ProdutorDTO toDTO(Produtor entidade);
    ProdutorSimplificadoDTO toSimplificadoDTO(Produtor entidade);

}

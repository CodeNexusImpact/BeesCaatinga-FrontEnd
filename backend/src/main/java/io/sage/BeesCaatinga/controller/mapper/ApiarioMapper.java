package io.sage.BeesCaatinga.controller.mapper;

import io.sage.BeesCaatinga.controller.dto.ApiarioDTO;
import io.sage.BeesCaatinga.controller.dto.ApiarioSimplificadoDTO;
import io.sage.BeesCaatinga.model.Apiario;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ApiarioMapper {
    @Mapping(target = "id", ignore = true)
    Apiario toEntity(ApiarioDTO dto);
    ApiarioDTO toDTO(Apiario entidade);
    ApiarioSimplificadoDTO toSimplificadaDTO(Apiario entidade);
}

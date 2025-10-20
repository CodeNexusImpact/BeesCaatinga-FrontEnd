package io.sage.BeesCaatinga.controller.mapper;

import io.sage.BeesCaatinga.model.Apiario;
import io.sage.BeesCaatinga.model.Colmeia;
import io.sage.BeesCaatinga.repository.ApiarioRepository;
import jakarta.persistence.EntityNotFoundException;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ColmeiaMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "apiario", expression = "java(mapApiario(dto.apiario_id(), apiarioRepository))")
    Colmeia toEntity(ColmeiaDTO dto,
                     @Context ApiarioRepository apiarioRepository);
    ColmeiaDTO toDTO(Colmeia entidade);
    ColmeiaSimplificadaDTO toSimplificadaDTO(Colmeia entidade);

    default Apiario mapApiario(Long apiario_id, @Context ApiarioRepository apiarioRepository){
        if (apiario_id == null) return null;
        return apiarioRepository.findById(apiario_id)
                .orElseThrow(() -> new EntityNotFoundException("Apiário não encontrado."));
    }
}

package io.sage.BeesCaatinga.controller.mapper;

import io.sage.BeesCaatinga.controller.dto.colmeia.ColmeiaAtualizadaDTO;
import io.sage.BeesCaatinga.controller.dto.colmeia.ColmeiaCriadaDTO;
import io.sage.BeesCaatinga.controller.dto.colmeia.ColmeiaRetornoDTO;
import io.sage.BeesCaatinga.controller.dto.colmeia.ColmeiaRetornoEmApiarioDTO;
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
    Colmeia toEntityFromCriada(ColmeiaCriadaDTO dto,
                     @Context ApiarioRepository apiarioRepository);
    @Mapping(target = "apiario", expression = "java(mapApiario(dto.apiario_id(), apiarioRepository))")
    Colmeia toEntityFromAtualizada(ColmeiaAtualizadaDTO dto,
                     @Context ApiarioRepository apiarioRepository);
    @Mapping(target = "nomeApiario", source = "apiario.nome")
    @Mapping(target = "statusColmeia", source = "situacao")
    ColmeiaRetornoDTO toRetornoDTO(Colmeia entidade);
    @Mapping(target = "statusColmeia", source = "situacao")
    ColmeiaRetornoEmApiarioDTO toRetornoEmApiarioDTO(Colmeia entidade);

    default Apiario mapApiario(Long apiario_id, @Context ApiarioRepository apiarioRepository){
        if (apiario_id == null) return null;
        return apiarioRepository.findById(apiario_id)
                .orElseThrow(() -> new EntityNotFoundException("Apiário não encontrado."));
    }
}

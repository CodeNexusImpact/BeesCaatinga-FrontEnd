package io.sage.BeesCaatinga.controller.mapper;

import io.sage.BeesCaatinga.controller.dto.vistoria.VistoriaAtualizadaDTO;
import io.sage.BeesCaatinga.controller.dto.vistoria.VistoriaCriadaDTO;
import io.sage.BeesCaatinga.controller.dto.vistoria.VistoriaRetornoDTO;
import io.sage.BeesCaatinga.model.Apiario;
import io.sage.BeesCaatinga.model.Colmeia;
import io.sage.BeesCaatinga.model.Vistoria;
import io.sage.BeesCaatinga.repository.ApiarioRepository;
import io.sage.BeesCaatinga.repository.ColmeiaRepository;
import jakarta.persistence.EntityNotFoundException;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface VistoriaMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "apiario", expression = "java(mapApiario(dto.apiario_id(), apiarioRepository))")
    @Mapping(target = "colmeia", expression = "java(mapColmeia(dto.colmeia_id(), colmeiaRepository))")
    Vistoria toEntityFromCriada(VistoriaCriadaDTO dto,
                                @Context ApiarioRepository apiarioRepository,
                                @Context ColmeiaRepository colmeiaRepository);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "apiario", expression = "java(mapApiario(dto.apiario_id(), apiarioRepository))")
    @Mapping(target = "colmeia", expression = "java(mapColmeia(dto.colmeia_id(), colmeiaRepository))")
    Vistoria toEntityFromAtualizada(VistoriaAtualizadaDTO dto,
                                    @Context ApiarioRepository apiarioRepository,
                                    @Context ColmeiaRepository colmeiaRepository);

    @Mapping(target = "nomeColmeia", source = "colmeia.identificador")
    @Mapping(target = "nomeApiario", source = "apiario.nome")
    VistoriaRetornoDTO toRetornoDTO(Vistoria entidade);

    default Apiario mapApiario(Long apiarioId, @Context ApiarioRepository apiarioRepository) {
        if (apiarioId == null) return null;
        return apiarioRepository.findById(apiarioId)
                .orElseThrow(() -> new EntityNotFoundException("Apiário não encontrado com id: " + apiarioId));
    }

    default Colmeia mapColmeia(Long colmeiaId, @Context ColmeiaRepository colmeiaRepository) {
        if (colmeiaId == null) return null;
        return colmeiaRepository.findById(colmeiaId)
                .orElseThrow(() -> new EntityNotFoundException("Colmeia não encontrada com id: " + colmeiaId));
    }
}
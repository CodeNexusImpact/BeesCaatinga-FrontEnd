package io.sage.BeesCaatinga.controller.mapper;

import io.sage.BeesCaatinga.controller.dto.producao.ProducaoAtualizadaDTO;
import io.sage.BeesCaatinga.controller.dto.producao.ProducaoCriadaDTO;
import io.sage.BeesCaatinga.controller.dto.producao.ProducaoRetornoDTO;
import io.sage.BeesCaatinga.model.Apiario;
import io.sage.BeesCaatinga.model.Colmeia;
import io.sage.BeesCaatinga.model.Producao;
import io.sage.BeesCaatinga.repository.ApiarioRepository;
import io.sage.BeesCaatinga.repository.ColmeiaRepository;
import jakarta.persistence.EntityNotFoundException;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProducaoMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "litros", ignore = true) // Será calculado automaticamente no @PrePersist
    @Mapping(target = "statusProduto", expression = "java(StatusProduto.EM_ESTOQUE)") // Default ao criar
    @Mapping(target = "statusQualidade", expression = "java(StatusQualidade.NAO_AVALIADO)") // Default ao criar
    @Mapping(target = "dataVenda", ignore = true) // Não é definida na criação
    @Mapping(target = "apiario", expression = "java(mapApiario(dto.apiarioId(), apiarioRepository))")
    @Mapping(target = "colmeia", expression = "java(mapColmeia(dto.colmeiaId(), colmeiaRepository))")
    Producao toEntityFromCriada(ProducaoCriadaDTO dto,
                                @Context ApiarioRepository apiarioRepository,
                                @Context ColmeiaRepository colmeiaRepository);

    // PARA ATUALIZAÇÃO
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "litros", ignore = true) // Será recalculado automaticamente
    @Mapping(target = "statusProduto", ignore = true) // Não atualiza via DTO
    @Mapping(target = "statusQualidade", ignore = true) // Não atualiza via DTO
    @Mapping(target = "dataVenda", ignore = true) // Não atualiza via DTO
    @Mapping(target = "apiario", expression = "java(mapApiario(dto.apiarioId(), apiarioRepository))")
    @Mapping(target = "colmeia", expression = "java(mapColmeia(dto.colmeiaId(), colmeiaRepository))")
    Producao toEntityFromAtualizada(ProducaoAtualizadaDTO dto,
                                    @Context ApiarioRepository apiarioRepository,
                                    @Context ColmeiaRepository colmeiaRepository);

    @Mapping(target = "nomeApiario", source = "apiario.nome")
    @Mapping(target = "nomeColmeia", source = "colmeia.identificador")
    ProducaoRetornoDTO toRetornoDTO(Producao entidade);

    default Apiario mapApiario(Long apiarioId, @Context ApiarioRepository apiarioRepository) {
        return apiarioRepository.findById(apiarioId)
                .orElseThrow(() -> new EntityNotFoundException("Apiário não encontrado"));
    }

    default Colmeia mapColmeia(Long colmeiaId, @Context ColmeiaRepository colmeiaRepository) {
        return colmeiaRepository.findById(colmeiaId)
                .orElseThrow(() -> new EntityNotFoundException("Colmeia não encontrada"));
    }
}

package io.sage.BeesCaatinga.controller.mapper;

import io.sage.BeesCaatinga.controller.dto.lote.LoteCriadoDTO;
import io.sage.BeesCaatinga.controller.dto.lote.LoteRetornoCodigoDTO;
import io.sage.BeesCaatinga.controller.dto.lote.LoteRetornoListadoDTO;
import io.sage.BeesCaatinga.model.Apiario;
import io.sage.BeesCaatinga.model.Lote;
import io.sage.BeesCaatinga.repository.ApiarioRepository;
import jakarta.persistence.EntityNotFoundException;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LoteMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "apiario", expression = "java(mapApiarioPorNome(dto.nomeApiario(), apiarioRepository))")
    Lote toEntityFromCriado(LoteCriadoDTO dto,
                            @Context ApiarioRepository apiarioRepository);

    LoteRetornoCodigoDTO toRetornoCodigoDTO(Lote entidade);

    @Mapping(target = "nomeApiario", source = "apiario.nome")
    LoteRetornoListadoDTO toRetornoListadoDTO(Lote entidade);

    // MÉTODO AUXILIAR - Busca apiário por NOME (ao invés de ID)
    default Apiario mapApiarioPorNome(String nomeApiario, @Context ApiarioRepository apiarioRepository) {
        if (nomeApiario == null || nomeApiario.isBlank()) {
            throw new IllegalArgumentException("Nome do apiário é obrigatório");
        }

        return apiarioRepository.findByNome(nomeApiario)
                .orElseThrow(() -> new EntityNotFoundException("Apiário não encontrado com nome: " + nomeApiario));
    }
}

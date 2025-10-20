package io.sage.BeesCaatinga.controller.mapper;

import io.sage.BeesCaatinga.controller.dto.ApiarioAtualizadoDTO;
import io.sage.BeesCaatinga.controller.dto.ApiarioCriadoDTO;
import io.sage.BeesCaatinga.model.Apiario;
import io.sage.BeesCaatinga.model.Produtor;
import io.sage.BeesCaatinga.repository.ProdutorRepository;
import jakarta.persistence.EntityNotFoundException;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ApiarioMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "colmeias", ignore = true)
    @Mapping(target = "produtor", expression = "java(mapProdutor(dto.produtor_id(), produtorRepository))")
    Apiario toEntityFromCriado(ApiarioCriadoDTO dto,
                     @Context ProdutorRepository produtorRepository);
    Apiario toEntityFromAtualizado(ApiarioAtualizadoDTO dto);
    ApiarioRetornoDTO toRetornoDTO(Apiario entidade);

    default Produtor mapProdutor(Long produtor_id, @Context ProdutorRepository produtorRepository){
        if (produtor_id == null) return null;
        return produtorRepository.findById(produtor_id)
                .orElseThrow(() -> new EntityNotFoundException("Produtor não encontrado."));
    }
}

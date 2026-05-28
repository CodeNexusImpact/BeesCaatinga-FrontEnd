package io.sage.BeesCaatinga.service;

import io.sage.BeesCaatinga.controller.dto.apiario.ApiarioAtualizadoDTO;
import io.sage.BeesCaatinga.controller.dto.apiario.ApiarioCriadoDTO;
import io.sage.BeesCaatinga.controller.dto.apiario.ApiarioRetornoDTO;
import io.sage.BeesCaatinga.controller.exception.ResourceNotFoundException;
import io.sage.BeesCaatinga.controller.mapper.ApiarioMapper;
import io.sage.BeesCaatinga.model.Apiario;
import io.sage.BeesCaatinga.model.Colmeia;
import io.sage.BeesCaatinga.repository.ApiarioRepository;
import io.sage.BeesCaatinga.repository.ProdutorRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApiarioService {

    private final ProdutorRepository repository;

    private final ApiarioRepository apiarioRepository;
    private final ApiarioMapper apiarioMapper;

    @Transactional
    public ApiarioRetornoDTO salvarApiario(Long produtorId, ApiarioCriadoDTO dto){
        var produtor = repository.findById(produtorId)
                .orElseThrow(() -> new ResourceNotFoundException("Produtor não encontrado!"));

        var apiario = apiarioMapper.toEntityFromCriado(dto, repository);
        apiario.setProdutor(produtor);

        apiarioRepository.save(apiario);
        return apiarioMapper.toRetornoDTO(apiario);
    }

    public List<ApiarioRetornoDTO> listar(Long produtorId){
        if (!repository.existsById(produtorId)) {
            throw new ResourceNotFoundException("Produtor não encontrado com id: " + produtorId);
        }

        List<Apiario> lista = apiarioRepository.findByProdutorId(produtorId);

        return lista.stream()
                .map(apiarioMapper::toRetornoDTO)
                .toList();
    }

    public ApiarioRetornoDTO atualizar(Long produtorId, Long apiarioId, ApiarioAtualizadoDTO dto){
        var apiario = apiarioRepository.findById(apiarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Apiário não encontrado com id: " + apiarioId));

        if (!apiario.getProdutor().getId().equals(produtorId)) {
            throw new ResourceNotFoundException("Apiário não pertence ao produtor informado");
        }

        if (dto.nome() != null) apiario.setNome(dto.nome());
        if (dto.nRegistro() != null) apiario.setNRegistro(dto.nRegistro());
        if (dto.dataDeCriacao() != null) apiario.setDataDeCriacao(dto.dataDeCriacao());
        if (dto.observacoes() != null) apiario.setObservacoes(dto.observacoes());
        if (dto.cep() != null) apiario.setCep(dto.cep());
        if (dto.nomeDaPropriedade() != null) apiario.setNomeDaPropriedade(dto.nomeDaPropriedade());
        if (dto.estado() != null) apiario.setEstado(dto.estado());
        if (dto.cidade() != null) apiario.setCidade(dto.cidade());
        if (dto.bairro() != null) apiario.setBairro(dto.bairro());
        if (dto.rua() != null) apiario.setRua(dto.rua());
        if (dto.numero() != null) apiario.setNumero(dto.numero());
        if (dto.complemento() != null) apiario.setComplemento(dto.complemento());
        if (dto.caminhoDaFoto() != null) apiario.setCaminhoDaFoto(dto.caminhoDaFoto());
        if (dto.latitude() != null) apiario.setLatitude(dto.latitude());
        if (dto.longitude() != null) apiario.setLongitude(dto.longitude());

        apiarioRepository.save(apiario);
        return apiarioMapper.toRetornoDTO(apiario);
    }

    public void deletar(Long produtorId, Long apiarioId){
        var apiario = apiarioRepository.findById(apiarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Apiário não encontrado com id: " + apiarioId));

        if (!apiario.getProdutor().getId().equals(produtorId)) {
            throw new ResourceNotFoundException("Apiário não pertence ao produtor informado");
        }

        // Verifica se existem colmeias ativas no apiário,
        boolean hasColmeiasAtivas = apiario.getColmeias().stream()
                .anyMatch(Colmeia::getAtiva);
        if (hasColmeiasAtivas) {
            throw new IllegalStateException("Não é possível deletar apiário com colmeias ativas");
        }

        // Deleta o apiário (cascade vai deletar colmeias inativas automaticamente, já que não deleta com ativas)
        apiarioRepository.delete(apiario);
    }

    private Apiario validarApiarioDoProdutor(Long produtorId, Long apiarioId) {
        var apiario = apiarioRepository.findById(apiarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Apiário não encontrado com id: " + apiarioId));

        if (!apiario.getProdutor().getId().equals(produtorId)) {
            throw new ResourceNotFoundException("Apiário não pertence ao produtor informado");
        }

        return apiario;
    }

}

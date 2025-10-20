package io.sage.BeesCaatinga.service;

import io.sage.BeesCaatinga.controller.dto.ApiarioAtualizadoDTO;
import io.sage.BeesCaatinga.controller.dto.ApiarioCriadoDTO;
import io.sage.BeesCaatinga.controller.dto.ApiarioRetornoDTO;
import io.sage.BeesCaatinga.controller.dto.ColmeiaRetornoEmApiarioDTO;
import io.sage.BeesCaatinga.controller.exception.ResourceNotFoundException;
import io.sage.BeesCaatinga.controller.mapper.ApiarioMapper;
import io.sage.BeesCaatinga.controller.mapper.ColmeiaMapper;
import io.sage.BeesCaatinga.repository.ApiarioRepository;
import io.sage.BeesCaatinga.repository.ProdutorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApiarioService {

    private final ApiarioRepository repository;
    private final ProdutorRepository produtorRepository;
    private final ApiarioMapper mapper;
    private final ColmeiaMapper colmeiaMapper;

    public ApiarioRetornoDTO salvar(ApiarioCriadoDTO dto){
        var apiario = mapper.toEntityFromCriado(dto, produtorRepository);
        if (apiario.getNumero() == null) apiario.setNumero("0");
        if (apiario.getDataDeCriacao() == null) apiario.setDataDeCriacao(LocalDate.now());
        repository.save(apiario);
        return mapper.toRetornoDTO(apiario);
    }

    public ApiarioRetornoDTO buscarPorId(Long id){
        var apiario = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Apiário não encontrado!"));
        return mapper.toRetornoDTO(apiario);
    }

    public List<ColmeiaRetornoEmApiarioDTO> listarColmeiasPorApiario(Long id){
        var apiario = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Apiário não encontrado!"));
        var lista = apiario.getColmeias();
        return lista.stream()
                .map(colmeiaMapper::toRetornoEmApiarioDTO)
                .toList();
    }

    public List<ApiarioRetornoDTO> listar(){
        var lista = repository.findAll();
        return lista.stream()
                .map(mapper::toRetornoDTO)
                .toList();
    }

    public ApiarioRetornoDTO atualizar(Long id, ApiarioAtualizadoDTO dto){
        var apiario = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Apiário não encontrado!"));

        apiario.setNome(dto.nome());
        apiario.setNRegistro(dto.nRegistro());
        apiario.setDataDeCriacao(dto.dataDeCriacao());
        apiario.setObservacoes(dto.observacoes());
        apiario.setCep(dto.cep());
        apiario.setNomeDaPropriedade(dto.nomeDaPropriedade());
        apiario.setEstado(dto.estado());
        apiario.setCidade(dto.cidade());
        apiario.setBairro(dto.bairro());
        apiario.setRua(dto.rua());
        apiario.setNumero(dto.numero());
        apiario.setComplemento(dto.complemento());

        repository.save(apiario);
        return mapper.toRetornoDTO(apiario);
    }

    public void deletar(Long id){
        var apiario = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Apiário não encontrado!"));
        repository.delete(apiario);
    }

}

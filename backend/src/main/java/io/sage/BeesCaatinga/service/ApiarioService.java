package io.sage.BeesCaatinga.service;

import io.sage.BeesCaatinga.controller.dto.ApiarioDTO;
import io.sage.BeesCaatinga.controller.dto.ApiarioSimplificadoDTO;
import io.sage.BeesCaatinga.controller.dto.ColmeiaSimplificadaDTO;
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

    public ApiarioSimplificadoDTO salvar(ApiarioDTO dto){
        var apiario = mapper.toEntity(dto, produtorRepository);
        if (apiario.getNumero() == null) apiario.setNumero("0");
        if (apiario.getDataDeCriacao() == null) apiario.setDataDeCriacao(LocalDate.now());
        repository.save(apiario);
        return mapper.toSimplificadoDTO(apiario);
    }

    public ApiarioDTO buscarPorId(Long id){
        var apiario = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Apiário não encontrado!"));
        return mapper.toDTO(apiario);
    }

    public List<ColmeiaSimplificadaDTO> listarColmeiasPorApiario(Long id){
        var apiario = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Apiário não encontrado!"));
        var lista = apiario.getColmeias();
        return lista.stream()
                .map(colmeiaMapper::toSimplificadaDTO)
                .toList();
    }

    public List<ApiarioSimplificadoDTO> listar(){
        var lista = repository.findAll();
        return lista.stream()
                .map(mapper::toSimplificadoDTO)
                .toList();
    }

    public ApiarioDTO atualizar(Long id, ApiarioDTO dto){
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
        return mapper.toDTO(apiario);
    }

    public void deletar(Long id){
        var apiario = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Apiário não encontrado!"));
        repository.delete(apiario);
    }

}

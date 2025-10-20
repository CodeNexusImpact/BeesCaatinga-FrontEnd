package io.sage.BeesCaatinga.service;

import io.sage.BeesCaatinga.controller.dto.*;
import io.sage.BeesCaatinga.controller.exception.ResourceNotFoundException;
import io.sage.BeesCaatinga.controller.mapper.ApiarioMapper;
import io.sage.BeesCaatinga.controller.mapper.ColmeiaMapper;
import io.sage.BeesCaatinga.controller.mapper.ProdutorMapper;
import io.sage.BeesCaatinga.model.Apiario;
import io.sage.BeesCaatinga.model.Colmeia;
import io.sage.BeesCaatinga.repository.ApiarioRepository;
import io.sage.BeesCaatinga.repository.ProdutorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProdutorService {

    private final ProdutorRepository repository;
    private final ProdutorMapper mapper;
    private final ApiarioMapper apiarioMapper;
    private final ApiarioRepository apiarioRepository;
    private final ColmeiaService colmeiaService;
    private final ColmeiaMapper colmeiaMapper;

    // OBS: quando ativar a segurança lembrar de adicionar o encoder,
    // criptografar as senhas antes de salvar no banco de dados

    public ProdutorRetornoDTO salvar(ProdutorCriadoDTO dto){
        var produtor = mapper.toEntityFromCriado(dto);
        repository.save(produtor);
        return mapper.toRetornoDTO(produtor);
    }

    public ProdutorRetornoDTO buscarPorId(Long id){
        var produtor = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produtor não encontrado!"));
        return mapper.toRetornoDTO(produtor);
    }

    public List<ProdutorRetornoDTO> listar(){
        var lista = repository.findAll();
        return lista.stream()
                .map(mapper::toRetornoDTO)
                .toList();
    }

    public ProdutorRetornoDTO atualizar(Long id, ProdutorAtualizadoDTO dto){
        var produtor = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produtor não encontrado!"));

        produtor.setNomeCompleto(dto.nomeCompleto());
        produtor.setGenero(dto.genero());
        produtor.setEmail(dto.email());
        produtor.setNomeDaEmpresa(dto.nomeDaEmpresa());
        produtor.setTelefone(dto.telefone());
        produtor.setEndereco(dto.endereco());

        repository.save(produtor);
        return mapper.toRetornoDTO(produtor);
    }

    public void deletar(Long id){
        var produtor = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produtor não encontrado!"));
        repository.delete(produtor);
    }

    // OPERAÇÕES DE APIÁRIO
    public ApiarioRetornoDTO salvarApiario(Long produtorId, ApiarioCriadoDTO dto){
        var produtor = repository.findById(produtorId)
                .orElseThrow(() -> new ResourceNotFoundException("Produtor não encontrado!"));

        var apiario = apiarioMapper.toEntityFromCriado(dto, repository);
        apiario.setProdutor(produtor);

        apiarioRepository.save(apiario);
        return apiarioMapper.toRetornoDTO(apiario);
    }

    public List<ApiarioRetornoDTO> listarApiariosDoProdutor(Long produtorId){
        var produtor = repository.findById(produtorId)
                .orElseThrow(() -> new ResourceNotFoundException("Produtor não encontrado com id: " + produtorId));

        var lista = produtor.getApiarios();

        return lista.stream()
                .map(apiarioMapper::toRetornoDTO)
                .toList();
    }

    // OPERAÇÕES DE COLMEIA
    public ColmeiaRetornoDTO salvarColmeia(Long produtorId, Long apiarioId, ColmeiaCriadaDTO dto){
        var apiario = apiarioRepository.findById(apiarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Apiário não encontrado!"));

        if (!apiario.getProdutor().getId().equals(produtorId)) {
            throw new ResourceNotFoundException("Apiário não pertence ao produtor!");
        }

        return colmeiaService.salvar(dto);
    }

    public List<ColmeiaRetornoDTO> listarColmeiasDoApiario(Long produtorId, Long apiarioId) {
        var apiario = apiarioRepository.findById(apiarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Apiário não encontrado com id: " + apiarioId));

        if (!apiario.getProdutor().getId().equals(produtorId)) {
            throw new ResourceNotFoundException("Apiário não pertence ao produtor informado");
        }

        var lista = apiario.getColmeias();

        return lista.stream()
                .map(colmeiaMapper::toRetornoDTO)
                .toList();
    }

    public List<ColmeiaRetornoDTO> listarColmeiasAtivasDoApiario(Long produtorId, Long apiarioId) {
        var apiario = apiarioRepository.findById(apiarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Apiário não encontrado com id: " + apiarioId));

        if (!apiario.getProdutor().getId().equals(produtorId)) {
            throw new ResourceNotFoundException("Apiário não pertence ao produtor informado");
        }

        List<Colmeia> colmeiasAtivas = apiario.getColmeias().stream()
                .filter(Colmeia::getAtiva)  // ou .filter(c -> Boolean.TRUE.equals(c.getAtiva()))
                .toList();

        return colmeiasAtivas.stream()
                .map(colmeiaMapper::toRetornoDTO)
                .toList();
    }

    public List<ColmeiaRetornoDTO> listarColmeiasInativasDoApiario(Long produtorId, Long apiarioId) {
        var apiario = apiarioRepository.findById(apiarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Apiário não encontrado com id: " + apiarioId));

        if (!apiario.getProdutor().getId().equals(produtorId)) {
            throw new ResourceNotFoundException("Apiário não pertence ao produtor informado");
        }

        List<Colmeia> colmeiasInativas = apiario.getColmeias().stream()
                .filter(c -> !Boolean.TRUE.equals(c.getAtiva()))  // ou .filter(c -> Boolean.FALSE.equals(c.getAtiva()))
                .toList();

        return colmeiasInativas.stream()
                .map(colmeiaMapper::toRetornoDTO)
                .toList();
    }

}

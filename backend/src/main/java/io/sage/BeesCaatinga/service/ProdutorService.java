package io.sage.BeesCaatinga.service;

import io.sage.BeesCaatinga.controller.exception.ResourceNotFoundException;
import io.sage.BeesCaatinga.controller.mapper.ProdutorMapper;
import io.sage.BeesCaatinga.repository.ProdutorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProdutorService {

    private final ProdutorRepository repository;
    private final ProdutorMapper mapper;

    // OBS: quando ativar a segurança lembrar de adicionar o encoder,
    // criptografar as senhas antes de salvar no banco de dados

    public ProdutorSimplificadoDTO salvar(ProdutorDTO dto){
        var produtor = mapper.toEntity(dto);
        repository.save(produtor);
        return mapper.toSimplificadoDTO(produtor);
    }

    public ProdutorDTO buscarPorId(Long id){
        var produtor = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produtor não encontrado!"));
        return mapper.toDTO(produtor);
    }

    public List<ProdutorSimplificadoDTO> listar(){
        var lista = repository.findAll();
        return lista.stream()
                .map(mapper::toSimplificadoDTO)
                .toList();
    }

    public ProdutorDTO atualizar(Long id, ProdutorDTO dto){
        var produtor = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produtor não encontrado!"));

        produtor.setNomeCompleto(dto.nomeCompleto());
        produtor.setGenero(dto.genero());
        produtor.setEmail(dto.email());
        produtor.setNomeDaEmpresa(dto.nomeDaEmpresa());
        produtor.setTelefone(dto.telefone());
        produtor.setEndereco(dto.endereco());

        repository.save(produtor);
        return mapper.toDTO(produtor);
    }

    public void deletar(Long id){
        var produtor = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produtor não encontrado!"));
        repository.delete(produtor);
    }

    public ApiarioSimplificadoDTO salvarApiario(){

    }

    public ColmeiaSimplificadaDTO salvarColmeia(){

    }

}

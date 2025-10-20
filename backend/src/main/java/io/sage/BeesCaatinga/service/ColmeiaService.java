package io.sage.BeesCaatinga.service;

import io.sage.BeesCaatinga.controller.exception.ResourceNotFoundException;
import io.sage.BeesCaatinga.controller.mapper.ColmeiaMapper;
import io.sage.BeesCaatinga.repository.ApiarioRepository;
import io.sage.BeesCaatinga.repository.ColmeiaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ColmeiaService {

    private final ColmeiaRepository repository;
    private final ApiarioRepository apiarioRepository;
    private final ColmeiaMapper mapper;

    public ColmeiaSimplificadaDTO salvar(ColmeiaDTO dto){
        var colmeia = mapper.toEntity(dto, apiarioRepository);
        repository.save(colmeia);
        return mapper.toSimplificadaDTO(colmeia);
    }

    public ColmeiaDTO buscarPorId(Long id){
        var colmeia = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Colméia não encontrada!"));
        return mapper.toDTO(colmeia);
    }

    public List<ColmeiaSimplificadaDTO> listar(){
        var lista = repository.findAll();
        return lista.stream()
                .map(mapper::toSimplificadaDTO)
                .toList();
    }

    public ColmeiaDTO atualizar(Long id, ColmeiaDTO dto){
        var colmeia = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Colméia não encontrada!"));

        colmeia.setIdentificador(dto.identificador());
        colmeia.setTipo(dto.tipo());
        colmeia.setAtiva(dto.ativa());
        colmeia.setObservacoes(dto.observacoes());
        colmeia.setDetalhesDaLocalizacao(dto.detalhesDaLocalizacao());

        repository.save(colmeia);
        return mapper.toDTO(colmeia);
    }

    public void deletar(Long id){
        var colmeia = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Colméia não encontrada!"));
        repository.delete(colmeia);
    }

}

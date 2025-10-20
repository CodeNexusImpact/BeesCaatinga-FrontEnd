package io.sage.BeesCaatinga.service;

import io.sage.BeesCaatinga.controller.dto.ColmeiaAtualizadaDTO;
import io.sage.BeesCaatinga.controller.dto.ColmeiaCriadaDTO;
import io.sage.BeesCaatinga.controller.dto.ColmeiaRetornoDTO;
import io.sage.BeesCaatinga.controller.dto.ColmeiaRetornoEmApiarioDTO;
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

    public ColmeiaRetornoDTO salvar(ColmeiaCriadaDTO dto){
        var colmeia = mapper.toEntityFromCriada(dto, apiarioRepository);
        repository.save(colmeia);
        return mapper.toRetornoDTO(colmeia);
    }

    public ColmeiaRetornoDTO buscarPorId(Long id){
        var colmeia = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Colméia não encontrada!"));
        return mapper.toRetornoDTO(colmeia);
    }

    public List<ColmeiaRetornoEmApiarioDTO> listar(){
        var lista = repository.findAll();
        return lista.stream()
                .map(mapper::toRetornoEmApiarioDTO)
                .toList();
    }

    public ColmeiaRetornoDTO atualizar(Long id, ColmeiaAtualizadaDTO dto){
        var colmeia = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Colméia não encontrada!"));

        colmeia.setIdentificador(dto.identificador());
        var apiario = apiarioRepository.findById(dto.apiario_id())
                .orElseThrow(() -> new ResourceNotFoundException("Apiário não encontrado"));
        colmeia.setApiario(apiario);
        colmeia.setTipo(dto.tipo());
        colmeia.setAtiva(dto.ativa());
        colmeia.setObservacoes(dto.observacoes());
        colmeia.setDetalhesDaLocalizacao(dto.detalhesDaLocalizacao());
        colmeia.setCaminhoDaFoto(dto.caminhoDaFoto());
        colmeia.setLatitude(dto.latitude());
        colmeia.setLongitude(dto.longitude());

        repository.save(colmeia);
        return mapper.toRetornoDTO(colmeia);
    }

    public void deletar(Long id){
        var colmeia = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Colméia não encontrada!"));
        repository.delete(colmeia);
    }

}

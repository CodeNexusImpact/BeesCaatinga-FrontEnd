package io.sage.BeesCaatinga.service;

import io.sage.BeesCaatinga.controller.dto.colmeia.ColmeiaAtualizadaDTO;
import io.sage.BeesCaatinga.controller.dto.colmeia.ColmeiaCriadaDTO;
import io.sage.BeesCaatinga.controller.dto.colmeia.ColmeiaRetornoDTO;
import io.sage.BeesCaatinga.controller.exception.ResourceNotFoundException;
import io.sage.BeesCaatinga.controller.mapper.ColmeiaMapper;
import io.sage.BeesCaatinga.model.Colmeia;
import io.sage.BeesCaatinga.model.Vistoria;
import io.sage.BeesCaatinga.repository.ApiarioRepository;
import io.sage.BeesCaatinga.repository.ColmeiaRepository;
import io.sage.BeesCaatinga.repository.VistoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ColmeiaService {

    private final ApiarioRepository apiarioRepository;
    private final VistoriaRepository vistoriaRepository;

    private final ColmeiaRepository colmeiaRepository;
    private final ColmeiaMapper colmeiaMapper;

    public ColmeiaRetornoDTO salvar(Long produtorId, Long apiarioId, ColmeiaCriadaDTO dto){
        var apiario = apiarioRepository.findById(apiarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Apiário não encontrado!"));

        if (!apiario.getProdutor().getId().equals(produtorId)) {
            throw new ResourceNotFoundException("Apiário não pertence ao produtor!");
        }

        var colmeia = colmeiaMapper.toEntityFromCriada(dto, apiarioRepository);
        colmeia.setApiario(apiario);

        colmeiaRepository.save(colmeia);
        return colmeiaMapper.toRetornoDTO(colmeia);
    }

    public List<ColmeiaRetornoDTO> listar(Long produtorId, Long apiarioId) {
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

    public List<ColmeiaRetornoDTO> listarPorProdutor(Long produtorId) {
        var lista = colmeiaRepository.findByApiarioProdutorId(produtorId);
        return lista.stream()
                .map(colmeiaMapper::toRetornoDTO)
                .toList();
    }

    public List<ColmeiaRetornoDTO> listarAtivas(Long produtorId, Long apiarioId) {
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

    public List<ColmeiaRetornoDTO> listarInativas(Long produtorId, Long apiarioId) {
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

    public ColmeiaRetornoDTO atualizar(Long produtorId, Long apiarioId, Long colmeiaId, ColmeiaAtualizadaDTO dto){
        var colmeia = validarColmeiaDoProdutor(produtorId, apiarioId, colmeiaId);

        if (dto.identificador() != null) colmeia.setIdentificador(dto.identificador());
        if (dto.tipo() != null) colmeia.setTipo(dto.tipo());
        if (dto.ativa() != null) colmeia.setAtiva(dto.ativa());
        if (dto.observacoes() != null) colmeia.setObservacoes(dto.observacoes());
        if (dto.detalhesDaLocalizacao() != null) colmeia.setDetalhesDaLocalizacao(dto.detalhesDaLocalizacao());
        if (dto.caminhoDaFoto() != null) colmeia.setCaminhoDaFoto(dto.caminhoDaFoto());
        if (dto.latitude() != null) colmeia.setLatitude(dto.latitude());
        if (dto.longitude() != null) colmeia.setLongitude(dto.longitude());

        colmeiaRepository.save(colmeia);
        return colmeiaMapper.toRetornoDTO(colmeia);
    }

    public void deletar(Long produtorId, Long apiarioId, Long colmeiaId){
        var colmeia = validarColmeiaDoProdutor(produtorId, apiarioId, colmeiaId);

        List<Vistoria> vistorias = vistoriaRepository.findByColmeiaId(colmeiaId);
        if (!vistorias.isEmpty()) {
            vistoriaRepository.deleteAll(vistorias);
        }

        colmeiaRepository.delete(colmeia);
    }

    private Colmeia validarColmeiaDoProdutor(Long produtorId, Long apiarioId, Long colmeiaId) {
        var colmeia = colmeiaRepository.findById(colmeiaId)
                .orElseThrow(() -> new ResourceNotFoundException("Colmeia não encontrada com id: " + colmeiaId));

        if (!colmeia.getApiario().getId().equals(apiarioId)) {
            throw new ResourceNotFoundException("Colmeia não pertence ao apiário informado");
        }

        if (!colmeia.getApiario().getProdutor().getId().equals(produtorId)) {
            throw new ResourceNotFoundException("Apiário não pertence ao produtor informado");
        }

        return colmeia;
    }

}

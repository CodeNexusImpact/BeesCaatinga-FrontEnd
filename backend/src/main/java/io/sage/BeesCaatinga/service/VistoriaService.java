package io.sage.BeesCaatinga.service;

import io.sage.BeesCaatinga.controller.dto.vistoria.VistoriaAtualizadaDTO;
import io.sage.BeesCaatinga.controller.dto.vistoria.VistoriaCriadaDTO;
import io.sage.BeesCaatinga.controller.dto.vistoria.VistoriaRetornoDTO;
import io.sage.BeesCaatinga.controller.exception.ResourceNotFoundException;
import io.sage.BeesCaatinga.controller.mapper.VistoriaMapper;
import io.sage.BeesCaatinga.model.Apiario;
import io.sage.BeesCaatinga.model.Colmeia;
import io.sage.BeesCaatinga.model.Vistoria;
import io.sage.BeesCaatinga.repository.ApiarioRepository;
import io.sage.BeesCaatinga.repository.ColmeiaRepository;
import io.sage.BeesCaatinga.repository.ProdutorRepository;
import io.sage.BeesCaatinga.repository.VistoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VistoriaService {

    private final ProdutorRepository repository;
    private final ApiarioRepository apiarioRepository;
    private final ColmeiaRepository colmeiaRepository;

    private final VistoriaRepository vistoriaRepository;
    private final VistoriaMapper vistoriaMapper;

    // OPERAÇÕES DE VISTORIA
    public VistoriaRetornoDTO salvarVistoria(Long produtorId, Long apiarioId, Long colmeiaId, VistoriaCriadaDTO dto){
        var colmeia = validarColmeiaDoProdutor(produtorId, apiarioId, colmeiaId);

        if (!dto.apiario_id().equals(apiarioId)) {
            throw new IllegalArgumentException("Apiário do DTO não corresponde ao apiário da URL");
        }

        if (!dto.colmeia_id().equals(colmeiaId)) {
            throw new IllegalArgumentException("Colmeia do DTO não corresponde à colmeia da URL");
        }

        var vistoria = vistoriaMapper.toEntityFromCriada(dto, apiarioRepository, colmeiaRepository);
        vistoriaRepository.save(vistoria);

        colmeia.setUltimaVistoria(dto.dataVistoria());
        colmeiaRepository.save(colmeia);

        return vistoriaMapper.toRetornoDTO(vistoria);
    }

    public List<VistoriaRetornoDTO> listarVistoriasDoProdutor(Long produtorId){
        if (!repository.existsById(produtorId)) {
            throw new ResourceNotFoundException("Produtor não encontrado com id: " + produtorId);
        }

        List<Vistoria> vistorias = vistoriaRepository.findByApiarioProdutorId(produtorId);

        return vistorias.stream()
                .map(vistoriaMapper::toRetornoDTO)
                .toList();
    }

    public VistoriaRetornoDTO atualizarVistoria(Long produtorId, Long vistoriaId, VistoriaAtualizadaDTO dto){
        var vistoria = validarVistoriaDoProdutor(produtorId, vistoriaId);

        if (dto.dataVistoria() != null) vistoria.setDataVistoria(dto.dataVistoria());
        if (dto.condicao() != null) vistoria.setCondicao(dto.condicao());
        if (dto.pragasIdentificadas() != null) vistoria.setPragasIdentificadas(dto.pragasIdentificadas());
        if (dto.perdasIdentificadas() != null) vistoria.setPerdasIdentificadas(dto.perdasIdentificadas());
        if (dto.observacoes() != null) vistoria.setObservacoes(dto.observacoes());

        if (dto.apiario_id() != null && !dto.apiario_id().equals(vistoria.getApiario().getId())) {
            var novoApiario = validarApiarioDoProdutor(produtorId, dto.apiario_id());
            vistoria.setApiario(novoApiario);
        }

        if (dto.colmeia_id() != null && !dto.colmeia_id().equals(vistoria.getColmeia().getId())) {
            var novaColmeia = colmeiaRepository.findById(dto.colmeia_id())
                    .orElseThrow(() -> new ResourceNotFoundException("Colmeia não encontrada"));

            if (!novaColmeia.getApiario().getProdutor().getId().equals(produtorId)) {
                throw new ResourceNotFoundException("Nova colmeia não pertence ao produtor");
            }

            vistoria.setColmeia(novaColmeia);
        }

        vistoriaRepository.save(vistoria);
        return vistoriaMapper.toRetornoDTO(vistoria);
    }

    public void deletarVistoria(Long produtorId, Long vistoriaId){
        var vistoria = validarVistoriaDoProdutor(produtorId, vistoriaId);
        vistoriaRepository.delete(vistoria);
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

    private Vistoria validarVistoriaDoProdutor(Long produtorId, Long vistoriaId) {
        var vistoria = vistoriaRepository.findById(vistoriaId)
                .orElseThrow(() -> new ResourceNotFoundException("Vistoria não encontrada com id: " + vistoriaId));

        if (!vistoria.getApiario().getProdutor().getId().equals(produtorId)) {
            throw new ResourceNotFoundException("Vistoria não pertence ao produtor informado");
        }

        return vistoria;
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

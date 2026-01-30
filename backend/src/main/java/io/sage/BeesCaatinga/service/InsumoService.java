package io.sage.BeesCaatinga.service;

import io.sage.BeesCaatinga.controller.dto.insumo.InsumoAtualizadoDTO;
import io.sage.BeesCaatinga.controller.dto.insumo.InsumoCriadoDTO;
import io.sage.BeesCaatinga.controller.dto.insumo.InsumoRetornoDTO;
import io.sage.BeesCaatinga.controller.exception.ResourceNotFoundException;
import io.sage.BeesCaatinga.controller.mapper.InsumoMapper;
import io.sage.BeesCaatinga.model.Insumo;
import io.sage.BeesCaatinga.repository.InsumoRepository;
import io.sage.BeesCaatinga.repository.ProdutorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InsumoService {

    private final ProdutorRepository repository;

    private final InsumoRepository insumoRepository;
    private final InsumoMapper insumoMapper;

    // OPERAÇÕES DE INSUMO
    public InsumoRetornoDTO salvarInsumo(Long produtorId, InsumoCriadoDTO dto) {
        var produtor = repository.findById(produtorId)
                .orElseThrow(() -> new ResourceNotFoundException("Produtor não encontrado com id: " + produtorId));

        var insumo = insumoMapper.toEntityFromCriado(dto);
        insumo.setProdutor(produtor);

        if (insumo.getObservacoes() == null || insumo.getObservacoes().isBlank()) {
            insumo.setObservacoes("Não informado");
        }

        insumoRepository.save(insumo);
        return insumoMapper.toRetornoDTO(insumo);
    }

    public List<InsumoRetornoDTO> listarInsumosDoProdutor(Long produtorId) {
        if (!repository.existsById(produtorId)) {
            throw new ResourceNotFoundException("Produtor não encontrado com id: " + produtorId);
        }

        List<Insumo> insumos = insumoRepository.findByProdutorId(produtorId);

        return insumos.stream()
                .map(insumoMapper::toRetornoDTO)
                .toList();
    }

    public InsumoRetornoDTO atualizarInsumoDoProdutor(Long produtorId, Long insumoId, InsumoAtualizadoDTO dto) {
        var insumo = validarInsumoDoProdutor(produtorId, insumoId);

        if (dto.dataEntrada() != null) insumo.setDataEntrada(dto.dataEntrada());
        if (dto.nome() != null) insumo.setNome(dto.nome());
        if (dto.tipo() != null) insumo.setTipo(dto.tipo());
        if (dto.quantidade() != null) insumo.setQuantidade(dto.quantidade());
        if (dto.unidadeMedida() != null) insumo.setUnidadeMedida(dto.unidadeMedida());
        if (dto.statusInsumo() != null) insumo.setStatusInsumo(dto.statusInsumo());
        if (dto.dataValidade() != null) insumo.setDataValidade(dto.dataValidade());
        if (dto.observacoes() != null) insumo.setObservacoes(dto.observacoes());

        insumoRepository.save(insumo);
        return insumoMapper.toRetornoDTO(insumo);
    }

    public void deletarInsumoDoProdutor(Long produtorId, Long insumoId) {
        var insumo = validarInsumoDoProdutor(produtorId, insumoId);
        insumoRepository.delete(insumo);
    }

    private Insumo validarInsumoDoProdutor(Long produtorId, Long insumoId) {
        var insumo = insumoRepository.findById(insumoId)
                .orElseThrow(() -> new ResourceNotFoundException("Insumo não encontrado com id: " + insumoId));

        if (insumo.getProdutor() == null || !insumo.getProdutor().getId().equals(produtorId)) {
            throw new ResourceNotFoundException("Insumo não pertence ao produtor informado");
        }
        return insumo;
    }

}

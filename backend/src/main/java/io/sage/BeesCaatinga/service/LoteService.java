package io.sage.BeesCaatinga.service;

import io.sage.BeesCaatinga.controller.dto.lote.LoteCriadoDTO;
import io.sage.BeesCaatinga.controller.dto.lote.LoteRetornoCodigoDTO;
import io.sage.BeesCaatinga.controller.dto.lote.LoteRetornoListadoDTO;
import io.sage.BeesCaatinga.controller.exception.ResourceNotFoundException;
import io.sage.BeesCaatinga.controller.mapper.LoteMapper;
import io.sage.BeesCaatinga.model.Lote;
import io.sage.BeesCaatinga.repository.ApiarioRepository;
import io.sage.BeesCaatinga.repository.LoteRepository;
import io.sage.BeesCaatinga.repository.ProdutorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LoteService {

    private final ProdutorRepository repository;
    private final ApiarioRepository apiarioRepository;

    private final LoteRepository loteRepository;
    private final LoteMapper loteMapper;

    public LoteRetornoCodigoDTO salvar(Long produtorId, LoteCriadoDTO dto) {
        // Busca o apiário por nome e valida se pertence ao produtor
        var apiario = apiarioRepository.findByNome(dto.nomeApiario())
                .orElseThrow(() -> new ResourceNotFoundException("Apiário não encontrado com nome: " + dto.nomeApiario()));

        // Valida se o apiário pertence ao produtor
        if (!apiario.getProdutor().getId().equals(produtorId)) {
            throw new ResourceNotFoundException("Apiário não pertence ao produtor informado");
        }

        // Converte DTO para entidade
        var lote = loteMapper.toEntityFromCriado(dto, apiarioRepository);

        // Salva o lote
        loteRepository.save(lote);
        return loteMapper.toRetornoCodigoDTO(lote);
    }

    public List<LoteRetornoCodigoDTO> listarCodigos(Long produtorId) {
        // Verifica se o produtor existe
        if (!repository.existsById(produtorId)) {
            throw new ResourceNotFoundException("Produtor não encontrado com id: " + produtorId);
        }

        // Busca todos os lotes do produtor
        List<Lote> lotes = loteRepository.findByApiarioProdutorId(produtorId);

        return lotes.stream()
                .map(loteMapper::toRetornoCodigoDTO)
                .toList();
    }

    public List<LoteRetornoListadoDTO> listarDetalhados(Long produtorId) {
        // Verifica se o produtor existe
        if (!repository.existsById(produtorId)) {
            throw new ResourceNotFoundException("Produtor não encontrado com id: " + produtorId);
        }

        // Busca lotes do produtor
        List<Lote> lotes = loteRepository.findByApiarioProdutorId(produtorId);

        return lotes.stream()
                .map(loteMapper::toRetornoListadoDTO)
                .toList();
    }

}

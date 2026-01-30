package io.sage.BeesCaatinga.service;

import io.sage.BeesCaatinga.controller.dto.producao.ProducaoAtualizadaDTO;
import io.sage.BeesCaatinga.controller.dto.producao.ProducaoCriadaDTO;
import io.sage.BeesCaatinga.controller.dto.producao.ProducaoRetornoDTO;
import io.sage.BeesCaatinga.controller.exception.ResourceNotFoundException;
import io.sage.BeesCaatinga.controller.mapper.ProducaoMapper;
import io.sage.BeesCaatinga.model.Apiario;
import io.sage.BeesCaatinga.model.Producao;
import io.sage.BeesCaatinga.repository.ApiarioRepository;
import io.sage.BeesCaatinga.repository.ColmeiaRepository;
import io.sage.BeesCaatinga.repository.ProducaoRepository;
import io.sage.BeesCaatinga.repository.ProdutorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProducaoService {

    private final ApiarioRepository apiarioRepository;
    private final ColmeiaRepository colmeiaRepository;
    private final ProdutorRepository repository;

    private final ProducaoRepository producaoRepository;
    private final ProducaoMapper producaoMapper;

    public ProducaoRetornoDTO salvarProducao(Long produtorId, ProducaoCriadaDTO dto) {
        // Valida se apiário e colmeia pertencem ao produtor
        validarProducaoDoProdutor(produtorId, dto.apiarioId(), dto.colmeiaId());

        var producao = producaoMapper.toEntityFromCriada(dto, apiarioRepository, colmeiaRepository);
        producaoRepository.save(producao);
        return producaoMapper.toRetornoDTO(producao);
    }

    public List<ProducaoRetornoDTO> listarProducoesDoProdutor(Long produtorId) {
        if (!repository.existsById(produtorId)) {
            throw new ResourceNotFoundException("Produtor não encontrado com id: " + produtorId);
        }

        List<Producao> producoes = producaoRepository.findByApiarioProdutorId(produtorId);

        return producoes.stream()
                .map(producaoMapper::toRetornoDTO)
                .toList();
    }

    public ProducaoRetornoDTO atualizarProducaoDoProdutor(Long produtorId, Long producaoId, ProducaoAtualizadaDTO dto) {
        // Valida se a produção existe e pertence ao produtor
        var producao = validarProducaoDoProdutor(produtorId, producaoId);

        // Atualiza apenas campos não nulos (PATCH)
        if (dto.tipoProducao() != null) producao.setTipoProducao(dto.tipoProducao());
        if (dto.quantidade() != null) producao.setQuantidade(dto.quantidade());
        if (dto.unidadeMedida() != null) producao.setUnidadeMedida(dto.unidadeMedida());
        if (dto.dataColeta() != null) producao.setDataColeta(dto.dataColeta());

        // Se mudar de apiário, valida se o novo apiário pertence ao produtor
        if (dto.apiarioId() != null && !dto.apiarioId().equals(producao.getApiario().getId())) {
            var novoApiario = validarApiarioDoProdutor(produtorId, dto.apiarioId());
            producao.setApiario(novoApiario);
        }

        // Se mudar de colmeia, valida se a nova colmeia pertence ao produtor
        if (dto.colmeiaId() != null && !dto.colmeiaId().equals(producao.getColmeia().getId())) {
            // Valida se a nova colmeia pertence a algum apiário do produtor
            var novaColmeia = colmeiaRepository.findById(dto.colmeiaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Colmeia não encontrada"));

            if (!novaColmeia.getApiario().getProdutor().getId().equals(produtorId)) {
                throw new ResourceNotFoundException("Nova colmeia não pertence ao produtor");
            }

            producao.setColmeia(novaColmeia);
        }

        // Salva as alterações (o @PreUpdate vai recalcular os litros automaticamente)
        producaoRepository.save(producao);

        return producaoMapper.toRetornoDTO(producao);
    }

    public void deletarProducaoDoProdutor(Long produtorId, Long producaoId) {
        // Valida se a produção existe e pertence ao produtor
        var producao = validarProducaoDoProdutor(produtorId, producaoId);

        // Deleta a produção
        producaoRepository.delete(producao);
    }

    private Producao validarProducaoDoProdutor(Long produtorId, Long producaoId) {
        // Verifica se a produção existe
        var producao = producaoRepository.findById(producaoId)
                .orElseThrow(() -> new ResourceNotFoundException("Produção não encontrada com id: " + producaoId));

        // Verifica se a produção pertence ao produtor
        if (!producao.getApiario().getProdutor().getId().equals(produtorId)) {
            throw new ResourceNotFoundException("Produção não pertence ao produtor informado");
        }

        return producao;
    }

    private void validarProducaoDoProdutor(Long produtorId, Long apiarioId, Long colmeiaId) {
        // Valida se o apiário pertence ao produtor
        var apiario = validarApiarioDoProdutor(produtorId, apiarioId);

        // Valida se a colmeia pertence ao apiário
        var colmeia = colmeiaRepository.findById(colmeiaId)
                .orElseThrow(() -> new ResourceNotFoundException("Colmeia não encontrada"));

        if (!colmeia.getApiario().getId().equals(apiarioId)) {
            throw new ResourceNotFoundException("Colmeia não pertence ao apiário informado");
        }
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

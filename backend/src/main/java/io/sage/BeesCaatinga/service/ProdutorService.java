package io.sage.BeesCaatinga.service;

import io.sage.BeesCaatinga.controller.dto.apiario.ApiarioAtualizadoDTO;
import io.sage.BeesCaatinga.controller.dto.apiario.ApiarioCriadoDTO;
import io.sage.BeesCaatinga.controller.dto.apiario.ApiarioRetornoDTO;
import io.sage.BeesCaatinga.controller.dto.colmeia.ColmeiaAtualizadaDTO;
import io.sage.BeesCaatinga.controller.dto.colmeia.ColmeiaCriadaDTO;
import io.sage.BeesCaatinga.controller.dto.colmeia.ColmeiaRetornoDTO;
import io.sage.BeesCaatinga.controller.dto.insumo.InsumoAtualizadoDTO;
import io.sage.BeesCaatinga.controller.dto.insumo.InsumoCriadoDTO;
import io.sage.BeesCaatinga.controller.dto.insumo.InsumoRetornoDTO;
import io.sage.BeesCaatinga.controller.dto.producao.ProducaoAtualizadaDTO;
import io.sage.BeesCaatinga.controller.dto.producao.ProducaoCriadaDTO;
import io.sage.BeesCaatinga.controller.dto.producao.ProducaoRetornoDTO;
import io.sage.BeesCaatinga.controller.dto.produtor.ProdutorAtualizadoDTO;
import io.sage.BeesCaatinga.controller.dto.produtor.ProdutorCriadoDTO;
import io.sage.BeesCaatinga.controller.dto.produtor.ProdutorRetornoDTO;
import io.sage.BeesCaatinga.controller.dto.vistoria.VistoriaAtualizadaDTO;
import io.sage.BeesCaatinga.controller.dto.vistoria.VistoriaCriadaDTO;
import io.sage.BeesCaatinga.controller.dto.vistoria.VistoriaRetornoDTO;
import io.sage.BeesCaatinga.controller.exception.ResourceNotFoundException;
import io.sage.BeesCaatinga.controller.mapper.*;
import io.sage.BeesCaatinga.model.*;
import io.sage.BeesCaatinga.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProdutorService {

    private final ProdutorRepository repository;
    private final ProdutorMapper mapper;

    private final ApiarioRepository apiarioRepository;
    private final ApiarioMapper apiarioMapper;

    private final ColmeiaRepository colmeiaRepository;
    private final ColmeiaMapper colmeiaMapper;

    private final VistoriaRepository vistoriaRepository;
    private final VistoriaMapper vistoriaMapper;

    private final InsumoRepository insumoRepository;
    private final InsumoMapper insumoMapper;

    private final ProducaoRepository producaoRepository;
    private final ProducaoMapper producaoMapper;

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

        if (dto.caminhoDaFoto() != null) produtor.setCaminhoDaFoto(dto.caminhoDaFoto());
        if (dto.nomeCompleto() != null) produtor.setNomeCompleto(dto.nomeCompleto());
        if (dto.genero() != null) produtor.setGenero(dto.genero());
        if (dto.nomeDaEmpresa() != null) produtor.setNomeDaEmpresa(dto.nomeDaEmpresa());
        if (dto.telefone() != null) produtor.setTelefone(dto.telefone());
        if (dto.endereco() != null) produtor.setEndereco(dto.endereco());

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

    public ApiarioRetornoDTO atualizarApiarioDoProdutor(Long produtorId, Long apiarioId, ApiarioAtualizadoDTO dto){
        var apiario = apiarioRepository.findById(apiarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Apiário não encontrado com id: " + apiarioId));

        if (!apiario.getProdutor().getId().equals(produtorId)) {
            throw new ResourceNotFoundException("Apiário não pertence ao produtor informado");
        }

        if (dto.nome() != null) apiario.setNome(dto.nome());
        if (dto.nRegistro() != null) apiario.setNRegistro(dto.nRegistro());
        if (dto.dataDeCriacao() != null) apiario.setDataDeCriacao(dto.dataDeCriacao());
        if (dto.observacoes() != null) apiario.setObservacoes(dto.observacoes());
        if (dto.cep() != null) apiario.setCep(dto.cep());
        if (dto.nomeDaPropriedade() != null) apiario.setNomeDaPropriedade(dto.nomeDaPropriedade());
        if (dto.estado() != null) apiario.setEstado(dto.estado());
        if (dto.cidade() != null) apiario.setCidade(dto.cidade());
        if (dto.bairro() != null) apiario.setBairro(dto.bairro());
        if (dto.rua() != null) apiario.setRua(dto.rua());
        if (dto.numero() != null) apiario.setNumero(dto.numero());
        if (dto.complemento() != null) apiario.setComplemento(dto.complemento());
        if (dto.caminhoDaFoto() != null) apiario.setCaminhoDaFoto(dto.caminhoDaFoto());
        if (dto.latitude() != null) apiario.setLatitude(dto.latitude());
        if (dto.longitude() != null) apiario.setLongitude(dto.longitude());

        apiarioRepository.save(apiario);
        return apiarioMapper.toRetornoDTO(apiario);
    }

    public void deletarApiarioDoProdutor(Long produtorId, Long apiarioId){
        var apiario = apiarioRepository.findById(apiarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Apiário não encontrado com id: " + apiarioId));

        if (!apiario.getProdutor().getId().equals(produtorId)) {
            throw new ResourceNotFoundException("Apiário não pertence ao produtor informado");
        }

        // Verifica se existem colmeias ativas no apiário,
        boolean hasColmeiasAtivas = apiario.getColmeias().stream()
                .anyMatch(Colmeia::getAtiva);
        if (hasColmeiasAtivas) {
            throw new IllegalStateException("Não é possível deletar apiário com colmeias ativas");
        }

        // Deleta o apiário (cascade vai deletar colmeias inativas automaticamente, já que não deleta com ativas)
        apiarioRepository.delete(apiario);
    }

    private Apiario validarApiarioDoProdutor(Long produtorId, Long apiarioId) {
        var apiario = apiarioRepository.findById(apiarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Apiário não encontrado com id: " + apiarioId));

        if (!apiario.getProdutor().getId().equals(produtorId)) {
            throw new ResourceNotFoundException("Apiário não pertence ao produtor informado");
        }

        return apiario;
    }


    // OPERAÇÕES DE COLMEIA
    public ColmeiaRetornoDTO salvarColmeia(Long produtorId, Long apiarioId, ColmeiaCriadaDTO dto){
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

    public ColmeiaRetornoDTO atualizarColmeiaDoProdutor(Long produtorId, Long apiarioId, Long colmeiaId, ColmeiaAtualizadaDTO dto){
        var colmeia = validarColmeiaDoProdutor(produtorId, apiarioId, colmeiaId);

        if (dto.identificador() != null) colmeia.setIdentificador(dto.identificador());
        if (dto.tipo() != null) colmeia.setTipo(dto.tipo());
        if (dto.ativa() != null) colmeia.setAtiva(dto.ativa());
        if (dto.observacoes() != null) colmeia.setObservacoes(dto.observacoes());
        if (dto.detalhesDaLocalizacao() != null) colmeia.setDetalhesDaLocalizacao(dto.detalhesDaLocalizacao());
        if (dto.caminhoDaFoto() != null) colmeia.setCaminhoDaFoto(dto.caminhoDaFoto());
        if (dto.latitude() != null) colmeia.setLatitude(dto.latitude());
        if (dto.longitude() != null) colmeia.setLongitude(dto.longitude());

        if (dto.apiario_id() != null && !dto.apiario_id().equals(apiarioId)) {
            var novoApiario = apiarioRepository.findById(dto.apiario_id())
                    .orElseThrow(() -> new ResourceNotFoundException("Apiário não encontrado com id: " + dto.apiario_id()));

            if (!novoApiario.getProdutor().getId().equals(produtorId)) {
                throw new ResourceNotFoundException("Novo apiário não pertence ao produtor");
            }

            colmeia.setApiario(novoApiario);
        }

        colmeiaRepository.save(colmeia);
        return colmeiaMapper.toRetornoDTO(colmeia);
    }

    public void deletarColmeiaDoProdutor(Long produtorId, Long apiarioId, Long colmeiaId){
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

    private Vistoria validarVistoriaDoProdutor(Long produtorId, Long vistoriaId) {
        var vistoria = vistoriaRepository.findById(vistoriaId)
                .orElseThrow(() -> new ResourceNotFoundException("Vistoria não encontrada com id: " + vistoriaId));

        if (!vistoria.getApiario().getProdutor().getId().equals(produtorId)) {
            throw new ResourceNotFoundException("Vistoria não pertence ao produtor informado");
        }

        return vistoria;
    }


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


    // OPERAÇÕES DE PRODUÇÃO
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

}
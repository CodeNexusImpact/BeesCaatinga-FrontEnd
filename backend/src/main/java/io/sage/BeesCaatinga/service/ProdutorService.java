package io.sage.BeesCaatinga.service;

import io.sage.BeesCaatinga.controller.dto.apiario.ApiarioAtualizadoDTO;
import io.sage.BeesCaatinga.controller.dto.apiario.ApiarioCriadoDTO;
import io.sage.BeesCaatinga.controller.dto.apiario.ApiarioRetornoDTO;
import io.sage.BeesCaatinga.controller.dto.colmeia.ColmeiaAtualizadaDTO;
import io.sage.BeesCaatinga.controller.dto.colmeia.ColmeiaCriadaDTO;
import io.sage.BeesCaatinga.controller.dto.colmeia.ColmeiaRetornoDTO;
import io.sage.BeesCaatinga.controller.dto.produtor.ProdutorAtualizadoDTO;
import io.sage.BeesCaatinga.controller.dto.produtor.ProdutorCriadoDTO;
import io.sage.BeesCaatinga.controller.dto.produtor.ProdutorRetornoDTO;
import io.sage.BeesCaatinga.controller.dto.vistoria.VistoriaAtualizadaDTO;
import io.sage.BeesCaatinga.controller.dto.vistoria.VistoriaCriadaDTO;
import io.sage.BeesCaatinga.controller.dto.vistoria.VistoriaRetornoDTO;
import io.sage.BeesCaatinga.controller.exception.ResourceNotFoundException;
import io.sage.BeesCaatinga.controller.mapper.ApiarioMapper;
import io.sage.BeesCaatinga.controller.mapper.ColmeiaMapper;
import io.sage.BeesCaatinga.controller.mapper.ProdutorMapper;
import io.sage.BeesCaatinga.controller.mapper.VistoriaMapper;
import io.sage.BeesCaatinga.model.Colmeia;
import io.sage.BeesCaatinga.repository.ApiarioRepository;
import io.sage.BeesCaatinga.repository.ColmeiaRepository;
import io.sage.BeesCaatinga.repository.ProdutorRepository;
import io.sage.BeesCaatinga.repository.VistoriaRepository;
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

    private final ColmeiaRepository colmeiaRepository;
    private final ColmeiaMapper colmeiaMapper;

    private final VistoriaRepository vistoriaRepository;
    private final VistoriaMapper vistoriaMapper;

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

    }

    public void deletarColmeiaDoProdutor(Long produtorId, Long apiarioId, Long colmeiaId){

    }


    // OPERAÇÕES DE VISTORIA
    public VistoriaRetornoDTO salvarVistoria(Long produtorId, Long apiarioId, Long colmeiaId, VistoriaCriadaDTO dto){

    }

    public VistoriaRetornoDTO listarVistoriasDoProdutor(Long produtorId){
        // sendo que, para acessar produtor precisa ir vistoria.apiario.produtor.id
    }

    public VistoriaRetornoDTO atualizarVistoria(Long produtorId, Long vistoriaId, VistoriaAtualizadaDTO dto){
        // verificar se produtor tem relação com vistoria, ou seja produtor.apiarios contém vistoria.apiario
    }

    public void deletarVistoria(Long produtorId, Long vistoriaId){
        // verificar se vistoria pertence ao produtor antes de deletar
    }

}

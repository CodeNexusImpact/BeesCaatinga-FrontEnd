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
import io.sage.BeesCaatinga.controller.dto.lote.LoteCriadoDTO;
import io.sage.BeesCaatinga.controller.dto.lote.LoteRetornoCodigoDTO;
import io.sage.BeesCaatinga.controller.dto.lote.LoteRetornoListadoDTO;
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

    /*
    private Long getProdutorIdLogado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

    //     if (authentication == null || !authentication.isAuthenticated()) {
    //         throw new RuntimeException("Usuário não autenticado");
    //     }

    //     // Aqui você terá seu UserDetails implementado pelo Produtor (ou Usuario)
    //     var usuarioLogado = (UserDetailsImpl) authentication.getPrincipal();

    //     return usuarioLogado.getId(); // retornar o ID do produtor
    // }

     */

}
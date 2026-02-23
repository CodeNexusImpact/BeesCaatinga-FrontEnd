package io.sage.BeesCaatinga.controller;

import io.sage.BeesCaatinga.controller.dto.apiario.ApiarioCriadoDTO;
import io.sage.BeesCaatinga.controller.dto.apiario.ApiarioRetornoDTO;
import io.sage.BeesCaatinga.controller.dto.colmeia.ColmeiaCriadaDTO;
import io.sage.BeesCaatinga.controller.dto.colmeia.ColmeiaRetornoDTO;
import io.sage.BeesCaatinga.controller.dto.produtor.ProdutorAtualizadoDTO;
import io.sage.BeesCaatinga.controller.dto.produtor.ProdutorCriadoDTO;
import io.sage.BeesCaatinga.controller.dto.produtor.ProdutorRetornoDTO;
import io.sage.BeesCaatinga.service.ProdutorService;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;

@RestController
@RequestMapping("/produtores")
@RequiredArgsConstructor
public class ProdutorController {

    private final ProdutorService service;

    @PostMapping
    @Transactional
    public ResponseEntity<ProdutorRetornoDTO> cadastrar(@RequestBody @Valid ProdutorCriadoDTO dto, UriComponentsBuilder uriBuilder){
        var produtorSalvo = service.salvar(dto);
        var uri = uriBuilder.path("/produtores/{id}").buildAndExpand(produtorSalvo.id()).toUri();
        return ResponseEntity.created(uri).body(produtorSalvo);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProdutorRetornoDTO> buscar(@PathVariable Long id){
        var produtor = service.buscarPorId(id);
        return ResponseEntity.ok(produtor);
    }

    @GetMapping
    public ResponseEntity<List<ProdutorRetornoDTO>> listar(){
        var listaProdutores = service.listar();
        return ResponseEntity.ok(listaProdutores);
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<ProdutorRetornoDTO> atualizar(@PathVariable Long id, @RequestBody @Valid ProdutorAtualizadoDTO dto){
        var produtorAtualizado = service.atualizar(id, dto);
        return ResponseEntity.ok(produtorAtualizado);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> deletar(@PathVariable Long id){
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }

}
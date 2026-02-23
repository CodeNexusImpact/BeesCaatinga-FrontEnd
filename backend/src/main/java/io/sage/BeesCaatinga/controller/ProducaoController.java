package io.sage.BeesCaatinga.controller;

import io.sage.BeesCaatinga.controller.dto.apiario.ApiarioAtualizadoDTO;
import io.sage.BeesCaatinga.controller.dto.apiario.ApiarioCriadoDTO;
import io.sage.BeesCaatinga.controller.dto.apiario.ApiarioRetornoDTO;
import io.sage.BeesCaatinga.controller.dto.producao.ProducaoAtualizadaDTO;
import io.sage.BeesCaatinga.controller.dto.producao.ProducaoCriadaDTO;
import io.sage.BeesCaatinga.controller.dto.producao.ProducaoRetornoDTO;
import io.sage.BeesCaatinga.service.ProducaoService;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/producoes")
@RequiredArgsConstructor
public class ProducaoController {

    private final ProducaoService service;

    @PostMapping("/{produtorId}")
    @Transactional
    public ResponseEntity<ProducaoRetornoDTO> cadastrar(
            @PathVariable Long produtorId,
            @RequestBody @Valid ProducaoCriadaDTO dto) {

        var producaoSalva = service.salvar(produtorId, dto);
        return ResponseEntity.ok(producaoSalva);
    }

    @GetMapping("/{produtorId}")
    public ResponseEntity<List<ProducaoRetornoDTO>> listar(@PathVariable Long produtorId){
        var producoes = service.listar(produtorId);
        return ResponseEntity.ok(producoes);
    }

    @PutMapping("/{producaoId}/produtor/{produtorId}")
    @Transactional
    public ResponseEntity<ProducaoRetornoDTO> atualizar(@RequestBody @Valid ProducaoAtualizadaDTO dto, @PathVariable Long producaoId, @PathVariable Long produtorId){
        var producao = service.atualizar(produtorId, producaoId, dto);
        return ResponseEntity.ok(producao);
    }

    @DeleteMapping("/{producaoId}/produtor/{produtorId}")
    @Transactional
    public ResponseEntity<Void> deletar(@PathVariable Long producaoId, @PathVariable Long produtorId){
        service.deletar(produtorId, producaoId);
        return ResponseEntity.noContent().build();
    }

}

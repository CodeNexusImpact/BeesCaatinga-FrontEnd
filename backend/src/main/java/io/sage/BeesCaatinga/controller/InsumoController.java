package io.sage.BeesCaatinga.controller;

import io.sage.BeesCaatinga.controller.dto.apiario.ApiarioAtualizadoDTO;
import io.sage.BeesCaatinga.controller.dto.apiario.ApiarioRetornoDTO;
import io.sage.BeesCaatinga.controller.dto.insumo.InsumoAtualizadoDTO;
import io.sage.BeesCaatinga.controller.dto.insumo.InsumoCriadoDTO;
import io.sage.BeesCaatinga.controller.dto.insumo.InsumoRetornoDTO;
import io.sage.BeesCaatinga.service.InsumoService;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/insumos")
@RequiredArgsConstructor
public class InsumoController {

    private final InsumoService service;

    @PostMapping("/{produtorId}")
    @Transactional
    public ResponseEntity<InsumoRetornoDTO> cadastrar(
            @PathVariable Long produtorId,
            @RequestBody @Valid InsumoCriadoDTO dto) {

        var insumoSalvo = service.salvar(produtorId, dto);
        return ResponseEntity.ok(insumoSalvo);
    }

    @GetMapping("/{produtorId}")
    public ResponseEntity<List<InsumoRetornoDTO>> listar(@PathVariable Long produtorId){
        var insumos = service.listar(produtorId);
        return ResponseEntity.ok(insumos);
    }

    @PutMapping("/{insumoId}/produtor/{produtorId}")
    @Transactional
    public ResponseEntity<InsumoRetornoDTO> atualizar(@RequestBody @Valid InsumoAtualizadoDTO dto, @PathVariable Long insumoId, @PathVariable Long produtorId){
        var insumo = service.atualizar(produtorId, insumoId, dto);
        return ResponseEntity.ok(insumo);
    }

    @DeleteMapping("/{insumoId}/produtor/{produtorId}")
    @Transactional
    public ResponseEntity<Void> deletar(@PathVariable Long insumoId, @PathVariable Long produtorId){
        service.deletar(produtorId, insumoId);
        return ResponseEntity.noContent().build();
    }

}

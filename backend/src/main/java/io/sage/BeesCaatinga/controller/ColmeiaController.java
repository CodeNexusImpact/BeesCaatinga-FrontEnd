package io.sage.BeesCaatinga.controller;

import io.sage.BeesCaatinga.controller.dto.colmeia.ColmeiaAtualizadaDTO;
import io.sage.BeesCaatinga.controller.dto.colmeia.ColmeiaCriadaDTO;
import io.sage.BeesCaatinga.controller.dto.colmeia.ColmeiaRetornoDTO;
import io.sage.BeesCaatinga.service.ColmeiaService;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/colmeias")
@RequiredArgsConstructor
public class ColmeiaController {

    private final ColmeiaService service;

    @PostMapping("/produtor/{produtorId}/apiario/{apiarioId}")
    @Transactional
    public ResponseEntity<ColmeiaRetornoDTO> cadastrar(
            @PathVariable Long produtorId,
            @PathVariable Long apiarioId,
            @RequestBody @Valid ColmeiaCriadaDTO dto) {

        var colmeiaSalva = service.salvar(produtorId, apiarioId, dto);
        return ResponseEntity.ok(colmeiaSalva);
    }

    @GetMapping("/produtor/{produtorId}/apiario/{apiarioId}")
    public ResponseEntity<List<ColmeiaRetornoDTO>> listar(@PathVariable Long produtorId, @PathVariable Long apiarioId){
        var colmeias = service.listar(produtorId, apiarioId);
        return ResponseEntity.ok(colmeias);
    }

    @GetMapping("/produtor/{produtorId}")
    public ResponseEntity<List<ColmeiaRetornoDTO>> listarPorProdutor(@PathVariable Long produtorId){
        var colmeias = service.listarPorProdutor(produtorId);
        return ResponseEntity.ok(colmeias);
    }

    @GetMapping("/produtor/{produtorId}/apiario/{apiarioId}/ativas")
    public ResponseEntity<List<ColmeiaRetornoDTO>> listarAtivos(@PathVariable Long produtorId, @PathVariable Long apiarioId){
        var colmeias = service.listarAtivas(produtorId, apiarioId);
        return ResponseEntity.ok(colmeias);
    }

    @GetMapping("/produtor/{produtorId}/apiario/{apiarioId}/inativas")
    public ResponseEntity<List<ColmeiaRetornoDTO>> listarInativos(@PathVariable Long produtorId, @PathVariable Long apiarioId){
        var colmeias = service.listarInativas(produtorId, apiarioId);
        return ResponseEntity.ok(colmeias);
    }

    @PutMapping("/produtor/{produtorId}/apiario/{apiarioId}/colmeia/{colmeiaId}")
    @Transactional
    public ResponseEntity<ColmeiaRetornoDTO> atualizar(@PathVariable Long produtorId, @PathVariable Long apiarioId, @PathVariable Long colmeiaId, @RequestBody @Valid ColmeiaAtualizadaDTO dto){
        var colmeia = service.atualizar(produtorId, apiarioId, colmeiaId, dto);
        return ResponseEntity.ok(colmeia);
    }

    @DeleteMapping("/produtor/{produtorId}/apiario/{apiarioId}/colmeia/{colmeiaId}")
    @Transactional
    public ResponseEntity<Void> deletar(@PathVariable Long produtorId, @PathVariable Long apiarioId, @PathVariable Long colmeiaId){
        service.deletar(produtorId, apiarioId, colmeiaId);
        return ResponseEntity.noContent().build();
    }
}

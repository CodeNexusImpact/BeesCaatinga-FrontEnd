package io.sage.BeesCaatinga.controller;

import io.sage.BeesCaatinga.controller.dto.apiario.ApiarioAtualizadoDTO;
import io.sage.BeesCaatinga.controller.dto.apiario.ApiarioCriadoDTO;
import io.sage.BeesCaatinga.controller.dto.apiario.ApiarioRetornoDTO;
import io.sage.BeesCaatinga.controller.dto.vistoria.VistoriaAtualizadaDTO;
import io.sage.BeesCaatinga.controller.dto.vistoria.VistoriaCriadaDTO;
import io.sage.BeesCaatinga.controller.dto.vistoria.VistoriaRetornoDTO;
import io.sage.BeesCaatinga.service.VistoriaService;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vistorias")
@RequiredArgsConstructor
public class VistoriaController {

    private final VistoriaService service;

    @PostMapping("/produtor/{produtorId}/apiario/{apiarioId}/colmeia/{colmeiaId}")
    @Transactional
    public ResponseEntity<VistoriaRetornoDTO> cadastrar(
            @PathVariable Long produtorId,
            @PathVariable Long apiarioId,
            @PathVariable Long colmeiaId,
            @RequestBody @Valid VistoriaCriadaDTO dto) {

        var vistoriaSalva = service.salvar(produtorId, apiarioId, colmeiaId, dto);
        return ResponseEntity.ok(vistoriaSalva);
    }

    @GetMapping("/{produtorId}")
    public ResponseEntity<List<VistoriaRetornoDTO>> listar(@PathVariable Long produtorId){
        List<VistoriaRetornoDTO> vistorias = service.listar(produtorId);
        return ResponseEntity.ok(vistorias);
    }

    @GetMapping("/colmeia/{colmeiaId}")
    public ResponseEntity<List<VistoriaRetornoDTO>> listarPorColmeia(@PathVariable Long colmeiaId){
        List<VistoriaRetornoDTO> vistorias = service.listarPorColmeia(colmeiaId);
        return ResponseEntity.ok(vistorias);
    }

    @PutMapping("/{vistoriaId}/produtor/{produtorId}")
    @Transactional
    public ResponseEntity<VistoriaRetornoDTO> atualizar(@RequestBody @Valid VistoriaAtualizadaDTO dto, @PathVariable Long vistoriaId, @PathVariable Long produtorId){
        var vistoria = service.atualizar(produtorId, vistoriaId, dto);
        return ResponseEntity.ok(vistoria);
    }

    @DeleteMapping("/{vistoriaId}/produtor/{produtorId}")
    @Transactional
    public ResponseEntity<Void> deletar(@PathVariable Long vistoriaId, @PathVariable Long produtorId){
        service.deletar(produtorId, vistoriaId);
        return ResponseEntity.noContent().build();
    }

}

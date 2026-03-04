package io.sage.BeesCaatinga.controller;

import io.sage.BeesCaatinga.controller.dto.apiario.ApiarioRetornoDTO;
import io.sage.BeesCaatinga.controller.dto.lote.LoteCriadoDTO;
import io.sage.BeesCaatinga.controller.dto.lote.LoteRetornoCodigoDTO;
import io.sage.BeesCaatinga.controller.dto.lote.LoteRetornoListadoDTO;
import io.sage.BeesCaatinga.service.LoteService;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/lotes")
@RequiredArgsConstructor
public class LoteController {

    private final LoteService service;

    @PostMapping("/{produtorId}")
    @Transactional
    public ResponseEntity<LoteRetornoCodigoDTO> cadastrar(
            @PathVariable Long produtorId,
            @RequestBody @Valid LoteCriadoDTO dto) {

        var loteSalvo = service.salvar(produtorId, dto);
        return ResponseEntity.ok(loteSalvo);
    }

    @GetMapping("/{produtorId}")
    public ResponseEntity<List<LoteRetornoCodigoDTO>> listarResumido(@PathVariable Long produtorId){
        var lotes = service.listarCodigos(produtorId);
        return ResponseEntity.ok(lotes);
    }

    @GetMapping("/{produtorId}/detalhado")
    public ResponseEntity<List<LoteRetornoListadoDTO>> listarDetalhado(@PathVariable Long produtorId){
        var lotes = service.listarDetalhados(produtorId);
        return ResponseEntity.ok(lotes);
    }

}

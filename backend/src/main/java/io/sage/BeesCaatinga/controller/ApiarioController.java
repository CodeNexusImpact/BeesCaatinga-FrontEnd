package io.sage.BeesCaatinga.controller;

import io.sage.BeesCaatinga.controller.dto.apiario.ApiarioCriadoDTO;
import io.sage.BeesCaatinga.controller.dto.apiario.ApiarioRetornoDTO;
import io.sage.BeesCaatinga.service.ApiarioService;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/apiarios")
@RequiredArgsConstructor
public class ApiarioController {

    private final ApiarioService service;

    @PostMapping("/{produtorId}")
    @Transactional
    public ResponseEntity<ApiarioRetornoDTO> cadastrar(
            @PathVariable Long produtorId,
            @RequestBody @Valid ApiarioCriadoDTO apiarioDTO) {

        var apiarioSalvo = service.salvarApiario(produtorId, apiarioDTO);
        return ResponseEntity.ok(apiarioSalvo);
    }

    @GetMapping("/{produtorId}")
    public ResponseEntity<List<ApiarioRetornoDTO>> listar(@PathVariable Long produtorId){
        var apiarios = service.listar(produtorId);
        return ResponseEntity.ok(apiarios);
    }

    //

}

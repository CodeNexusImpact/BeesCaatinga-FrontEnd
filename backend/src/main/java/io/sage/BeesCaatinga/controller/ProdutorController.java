package io.sage.BeesCaatinga.controller;

import io.sage.BeesCaatinga.controller.dto.apiario.ApiarioCriadoDTO;
import io.sage.BeesCaatinga.controller.dto.apiario.ApiarioRetornoDTO;
import io.sage.BeesCaatinga.controller.dto.colmeia.ColmeiaCriadaDTO;
import io.sage.BeesCaatinga.controller.dto.colmeia.ColmeiaRetornoDTO;
import io.sage.BeesCaatinga.controller.dto.produtor.ProdutorAtualizadoDTO;
import io.sage.BeesCaatinga.controller.dto.produtor.ProdutorCriadoDTO;
import io.sage.BeesCaatinga.controller.dto.produtor.ProdutorRetornoDTO;
import io.sage.BeesCaatinga.service.ApiarioService;
import io.sage.BeesCaatinga.service.ColmeiaService;
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
    private final ApiarioService apiarioService;
    private final ColmeiaService colmeiaService;

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


    // OPERAÇÕES DE APIÁRIO
    @PostMapping("/{produtorId}/apiarios")
    @Transactional
    public ResponseEntity<ApiarioRetornoDTO> cadastrarApiario(
            @PathVariable Long produtorId,
            @RequestBody @Valid ApiarioCriadoDTO apiarioDTO) {

        var apiarioSalvo = service.salvarApiario(produtorId, apiarioDTO);
        return ResponseEntity.ok(apiarioSalvo);
    }

    @GetMapping("/{produtorId}/apiarios")
    public ResponseEntity<List<ApiarioRetornoDTO>> listarApiariosDoProdutor(@PathVariable Long produtorId) {
        var apiarios = service.listarApiariosDoProdutor(produtorId);
        return ResponseEntity.ok(apiarios);
    }


    // OPERAÇÕES DE COLMÉIA
    @PostMapping("/{produtorId}/apiarios/{apiarioId}/colmeias")
    @Transactional
    public ResponseEntity<ColmeiaRetornoDTO> cadastrarColmeia(
            @PathVariable Long produtorId,
            @PathVariable Long apiarioId,
            @RequestBody @Valid ColmeiaCriadaDTO colmeiaDTO) {

        var colmeiaSalva = service.salvarColmeia(produtorId, apiarioId, colmeiaDTO);
        return ResponseEntity.ok(colmeiaSalva);
    }

    @GetMapping("/{produtorId}/apiarios/{apiarioId}/colmeias")
    public ResponseEntity<List<ColmeiaRetornoDTO>> listarColmeiasDoApiario(
            @PathVariable Long produtorId,
            @PathVariable Long apiarioId) {

        var colmeias = service.listarColmeiasDoApiario(produtorId, apiarioId);
        return ResponseEntity.ok(colmeias);
    }

    @GetMapping("/{produtorId}/apiarios/{apiarioId}/colmeias/ativas")
    public ResponseEntity<List<ColmeiaRetornoDTO>> listarColmeiasAtivasDoApiario(
            @PathVariable Long produtorId,
            @PathVariable Long apiarioId) {

        var colmeiasAtivas = service.listarColmeiasAtivasDoApiario(produtorId, apiarioId);
        return ResponseEntity.ok(colmeiasAtivas);
    }

    @GetMapping("/{produtorId}/apiarios/{apiarioId}/colmeias/inativas")
    public ResponseEntity<List<ColmeiaRetornoDTO>> listarColmeiasInativasDoApiario(
            @PathVariable Long produtorId,
            @PathVariable Long apiarioId) {

        var colmeiasInativas = service.listarColmeiasInativasDoApiario(produtorId, apiarioId);
        return ResponseEntity.ok(colmeiasInativas);
    }

}
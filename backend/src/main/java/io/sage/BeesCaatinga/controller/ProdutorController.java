package io.sage.BeesCaatinga.controller;

import io.sage.BeesCaatinga.controller.dto.ApiarioSimplificadoDTO;
import io.sage.BeesCaatinga.controller.dto.ColmeiaSimplificadaDTO;
import io.sage.BeesCaatinga.controller.dto.ProdutorDTO;
import io.sage.BeesCaatinga.controller.dto.ProdutorSimplificadoDTO;
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
    public ResponseEntity<ProdutorSimplificadoDTO> cadastrar(@RequestBody @Valid ProdutorDTO dto, UriComponentsBuilder uriBuilder){
        var produtorSalvo = service.salvar(dto);
        var uri = uriBuilder.path("/produtores/{id}").buildAndExpand(produtorSalvo.id()).toUri();
        return ResponseEntity.created(uri).body(produtorSalvo);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProdutorDTO> buscar(@PathVariable Long id){
        var produtor = service.buscarPorId(id);
        return ResponseEntity.ok(produtor);
    }

    @GetMapping
    public ResponseEntity<List<ProdutorSimplificadoDTO>> listar(){
        var listaProdutores = service.listar();
        return ResponseEntity.ok(listaProdutores);
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<ProdutorDTO> atualizar(@PathVariable Long id, @RequestBody @Valid ProdutorDTO dto){
        var produtorAtualizado = service.atualizar(id, dto);
        return ResponseEntity.ok(produtorAtualizado);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> deletar(@PathVariable Long id){
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/apiario")
    @Transactional
    public ResponseEntity<ApiarioSimplificadoDTO> cadastrarApiario(){
        // criar apiario a partir de um produtor, assim já atrelamos um ao outro
    }

    @PostMapping("/{id}/colmeias")
    @Transactional
    public ResponseEntity<ColmeiaSimplificadaDTO> cadastrarColmeia(){
        // criar colmeia a partir de um produtor, atrelar ao apiário do produtor
    }

}
package io.sage.BeesCaatinga.controller;

import io.sage.BeesCaatinga.controller.dto.FiltroBuscaDTO;
import io.sage.BeesCaatinga.controller.dto.relatorios.insumos.RelatorioInsumosDTO;
import io.sage.BeesCaatinga.controller.dto.relatorios.producao.RelatorioProducaoDTO;
import io.sage.BeesCaatinga.controller.dto.relatorios.rastreabilidade.RelatorioRastreabilidadeDTO;
import io.sage.BeesCaatinga.controller.dto.relatorios.vistoria.RelatorioVistoriaDTO;
import io.sage.BeesCaatinga.service.RelatorioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/relatorios")
@RequiredArgsConstructor
public class RelatorioController {

    private final RelatorioService relatorioService;

    @PostMapping("/producao")
    // @Operation(summary = "Retorna produção com qualquer filtro")
    public ResponseEntity<RelatorioProducaoDTO> getRelatorioProducao(
            @RequestBody @Valid FiltroBuscaDTO filtro
    ) {
        RelatorioProducaoDTO resumo = relatorioService.gerarRelatorioProducao(filtro);
        return ResponseEntity.ok(resumo);
    }

    @PostMapping("/vistorias")
    public ResponseEntity<RelatorioVistoriaDTO> getRelatorioVistoria(
            @RequestBody @Valid FiltroBuscaDTO filtro
    ) {
        RelatorioVistoriaDTO dto = relatorioService.gerarRelatorioVistoria(filtro);
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/rastreabilidade")
    public ResponseEntity<RelatorioRastreabilidadeDTO> gerarRelatorioRastreabilidade(
            @RequestBody @Valid FiltroBuscaDTO filtro
    ) {
        RelatorioRastreabilidadeDTO dto = relatorioService.gerarRelatorioRastreabilidade(filtro);
        return ResponseEntity.ok(dto);
    }

    // @PostMapping("/insumos")
    // public ResponseEntity<RelatorioInsumosDTO> gerarRelatorioInsumos(
    //         @RequestBody FiltroBuscaDTO filtro
    // ) {
    //     return ResponseEntity.ok(relatorioService.gerarRelatorioInsumos(filtro));
    // }

}

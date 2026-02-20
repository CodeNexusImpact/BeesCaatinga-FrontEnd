package io.sage.BeesCaatinga.service;

import io.sage.BeesCaatinga.controller.dto.FiltroBuscaDTO;
import io.sage.BeesCaatinga.controller.dto.IntervaloDatas;
import io.sage.BeesCaatinga.controller.dto.relatorios.producao.LoteMelDTO;
import io.sage.BeesCaatinga.controller.dto.relatorios.producao.ProducaoMensalDTO;
import io.sage.BeesCaatinga.controller.dto.relatorios.producao.RelatorioProducaoDTO;
import io.sage.BeesCaatinga.controller.dto.relatorios.producao.StatusColmeiasDTO;
import io.sage.BeesCaatinga.controller.dto.relatorios.rastreabilidade.LotesPorFloradaDTO;
import io.sage.BeesCaatinga.controller.dto.relatorios.rastreabilidade.LotesPorTipoAbelhaDTO;
import io.sage.BeesCaatinga.controller.dto.relatorios.rastreabilidade.LoteTabelaDTO;
import io.sage.BeesCaatinga.controller.dto.relatorios.rastreabilidade.RelatorioRastreabilidadeDTO;
import io.sage.BeesCaatinga.controller.dto.relatorios.rastreabilidade.VendidosNaoVendidosDTO;
import io.sage.BeesCaatinga.controller.dto.relatorios.vistoria.RelatorioVistoriaDTO;
import io.sage.BeesCaatinga.controller.dto.relatorios.vistoria.VistoriaMensalDTO;
import io.sage.BeesCaatinga.controller.dto.relatorios.vistoria.VistoriaTabelaDTO;
import io.sage.BeesCaatinga.model.Apiario;
import io.sage.BeesCaatinga.model.Colmeia;
import io.sage.BeesCaatinga.model.Lote;
import io.sage.BeesCaatinga.model.Produtor;
import io.sage.BeesCaatinga.model.Vistoria;
import io.sage.BeesCaatinga.model.enums.StatusColmeia;
import io.sage.BeesCaatinga.model.enums.TipoAbelha;
import io.sage.BeesCaatinga.model.enums.TipoFlorada;
import io.sage.BeesCaatinga.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Locale;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RelatorioServiceTest {

    @Mock
    private ApiarioRepository apiarioRepository;
    @Mock
    private ColmeiaRepository colmeiaRepository;
    @Mock
    private ProducaoRepository producaoRepository;
    @Mock
    private LoteRepository loteRepository;
    @Mock
    private VistoriaRepository vistoriaRepository;
    @Mock
    private InsumoRepository insumoRepository;
    @Mock
    private ProdutorService produtorService;

    @InjectMocks
    private RelatorioService relatorioService;

    private Long produtorId;
    private Long apiarioId;
    private Long colmeiaId;
    private FiltroBuscaDTO filtroProducao;
    private FiltroBuscaDTO filtroVistoria;
    private FiltroBuscaDTO filtroRastreabilidade;
    private Apiario apiario;
    private Colmeia colmeia;
    private Produtor produtor;
    private Lote lote;


    @BeforeEach
    void setUp() {
        produtorId = 1L;
        apiarioId = 10L;
        colmeiaId = 100L;

        produtor = new Produtor();
        produtor.setId(produtorId);

        apiario = new Apiario();
        apiario.setId(apiarioId);
        apiario.setProdutor(produtor);
        apiario.setColmeias(new ArrayList<>());
        apiario.setNomeDaPropriedade("Propriedade Teste"); // Needed for LoteTabelaDTO

        colmeia = new Colmeia();
        colmeia.setId(colmeiaId);
        colmeia.setApiario(apiario);

        lote = new Lote();
        lote.setId(1L);
        lote.setDataProducao(LocalDate.of(2023,7,1)); // Corrected dataProducao
        lote.setQuantidadeProduzida(50.0);
        lote.setTipoFlorada(TipoFlorada.SILVESTRE);
        lote.setApiario(apiario);
        lote.setTipoAbelha(TipoAbelha.APIS_MELLIFERA);


        // Filter for Producao (Feb 2023 - assuming filter.ano=2023, filter.estacao=VERAO, filter.mes=2 -> Feb 2024 (leap year logic))
        // Actual logic in service for VERAO + mes: ano+1. So for 2023, Feb is 2024
        filtroProducao = new FiltroBuscaDTO(2023, "VERAO", 2, apiarioId, colmeiaId); // Feb 2024
        filtroVistoria = new FiltroBuscaDTO(2023, "OUTONO", 4, apiarioId, colmeiaId); // Apr 2023
        filtroRastreabilidade = new FiltroBuscaDTO(2023, "INVERNO", 8, apiarioId, colmeiaId); // Aug 2023
    }

    @Test
    @DisplayName("Deve gerar RelatorioProducaoDTO com todos os dados preenchidos")
    void gerarRelatorioProducao_ComTodosOsDados_DeveRetornarRelatorioCompleto() {
        // Arrange
        LocalDate inicio = LocalDate.of(2024, 2, 1);
        LocalDate fim = LocalDate.of(2024, 2, 29); // Leap year for Feb

        when(producaoRepository.obterProducaoTotal(inicio, fim, apiarioId, colmeiaId)).thenReturn(150.5);
        when(producaoRepository.obterProducaoMensal(inicio, fim, apiarioId, colmeiaId))
                .thenReturn(Collections.singletonList(new Object[]{2, 150.5}));
        when(colmeiaRepository.obterStatusColmeias(apiarioId, colmeiaId))
                .thenReturn(Collections.singletonList(new Object[]{StatusColmeia.SAUDAVEL.name(), 5L}));
        when(vistoriaRepository.contarVistorias(inicio, fim, apiarioId, colmeiaId)).thenReturn(10L);
        when(loteRepository.obterLotes(inicio, fim, apiarioId))
                .thenReturn(Collections.singletonList(lote));
        when(colmeiaRepository.count()).thenReturn(10L);
        when(apiarioRepository.count()).thenReturn(2L);

        // Act
        RelatorioProducaoDTO result = relatorioService.gerarRelatorioProducao(filtroProducao);

        // Assert
        assertNotNull(result);
        assertEquals(150.5, result.producaoTotalKg());
        assertEquals(150.5 / 10, result.produtividadeMediaPorColmeia());
        assertEquals(150.5 / 2, result.produtividadeMediaPorApiario());
        assertEquals(10L, result.numeroDeVistorias());
        assertFalse(result.producaoMensal().isEmpty());
        assertEquals("fev.", result.producaoMensal().get(0).mes());
        assertEquals(150.5, result.producaoMensal().get(0).pesoKg());
        assertFalse(result.statusColmeias().isEmpty());
        assertEquals(StatusColmeia.SAUDAVEL.name(), result.statusColmeias().get(0).status());
        assertEquals(5L, result.statusColmeias().get(0).quantidade());
        assertFalse(result.lotesMel().isEmpty());
        assertEquals(lote.getId(), result.lotesMel().get(0).id());

        verify(producaoRepository, times(1)).obterProducaoTotal(inicio, fim, apiarioId, colmeiaId);
        verify(producaoRepository, times(1)).obterProducaoMensal(inicio, fim, apiarioId, colmeiaId);
        verify(colmeiaRepository, times(1)).obterStatusColmeias(apiarioId, colmeiaId);
        verify(vistoriaRepository, times(1)).contarVistorias(inicio, fim, apiarioId, colmeiaId);
        verify(loteRepository, times(1)).obterLotes(inicio, fim, apiarioId);
        verify(colmeiaRepository, times(1)).count();
        verify(apiarioRepository, times(1)).count();
    }

    @Test
    @DisplayName("Deve gerar RelatorioProducaoDTO com valores zero/padrao para dados ausentes")
    void gerarRelatorioProducao_ComDadosAusentes_DeveRetornarRelatorioComValoresPadrao() {
        // Arrange
        LocalDate inicio = LocalDate.of(2024, 2, 1);
        LocalDate fim = LocalDate.of(2024, 2, 29); 

        when(producaoRepository.obterProducaoTotal(inicio, fim, apiarioId, colmeiaId)).thenReturn(null); // Null total
        when(producaoRepository.obterProducaoMensal(inicio, fim, apiarioId, colmeiaId))
                .thenReturn(Collections.emptyList());
        when(colmeiaRepository.obterStatusColmeias(apiarioId, colmeiaId))
                .thenReturn(Collections.emptyList());
        when(vistoriaRepository.contarVistorias(inicio, fim, apiarioId, colmeiaId)).thenReturn(0L);
        when(loteRepository.obterLotes(inicio, fim, apiarioId))
                .thenReturn(Collections.emptyList());
        when(colmeiaRepository.count()).thenReturn(0L); // Zero colmeias
        when(apiarioRepository.count()).thenReturn(0L); // Zero apiarios

        // Act
        RelatorioProducaoDTO result = relatorioService.gerarRelatorioProducao(filtroProducao);

        // Assert
        assertNotNull(result);
        assertEquals(0.0, result.producaoTotalKg());
        assertEquals(0.0, result.produtividadeMediaPorColmeia());
        assertEquals(0.0, result.produtividadeMediaPorApiario());
        assertEquals(0L, result.numeroDeVistorias());
        assertTrue(result.producaoMensal().isEmpty());
        assertTrue(result.statusColmeias().isEmpty());
        assertTrue(result.lotesMel().isEmpty());
    }

    @Test
    @DisplayName("Deve gerar RelatorioVistoriaDTO com todos os dados preenchidos")
    void gerarRelatorioVistoria_ComTodosOsDados_DeveRetornarRelatorioCompleto() {
        // Arrange
        LocalDate inicio = LocalDate.of(2023, 4, 1);
        LocalDate fim = LocalDate.of(2023, 4, 30);

        when(vistoriaRepository.contarVistorias(inicio, fim, apiarioId, colmeiaId)).thenReturn(10L);
        when(colmeiaRepository.countBySituacaoFiltrando(eq("SAUDAVEL"), eq(apiarioId), eq(colmeiaId))).thenReturn(5L);
        when(colmeiaRepository.countBySituacaoFiltrando(eq("ATENCAO"), eq(apiarioId), eq(colmeiaId))).thenReturn(3L);
        when(colmeiaRepository.obterStatusColmeias(apiarioId, colmeiaId))
                .thenReturn(Arrays.asList(
                        new Object[]{StatusColmeia.SAUDAVEL, 5L},
                        new Object[]{StatusColmeia.TRATAMENTO_NECESSARIO, 2L}
                ));
        when(vistoriaRepository.obterVistoriasMensais(inicio, fim, apiarioId, colmeiaId))
                .thenReturn(Collections.singletonList(new Object[]{4, 10L}));
        when(vistoriaRepository.listarVistorias(inicio, fim, apiarioId, colmeiaId))
                .thenReturn(Collections.singletonList(new VistoriaTabelaDTO(LocalDate.now(), "Obs vistoria", StatusColmeia.SAUDAVEL)));

        // Act
        RelatorioVistoriaDTO result = relatorioService.gerarRelatorioVistoria(filtroVistoria);

        // Assert
        assertNotNull(result);
        assertEquals(10L, result.vistoriasTotais());
        assertEquals(5L, result.colmeiasSaudaveis());
        assertEquals(3L, result.colmeiasEmAtencao());
        assertFalse(result.statusColmeias().isEmpty());
        assertEquals(StatusColmeia.SAUDAVEL.name(), result.statusColmeias().get(0).status());
        assertEquals(5L, result.statusColmeias().get(0).quantidade());
        assertFalse(result.vistoriasMensais().isEmpty());
        assertEquals(4, result.vistoriasMensais().get(0).mes());
        assertEquals(10L, result.vistoriasMensais().get(0).quantidade());
        assertFalse(result.tabela().isEmpty());
        assertEquals(LocalDate.now(), result.tabela().get(0).getDataVistoria()); // Assert on dataVistoria

        verify(vistoriaRepository, times(1)).contarVistorias(inicio, fim, apiarioId, colmeiaId);
        verify(colmeiaRepository, times(1)).countBySituacaoFiltrando(eq("SAUDAVEL"), eq(apiarioId), eq(colmeiaId));
        verify(colmeiaRepository, times(1)).countBySituacaoFiltrando(eq("ATENCAO"), eq(apiarioId), eq(colmeiaId));
        verify(colmeiaRepository, times(1)).obterStatusColmeias(apiarioId, colmeiaId);
        verify(vistoriaRepository, times(1)).obterVistoriasMensais(inicio, fim, apiarioId, colmeiaId);
        verify(vistoriaRepository, times(1)).listarVistorias(inicio, fim, apiarioId, colmeiaId);
    }
    
    @Test
    @DisplayName("Deve gerar RelatorioRastreabilidadeDTO com todos os dados preenchidos")
    void gerarRelatorioRastreabilidade_ComTodosOsDados_DeveRetornarRelatorioCompleto() {
        // Arrange
        LocalDate inicio = LocalDate.of(2023, 8, 1);
        LocalDate fim = LocalDate.of(2023, 8, 31);
        
        LoteTabelaDTO loteTabelaDTO = new LoteTabelaDTO(
                lote.getId(), lote.getDataProducao(), lote.getQuantidadeProduzida(),
                lote.getTipoFlorada(), apiario.getNomeDaPropriedade(), lote.getTipoAbelha()
        );

        when(loteRepository.contarLotes(inicio, fim, apiarioId, colmeiaId)).thenReturn(50L);
        when(loteRepository.somarPesoTotal(inicio, fim, apiarioId, colmeiaId)).thenReturn(2500.0);
        when(loteRepository.contarVendidos(inicio, fim, apiarioId, colmeiaId)).thenReturn(40L);
        when(loteRepository.listarLotesTabela(inicio, fim, apiarioId, colmeiaId))
                .thenReturn(Collections.singletonList(loteTabelaDTO));
        when(loteRepository.agruparPorTipoAbelha(inicio, fim, apiarioId, colmeiaId))
                .thenReturn(Collections.singletonList(new Object[]{TipoAbelha.APIS_MELLIFERA, 30L}));
        when(loteRepository.agruparPorFlorada(inicio, fim, apiarioId, colmeiaId))
                .thenReturn(Collections.singletonList(new Object[]{TipoFlorada.SILVESTRE, 20L}));

        // Act
        RelatorioRastreabilidadeDTO result = relatorioService.gerarRelatorioRastreabilidade(filtroRastreabilidade);

        // Assert
        assertNotNull(result);
        assertEquals(50L, result.totalLotes());
        assertEquals(2500.0, result.pesoTotalRastreavel());
        assertEquals(80.0, result.porcentagemVendidos()); // 40/50 * 100
        assertTrue(result.tempoMedioDias() > 0); // Should be calculated based on dates
        assertFalse(result.graficoTipoAbelha().isEmpty());
        assertEquals(TipoAbelha.APIS_MELLIFERA.toString(), result.graficoTipoAbelha().get(0).tipoAbelha());
        assertNotNull(result.graficoVendidos());
        assertEquals(40L, result.graficoVendidos().vendidos());
        assertEquals(10L, result.graficoVendidos().naoVendidos());
        assertFalse(result.graficoFlorada().isEmpty());
        assertEquals(TipoFlorada.SILVESTRE.toString(), result.graficoFlorada().get(0).florada());
        assertFalse(result.tabela().isEmpty());
        assertEquals(loteTabelaDTO.id(), result.tabela().get(0).id());

        verify(loteRepository, times(1)).contarLotes(inicio, fim, apiarioId, colmeiaId);
        verify(loteRepository, times(1)).somarPesoTotal(inicio, fim, apiarioId, colmeiaId);
        verify(loteRepository, times(1)).contarVendidos(inicio, fim, apiarioId, colmeiaId);
        verify(loteRepository, times(1)).listarLotesTabela(inicio, fim, apiarioId, colmeiaId);
        verify(loteRepository, times(1)).agruparPorTipoAbelha(inicio, fim, apiarioId, colmeiaId);
        verify(loteRepository, times(1)).agruparPorFlorada(inicio, fim, apiarioId, colmeiaId);
    }
}

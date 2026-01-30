package io.sage.BeesCaatinga.service;

import io.sage.BeesCaatinga.controller.mapper.*;
import io.sage.BeesCaatinga.model.Apiario;
import io.sage.BeesCaatinga.repository.*;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
@ExtendWith(MockitoExtension.class)
class ProdutorServiceTest {

    @Mock
    private ProdutorRepository repository;

    @Mock
    private io.sage.BeesCaatinga.controller.mapper.ProdutorMapper mapper;

    // Mock para demais dependências, se houver
    @Mock private ApiarioRepository apiarioRepository;
    @Mock private ApiarioMapper apiarioMapper;
    @Mock private ColmeiaRepository colmeiaRepository;
    @Mock private ColmeiaMapper colmeiaMapper;
    @Mock private VistoriaRepository vistoriaRepository;
    @Mock private VistoriaMapper vistoriaMapper;
    @Mock private InsumoRepository insumoRepository;
    @Mock private InsumoMapper insumoMapper;
    @Mock private ProducaoRepository producaoRepository;
    @Mock private ProducaoMapper producaoMapper;
    @Mock private LoteRepository loteRepository;
    @Mock private LoteMapper loteMapper;

    private ProdutorService produtorService;

    @BeforeEach
    void setUp() {

        produtorService = new ProdutorService(repository, mapper);

    }

    @AfterEach
    void tearDown() {

    }

    @Test
    void salvar() {
    }

    @Test
    void buscarPorId() {
    }

    @Test
    void listar() {
    }

    @Test
    void atualizar() {
    }

    @Test
    void deletar() {
    }

    @Test
    void salvarApiario() {
    }

    @Test
    void listarApiariosDoProdutor() {
    }

    @Test
    void atualizarApiarioDoProdutor() {
    }

    @Test
    void deletarApiarioDoProdutor() {
    }

    @Test
    void salvarColmeia() {
    }

    @Test
    void listarColmeiasDoApiario() {
    }

    @Test
    void listarColmeiasAtivasDoApiario() {
    }

    @Test
    void listarColmeiasInativasDoApiario() {
    }

    @Test
    void atualizarColmeiaDoProdutor() {
    }

    @Test
    void deletarColmeiaDoProdutor() {
    }

    @Test
    void salvarVistoria() {
    }

    @Test
    void listarVistoriasDoProdutor() {
    }

    @Test
    void atualizarVistoria() {
    }

    @Test
    void deletarVistoria() {
    }

    @Test
    void salvarInsumo() {
    }

    @Test
    void listarInsumosDoProdutor() {
    }

    @Test
    void atualizarInsumoDoProdutor() {
    }

    @Test
    void deletarInsumoDoProdutor() {
    }

    @Test
    void salvarProducao() {
    }

    @Test
    void listarProducoesDoProdutor() {
    }

    @Test
    void atualizarProducaoDoProdutor() {
    }

    @Test
    void deletarProducaoDoProdutor() {
    }

    @Test
    void salvarLote() {
    }

    @Test
    void listarTodosLotesDoProdutor() {
    }

    @Test
    void listarLotesDoProdutor() {
    }
}
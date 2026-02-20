package io.sage.BeesCaatinga.service;

import io.sage.BeesCaatinga.controller.dto.producao.ProducaoCriadaDTO;
import io.sage.BeesCaatinga.controller.dto.producao.ProducaoRetornoDTO;
import io.sage.BeesCaatinga.controller.exception.ResourceNotFoundException;
import io.sage.BeesCaatinga.controller.mapper.ProducaoMapper;
import io.sage.BeesCaatinga.model.Apiario;
import io.sage.BeesCaatinga.model.Colmeia;
import io.sage.BeesCaatinga.model.Producao;
import io.sage.BeesCaatinga.model.Produtor;
import io.sage.BeesCaatinga.model.enums.StatusProduto;
import io.sage.BeesCaatinga.model.enums.StatusQualidade;
import io.sage.BeesCaatinga.model.enums.UnidadeMedida;
import io.sage.BeesCaatinga.repository.ApiarioRepository;
import io.sage.BeesCaatinga.repository.ColmeiaRepository;
import io.sage.BeesCaatinga.repository.ProducaoRepository;
import io.sage.BeesCaatinga.repository.ProdutorRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProducaoServiceTest {

    @Mock
    private ApiarioRepository apiarioRepository;
    @Mock
    private ColmeiaRepository colmeiaRepository;
    @Mock
    private ProdutorRepository produtorRepository;
    @Mock
    private ProducaoRepository producaoRepository;
    @Mock
    private ProducaoMapper producaoMapper;

    @InjectMocks
    private ProducaoService producaoService;

    private Produtor produtor;
    private Apiario apiario;
    private Colmeia colmeia;
    private Producao producao;
    private ProducaoCriadaDTO producaoCriadaDTO;
    private ProducaoRetornoDTO producaoRetornoDTO;

    @BeforeEach
    void setUp() {
        produtor = new Produtor();
        produtor.setId(1L);

        apiario = new Apiario();
        apiario.setId(10L);
        apiario.setProdutor(produtor);
        apiario.setNome("Apiario Teste");

        colmeia = new Colmeia();
        colmeia.setId(100L);
        colmeia.setApiario(apiario);
        colmeia.setIdentificador("Colmeia Teste");

        producaoCriadaDTO = new ProducaoCriadaDTO(
                "Mel",
                10.0,
                UnidadeMedida.LITRO,
                apiario.getId(),
                colmeia.getId(),
                LocalDate.now()
        );

        producao = new Producao();
        producao.setId(1L);
        producao.setApiario(apiario);
        producao.setColmeia(colmeia);
        producao.setQuantidade(10.0);
        producao.setTipoProducao("Mel");
        producao.setUnidadeMedida(UnidadeMedida.LITRO);
        producao.setDataColeta(LocalDate.now());
        producao.setStatusProduto(StatusProduto.EM_ESTOQUE);
        producao.setStatusQualidade(StatusQualidade.APROVADO);


        producaoRetornoDTO = new ProducaoRetornoDTO(
                producao.getId(),
                producao.getTipoProducao(),
                producao.getQuantidade(),
                producao.getStatusProduto(),
                producao.getDataColeta(),
                null, // dataVenda (can be null)
                producao.getApiario().getNome(),
                producao.getColmeia().getIdentificador(),
                producao.getStatusQualidade()
        );
    }

    @Test
    @DisplayName("Deve salvar uma produção com sucesso")
    void salvar_ComDadosValidos_DeveRetornarProducaoRetornoDTO() {
        // Arrange
        when(apiarioRepository.findById(apiario.getId())).thenReturn(Optional.of(apiario));
        when(colmeiaRepository.findById(colmeia.getId())).thenReturn(Optional.of(colmeia));
        // Corrected mapper call based on ProducaoService.java
        when(producaoMapper.toEntityFromCriada(any(ProducaoCriadaDTO.class), eq(apiarioRepository), eq(colmeiaRepository))).thenReturn(producao);
        when(producaoRepository.save(any(Producao.class))).thenReturn(producao);
        when(producaoMapper.toRetornoDTO(any(Producao.class))).thenReturn(producaoRetornoDTO);

        // Act
        ProducaoRetornoDTO result = producaoService.salvar(produtor.getId(), producaoCriadaDTO);

        // Assert
        assertNotNull(result);
        assertEquals(producaoRetornoDTO.quantidade(), result.quantidade());
        verify(producaoRepository).save(producao);
        verify(apiarioRepository, times(1)).findById(producaoCriadaDTO.apiarioId());
        verify(colmeiaRepository, times(1)).findById(producaoCriadaDTO.colmeiaId());
        // Verify mapper call with correct arguments
        verify(producaoMapper, times(1)).toEntityFromCriada(any(ProducaoCriadaDTO.class), eq(apiarioRepository), eq(colmeiaRepository));
    }

    @Test
    @DisplayName("Deve lançar exceção ao salvar produção com apiário inexistente")
    void salvar_ApiarioInexistente_DeveLancarExcecao() {
        // Arrange
        when(apiarioRepository.findById(apiario.getId())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> producaoService.salvar(produtor.getId(), producaoCriadaDTO));
        verify(colmeiaRepository, never()).findById(anyLong()); // Colmeia lookup should not happen
        verify(producaoRepository, never()).save(any());
        verify(producaoMapper, never()).toEntityFromCriada(any(), any(), any()); // Mapper should not be called
    }

    @Test
    @DisplayName("Deve lançar exceção ao salvar produção com colmeia inexistente")
    void salvar_ColmeiaInexistente_DeveLancarExcecao() {
        // Arrange
        when(apiarioRepository.findById(apiario.getId())).thenReturn(Optional.of(apiario));
        when(colmeiaRepository.findById(colmeia.getId())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> producaoService.salvar(produtor.getId(), producaoCriadaDTO));
        verify(apiarioRepository, times(1)).findById(producaoCriadaDTO.apiarioId());
        verify(colmeiaRepository, times(1)).findById(producaoCriadaDTO.colmeiaId());
        verify(producaoRepository, never()).save(any());
        verify(producaoMapper, never()).toEntityFromCriada(any(), any(), any()); // Mapper should not be called
    }

    @Test
    @DisplayName("Deve lançar exceção ao salvar produção com apiário de outro produtor")
    void salvar_ApiarioDeOutroProdutor_DeveLancarExcecao() {
        // Arrange
        Produtor outroProdutor = new Produtor();
        outroProdutor.setId(2L);
        apiario.setProdutor(outroProdutor); // Apiário pertence a outro produtor
        when(apiarioRepository.findById(apiario.getId())).thenReturn(Optional.of(apiario));
        // We do NOT mock colmeiaRepository.findById here because it should not be called

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> producaoService.salvar(produtor.getId(), producaoCriadaDTO));
        verify(apiarioRepository, times(1)).findById(producaoCriadaDTO.apiarioId());
        verify(colmeiaRepository, never()).findById(anyLong()); // Colmeia lookup should not happen
        verify(producaoRepository, never()).save(any());
        verify(producaoMapper, never()).toEntityFromCriada(any(), any(), any()); // Mapper should not be called
    }

    @Test
    @DisplayName("Deve lançar exceção ao salvar produção com colmeia de outro apiário")
    void salvar_ColmeiaDeOutroApiario_DeveLancarExcecao() {
        // Arrange
        Apiario outroApiario = new Apiario();
        outroApiario.setId(11L);
        outroApiario.setProdutor(produtor); // Pertence ao mesmo produtor
        colmeia.setApiario(outroApiario); // Colmeia de outro apiário
        when(apiarioRepository.findById(apiario.getId())).thenReturn(Optional.of(apiario));
        when(colmeiaRepository.findById(colmeia.getId())).thenReturn(Optional.of(colmeia));

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> producaoService.salvar(produtor.getId(), producaoCriadaDTO));
        verify(apiarioRepository, times(1)).findById(producaoCriadaDTO.apiarioId());
        verify(colmeiaRepository, times(1)).findById(producaoCriadaDTO.colmeiaId());
        verify(producaoRepository, never()).save(any());
        verify(producaoMapper, never()).toEntityFromCriada(any(), any(), any()); // Mapper should not be called
    }

    @Test
    @DisplayName("Deve listar produções com sucesso")
    void listar_ComProdutorExistente_DeveRetornarListaDeProducoes() {
        // Arrange
        when(produtorRepository.existsById(produtor.getId())).thenReturn(true);
        when(producaoRepository.findByApiarioProdutorId(produtor.getId())).thenReturn(Collections.singletonList(producao));
        when(producaoMapper.toRetornoDTO(producao)).thenReturn(producaoRetornoDTO);

        // Act
        List<ProducaoRetornoDTO> result = producaoService.listar(produtor.getId());

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(producaoRetornoDTO, result.get(0));
    }

    @Test
    @DisplayName("Deve lançar exceção ao listar produções de produtor inexistente")
    void listar_ProdutorInexistente_DeveLancarExcecao() {
        // Arrange
        when(produtorRepository.existsById(produtor.getId())).thenReturn(false);

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> producaoService.listar(produtor.getId()));
    }

    @Test
    @DisplayName("Deve deletar produção com sucesso")
    void deletar_ComDadosValidos_DeveDeletarProducao() {
        // Arrange
        when(producaoRepository.findById(producao.getId())).thenReturn(Optional.of(producao));
        doNothing().when(producaoRepository).delete(producao);

        // Act
        producaoService.deletar(produtor.getId(), producao.getId());

        // Assert
        verify(producaoRepository, times(1)).delete(producao);
    }
}

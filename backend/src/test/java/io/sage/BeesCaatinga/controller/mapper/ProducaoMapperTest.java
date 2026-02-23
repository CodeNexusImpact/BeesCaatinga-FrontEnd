package io.sage.BeesCaatinga.controller.mapper;

import io.sage.BeesCaatinga.controller.dto.producao.ProducaoCriadaDTO;
import io.sage.BeesCaatinga.controller.dto.producao.ProducaoRetornoDTO;
import io.sage.BeesCaatinga.model.Apiario;
import io.sage.BeesCaatinga.model.Colmeia;
import io.sage.BeesCaatinga.model.Producao;
import io.sage.BeesCaatinga.model.enums.StatusProduto;
import io.sage.BeesCaatinga.model.enums.StatusQualidade;
import io.sage.BeesCaatinga.model.enums.UnidadeMedida;
import io.sage.BeesCaatinga.repository.ApiarioRepository;
import io.sage.BeesCaatinga.repository.ColmeiaRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProducaoMapperTest {

    @InjectMocks
    private ProducaoMapperImpl producaoMapper;

    @Mock
    private ApiarioRepository apiarioRepository;
    @Mock
    private ColmeiaRepository colmeiaRepository;

    private Apiario apiario;
    private Colmeia colmeia;
    private Producao producao;
    private ProducaoCriadaDTO producaoCriadaDTO;

    @BeforeEach
    void setUp() {
        apiario = new Apiario();
        apiario.setId(10L);
        apiario.setNome("Apiario Teste");

        colmeia = new Colmeia();
        colmeia.setId(100L);
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
        producao.setTipoProducao("Mel");
        producao.setQuantidade(10.0);
        producao.setUnidadeMedida(UnidadeMedida.LITRO);
        producao.setDataColeta(LocalDate.now());
        producao.setApiario(apiario);
        producao.setColmeia(colmeia);
        producao.setStatusProduto(StatusProduto.EM_ESTOQUE);
        producao.setStatusQualidade(StatusQualidade.NAO_AVALIADO);
    }

    @Test
    @DisplayName("Deve mapear ProducaoCriadaDTO para Producao com apiário e colmeia existentes")
    void toEntityFromCriada_ComApiarioEColmeiaExistentes_DeveMapearCorretamente() {
        // Arrange
        when(apiarioRepository.findById(apiario.getId())).thenReturn(Optional.of(apiario));
        when(colmeiaRepository.findById(colmeia.getId())).thenReturn(Optional.of(colmeia));

        // Act
        Producao result = producaoMapper.toEntityFromCriada(producaoCriadaDTO, apiarioRepository, colmeiaRepository);

        // Assert
        assertNotNull(result);
        assertNull(result.getId()); // ID should be ignored for creation
        assertEquals(producaoCriadaDTO.tipoProducao(), result.getTipoProducao());
        assertEquals(producaoCriadaDTO.quantidade(), result.getQuantidade());
        assertEquals(producaoCriadaDTO.unidadeMedida(), result.getUnidadeMedida());
        assertEquals(producaoCriadaDTO.dataColeta(), result.getDataColeta());
        assertEquals(apiario, result.getApiario());
        assertEquals(colmeia, result.getColmeia());
        assertEquals(StatusProduto.EM_ESTOQUE, result.getStatusProduto());
        assertEquals(StatusQualidade.NAO_AVALIADO, result.getStatusQualidade());
        verify(apiarioRepository, times(1)).findById(apiario.getId());
        verify(colmeiaRepository, times(1)).findById(colmeia.getId());
    }

    @Test
    @DisplayName("Deve lançar EntityNotFoundException ao mapear ProducaoCriadaDTO com apiário inexistente")
    void toEntityFromCriada_ComApiarioInexistente_DeveLancarExcecao() {
        // Arrange
        when(apiarioRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(EntityNotFoundException.class, () -> producaoMapper.toEntityFromCriada(producaoCriadaDTO, apiarioRepository, colmeiaRepository));
        verify(apiarioRepository, times(1)).findById(producaoCriadaDTO.apiarioId());
        verify(colmeiaRepository, never()).findById(anyLong()); // Colmeia lookup should not happen
    }

    @Test
    @DisplayName("Deve lançar EntityNotFoundException ao mapear ProducaoCriadaDTO com colmeia inexistente")
    void toEntityFromCriada_ComColmeiaInexistente_DeveLancarExcecao() {
        // Arrange
        when(apiarioRepository.findById(apiario.getId())).thenReturn(Optional.of(apiario));
        when(colmeiaRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(EntityNotFoundException.class, () -> producaoMapper.toEntityFromCriada(producaoCriadaDTO, apiarioRepository, colmeiaRepository));
        verify(apiarioRepository, times(1)).findById(apiario.getId());
        verify(colmeiaRepository, times(1)).findById(producaoCriadaDTO.colmeiaId());
    }

    @Test
    @DisplayName("Deve mapear Producao para ProducaoRetornoDTO corretamente")
    void toRetornoDTO_DeveMapearCorretamente() {
        // Act
        ProducaoRetornoDTO result = producaoMapper.toRetornoDTO(producao);

        // Assert
        assertNotNull(result);
        assertEquals(producao.getId(), result.id());
        assertEquals(producao.getTipoProducao(), result.tipoProducao());
        assertEquals(producao.getQuantidade(), result.quantidade());
        assertEquals(producao.getStatusProduto(), result.statusProduto());
        assertEquals(producao.getDataColeta(), result.dataColeta());
        assertEquals(producao.getApiario().getNome(), result.nomeApiario());
        assertEquals(producao.getColmeia().getIdentificador(), result.nomeColmeia());
        assertEquals(producao.getStatusQualidade(), result.statusQualidade());
    }
}

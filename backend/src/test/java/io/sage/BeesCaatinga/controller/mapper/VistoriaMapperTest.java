package io.sage.BeesCaatinga.controller.mapper;

import io.sage.BeesCaatinga.controller.dto.vistoria.VistoriaCriadaDTO;
import io.sage.BeesCaatinga.controller.dto.vistoria.VistoriaRetornoDTO;
import io.sage.BeesCaatinga.model.Apiario;
import io.sage.BeesCaatinga.model.Colmeia;
import io.sage.BeesCaatinga.model.Vistoria;
import io.sage.BeesCaatinga.model.enums.CondicaoVistoria;
import io.sage.BeesCaatinga.model.enums.TipoPerda;
import io.sage.BeesCaatinga.model.enums.TipoPraga;
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
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VistoriaMapperTest {

    @InjectMocks
    private VistoriaMapperImpl vistoriaMapper;

    @Mock
    private ApiarioRepository apiarioRepository;
    @Mock
    private ColmeiaRepository colmeiaRepository;

    private Apiario apiario;
    private Colmeia colmeia;
    private Vistoria vistoria;
    private VistoriaCriadaDTO vistoriaCriadaDTO;

    @BeforeEach
    void setUp() {
        apiario = new Apiario();
        apiario.setId(10L);
        apiario.setNome("Apiario Teste");

        colmeia = new Colmeia();
        colmeia.setId(100L);
        colmeia.setIdentificador("Colmeia Teste");

        vistoriaCriadaDTO = new VistoriaCriadaDTO(
                LocalDate.now(),
                apiario.getId(),
                colmeia.getId(),
                CondicaoVistoria.SAUDAVEL,
                Collections.singletonList(TipoPraga.VARROA),
                Collections.singletonList(TipoPerda.OUTRO),
                "Observacoes da vistoria"
        );

        vistoria = new Vistoria();
        vistoria.setId(1L);
        vistoria.setApiario(apiario);
        vistoria.setColmeia(colmeia);
        vistoria.setDataVistoria(LocalDate.now());
        vistoria.setCondicao(CondicaoVistoria.SAUDAVEL);
        vistoria.setPragasIdentificadas(Collections.singletonList(TipoPraga.VARROA));
        vistoria.setPerdasIdentificadas(Collections.singletonList(TipoPerda.OUTRO));
        vistoria.setObservacoes("Observacoes da vistoria");
    }

    @Test
    @DisplayName("Deve mapear VistoriaCriadaDTO para Vistoria com apiário e colmeia existentes")
    void toEntityFromCriada_ComApiarioEColmeiaExistentes_DeveMapearCorretamente() {
        // Arrange
        when(apiarioRepository.findById(apiario.getId())).thenReturn(Optional.of(apiario));
        when(colmeiaRepository.findById(colmeia.getId())).thenReturn(Optional.of(colmeia));

        // Act
        Vistoria result = vistoriaMapper.toEntityFromCriada(vistoriaCriadaDTO, apiarioRepository, colmeiaRepository);

        // Assert
        assertNotNull(result);
        assertNull(result.getId()); // ID should be ignored
        assertEquals(vistoriaCriadaDTO.dataVistoria(), result.getDataVistoria());
        assertEquals(apiario, result.getApiario());
        assertEquals(colmeia, result.getColmeia());
        assertEquals(vistoriaCriadaDTO.condicao(), result.getCondicao());
        assertEquals(vistoriaCriadaDTO.pragasIdentificadas(), result.getPragasIdentificadas());
        assertEquals(vistoriaCriadaDTO.perdasIdentificadas(), result.getPerdasIdentificadas());
        assertEquals(vistoriaCriadaDTO.observacoes(), result.getObservacoes());

        verify(apiarioRepository, times(1)).findById(apiario.getId());
        verify(colmeiaRepository, times(1)).findById(colmeia.getId());
    }

    @Test
    @DisplayName("Deve lançar EntityNotFoundException ao mapear VistoriaCriadaDTO com apiário inexistente")
    void toEntityFromCriada_ComApiarioInexistente_DeveLancarExcecao() {
        // Arrange
        when(apiarioRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(EntityNotFoundException.class, () -> vistoriaMapper.toEntityFromCriada(vistoriaCriadaDTO, apiarioRepository, colmeiaRepository));
        verify(apiarioRepository, times(1)).findById(vistoriaCriadaDTO.apiario_id());
        verify(colmeiaRepository, never()).findById(anyLong()); // Colmeia lookup should not happen
    }

    @Test
    @DisplayName("Deve lançar EntityNotFoundException ao mapear VistoriaCriadaDTO com colmeia inexistente")
    void toEntityFromCriada_ComColmeiaInexistente_DeveLancarExcecao() {
        // Arrange
        when(apiarioRepository.findById(apiario.getId())).thenReturn(Optional.of(apiario));
        when(colmeiaRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(EntityNotFoundException.class, () -> vistoriaMapper.toEntityFromCriada(vistoriaCriadaDTO, apiarioRepository, colmeiaRepository));
        verify(apiarioRepository, times(1)).findById(apiario.getId());
        verify(colmeiaRepository, times(1)).findById(vistoriaCriadaDTO.colmeia_id());
    }

    @Test
    @DisplayName("Deve mapear Vistoria para VistoriaRetornoDTO corretamente")
    void toRetornoDTO_DeveMapearCorretamente() {
        // Act
        VistoriaRetornoDTO result = vistoriaMapper.toRetornoDTO(vistoria);

        // Assert
        assertNotNull(result);
        assertEquals(vistoria.getDataVistoria(), result.dataVistoria());
        assertEquals(vistoria.getCondicao(), result.condicao());
        assertEquals(vistoria.getColmeia().getIdentificador(), result.nomeColmeia());
        assertEquals(vistoria.getApiario().getNome(), result.nomeApiario());
        assertEquals(vistoria.getPragasIdentificadas(), result.pragasIdentificadas());
        assertEquals(vistoria.getPerdasIdentificadas(), result.perdasIdentificadas());
        assertEquals(vistoria.getObservacoes(), result.observacoes());
    }
}

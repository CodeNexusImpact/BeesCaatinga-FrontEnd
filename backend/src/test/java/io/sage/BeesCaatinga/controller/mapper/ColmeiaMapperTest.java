package io.sage.BeesCaatinga.controller.mapper;

import io.sage.BeesCaatinga.controller.dto.colmeia.ColmeiaCriadaDTO;
import io.sage.BeesCaatinga.controller.dto.colmeia.ColmeiaRetornoDTO;
import io.sage.BeesCaatinga.controller.dto.colmeia.ColmeiaRetornoEmApiarioDTO;
import io.sage.BeesCaatinga.model.Apiario;
import io.sage.BeesCaatinga.model.Colmeia;
import io.sage.BeesCaatinga.model.enums.StatusColmeia;
import io.sage.BeesCaatinga.model.enums.TipoColmeia;
import io.sage.BeesCaatinga.repository.ApiarioRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ColmeiaMapperTest {

    @InjectMocks
    private ColmeiaMapperImpl colmeiaMapper;

    @Mock
    private ApiarioRepository apiarioRepository;

    private Colmeia colmeia;
    private Apiario apiario;
    private ColmeiaCriadaDTO colmeiaCriadaDTO;

    @BeforeEach
    void setUp() {
        apiario = new Apiario();
        apiario.setId(10L);
        apiario.setNome("Apiario Teste");

        colmeiaCriadaDTO = new ColmeiaCriadaDTO(
                "C001",
                10L,
                TipoColmeia.MADEIRA,
                true,
                "Obs",
                "Detalhes loc",
                "foto.jpg",
                BigDecimal.valueOf(10.0),
                BigDecimal.valueOf(20.0)
        );

        colmeia = new Colmeia();
        colmeia.setId(100L);
        colmeia.setIdentificador("C001");
        colmeia.setApiario(apiario);
        colmeia.setAtiva(true);
        colmeia.setTipo(TipoColmeia.MADEIRA);
        colmeia.setLatitude(BigDecimal.valueOf(10.0));
        colmeia.setLongitude(BigDecimal.valueOf(20.0));
        colmeia.setObservacoes("Obs");
        colmeia.setDetalhesDaLocalizacao("Detalhes loc");
        colmeia.setCaminhoDaFoto("foto.jpg");
        colmeia.setSituacao(StatusColmeia.SAUDAVEL);
        colmeia.setUltimaVistoria(LocalDate.now());
    }

    @Test
    @DisplayName("Deve mapear ColmeiaCriadaDTO para Colmeia com apiario existente")
    void toEntityFromCriada_ComApiarioExistente_DeveMapearCorretamente() {
        // Arrange
        when(apiarioRepository.findById(apiario.getId())).thenReturn(Optional.of(apiario));

        // Act
        Colmeia result = colmeiaMapper.toEntityFromCriada(colmeiaCriadaDTO, apiarioRepository);

        // Assert
        assertNotNull(result);
        assertNull(result.getId()); // ID is ignored
        assertEquals(colmeiaCriadaDTO.identificador(), result.getIdentificador());
        assertEquals(apiario, result.getApiario());
        verify(apiarioRepository).findById(colmeiaCriadaDTO.apiario_id());
    }

    @Test
    @DisplayName("Deve lançar EntityNotFoundException ao mapear ColmeiaCriadaDTO com apiario inexistente")
    void toEntityFromCriada_ComApiarioInexistente_DeveLancarExcecao() {
        // Arrange
        when(apiarioRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(EntityNotFoundException.class, () -> colmeiaMapper.toEntityFromCriada(colmeiaCriadaDTO, apiarioRepository));
    }

    @Test
    @DisplayName("Deve mapear Colmeia para ColmeiaRetornoDTO")
    void toRetornoDTO_DeveMapearCorretamente() {
        // Act
        ColmeiaRetornoDTO result = colmeiaMapper.toRetornoDTO(colmeia);

        // Assert
        assertNotNull(result);
        assertEquals(colmeia.getIdentificador(), result.identificador());
        assertEquals(colmeia.getApiario().getNome(), result.nomeApiario());
        assertEquals(colmeia.getSituacao(), result.statusColmeia());
    }

    @Test
    @DisplayName("Deve mapear Colmeia para ColmeiaRetornoEmApiarioDTO")
    void toRetornoEmApiarioDTO_DeveMapearCorretamente() {
        // Act
        ColmeiaRetornoEmApiarioDTO result = colmeiaMapper.toRetornoEmApiarioDTO(colmeia);

        // Assert
        assertNotNull(result);
        assertEquals(colmeia.getIdentificador(), result.identificador());
        assertEquals(colmeia.getSituacao(), result.statusColmeia());
    }
}

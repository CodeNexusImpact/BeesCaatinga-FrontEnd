package io.sage.BeesCaatinga.service;

import io.sage.BeesCaatinga.controller.dto.lote.LoteCriadoDTO;
import io.sage.BeesCaatinga.controller.dto.lote.LoteRetornoCodigoDTO;
import io.sage.BeesCaatinga.controller.exception.ResourceNotFoundException;
import io.sage.BeesCaatinga.controller.mapper.LoteMapper;
import io.sage.BeesCaatinga.model.Apiario;
import io.sage.BeesCaatinga.model.Lote;
import io.sage.BeesCaatinga.model.Produtor;
import io.sage.BeesCaatinga.model.enums.StatusProduto; // Still needed for some old DTOs? No, just remove it if not used.
import io.sage.BeesCaatinga.model.enums.TipoAbelha;
import io.sage.BeesCaatinga.model.enums.TipoFlorada;
import io.sage.BeesCaatinga.repository.ApiarioRepository;
import io.sage.BeesCaatinga.repository.LoteRepository;
import io.sage.BeesCaatinga.repository.ProdutorRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal; // Import for BigDecimal
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LoteServiceTest {

    @Mock
    private ProdutorRepository produtorRepository;
    @Mock
    private ApiarioRepository apiarioRepository;
    @Mock
    private LoteRepository loteRepository;
    @Mock
    private LoteMapper loteMapper;

    @InjectMocks
    private LoteService loteService;

    private Produtor produtor;
    private Apiario apiario;
    private LoteCriadoDTO loteCriadoDTO;
    private Lote lote;
    private LoteRetornoCodigoDTO loteRetornoCodigoDTO;

    @BeforeEach
    void setUp() {
        produtor = new Produtor();
        produtor.setId(1L);
        produtor.setNomeCompleto("Test Produtor");

        apiario = new Apiario();
        apiario.setId(10L);
        apiario.setNome("Apiario Teste");
        apiario.setProdutor(produtor);

        // Corrected LoteCriadoDTO instantiation
        loteCriadoDTO = new LoteCriadoDTO(
                LocalDate.now(),           // dataProducao
                100.0,                     // quantidadeProduzida
                "Apiario Teste",           // nomeApiario
                TipoFlorada.SILVESTRE,     // tipoFlorada
                BigDecimal.valueOf(-8.0578), // latitude
                BigDecimal.valueOf(-34.8829),// longitude
                TipoAbelha.APIS_MELLIFERA, // tipoAbelha
                false                      // vendido
        );

        lote = new Lote();
        lote.setId(1L);
        lote.setDataProducao(LocalDate.now());
        lote.setTipoFlorada(TipoFlorada.SILVESTRE);
        lote.setQuantidadeProduzida(100.0);
        lote.setApiario(apiario);
        lote.setVendido(false); // Corresponds to DTO's 'vendido'

        loteRetornoCodigoDTO = new LoteRetornoCodigoDTO(1L);
    }

    @Test
    @DisplayName("Deve salvar um lote com sucesso quando o produtor e apiário existirem")
    void salvar_ComProdutorEApiarioExistentes_DeveRetornarLoteRetornoCodigoDTO() {
        // Arrange
        Long produtorId = 1L;
        when(apiarioRepository.findByNome(loteCriadoDTO.nomeApiario())).thenReturn(Optional.of(apiario));
        when(loteMapper.toEntityFromCriado(any(LoteCriadoDTO.class), eq(apiarioRepository))).thenReturn(lote);
        when(loteRepository.save(any(Lote.class))).thenReturn(lote);
        when(loteMapper.toRetornoCodigoDTO(any(Lote.class))).thenReturn(loteRetornoCodigoDTO);

        // Act
        LoteRetornoCodigoDTO result = loteService.salvar(produtorId, loteCriadoDTO);

        // Assert
        assertNotNull(result);
        assertEquals(lote.getId(), result.id());
        verify(apiarioRepository, times(1)).findByNome(loteCriadoDTO.nomeApiario());
        verify(loteMapper, times(1)).toEntityFromCriado(any(LoteCriadoDTO.class), eq(apiarioRepository));
        verify(loteRepository, times(1)).save(lote);
        verify(loteMapper, times(1)).toRetornoCodigoDTO(lote);
    }
    
    @Test
    @DisplayName("Deve lançar ResourceNotFoundException quando o apiário não for encontrado")
    void salvar_ApiarioNaoEncontrado_DeveLancarExcecao() {
        // Arrange
        Long produtorId = 1L;
        when(apiarioRepository.findByNome(loteCriadoDTO.nomeApiario())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> loteService.salvar(produtorId, loteCriadoDTO));
        verify(apiarioRepository, times(1)).findByNome(loteCriadoDTO.nomeApiario());
        verify(loteRepository, never()).save(any(Lote.class));
        verify(loteMapper, never()).toEntityFromCriado(any(LoteCriadoDTO.class), any(ApiarioRepository.class));
        verify(loteMapper, never()).toRetornoCodigoDTO(any(Lote.class));
    }

    @Test
    @DisplayName("Deve lançar ResourceNotFoundException quando o apiário não pertencer ao produtor")
    void salvar_ApiarioNaoPertenceAoProdutor_DeveLancarExcecao() {
        // Arrange
        Long produtorId = 1L;
        Produtor outroProdutor = new Produtor();
        outroProdutor.setId(2L);
        apiario.setProdutor(outroProdutor);

        when(apiarioRepository.findByNome(loteCriadoDTO.nomeApiario())).thenReturn(Optional.of(apiario));

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> loteService.salvar(produtorId, loteCriadoDTO));
        verify(apiarioRepository, times(1)).findByNome(loteCriadoDTO.nomeApiario());
        verify(loteRepository, never()).save(any(Lote.class));
        verify(loteMapper, never()).toEntityFromCriado(any(LoteCriadoDTO.class), any(ApiarioRepository.class));
        verify(loteMapper, never()).toRetornoCodigoDTO(any(Lote.class));
    }
}

package io.sage.BeesCaatinga.service;

import io.sage.BeesCaatinga.controller.dto.vistoria.VistoriaCriadaDTO;
import io.sage.BeesCaatinga.controller.dto.vistoria.VistoriaRetornoDTO;
import io.sage.BeesCaatinga.controller.exception.ResourceNotFoundException;
import io.sage.BeesCaatinga.controller.mapper.VistoriaMapper;
import io.sage.BeesCaatinga.model.Apiario;
import io.sage.BeesCaatinga.model.Colmeia;
import io.sage.BeesCaatinga.model.Produtor;
import io.sage.BeesCaatinga.model.Vistoria;
import io.sage.BeesCaatinga.model.enums.CondicaoVistoria;
import io.sage.BeesCaatinga.model.enums.TipoPerda;
import io.sage.BeesCaatinga.model.enums.TipoPraga;
import io.sage.BeesCaatinga.repository.ApiarioRepository;
import io.sage.BeesCaatinga.repository.ColmeiaRepository;
import io.sage.BeesCaatinga.repository.ProdutorRepository;
import io.sage.BeesCaatinga.repository.VistoriaRepository;
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
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VistoriaServiceTest {

    @Mock
    private ProdutorRepository produtorRepository;
    @Mock
    private ApiarioRepository apiarioRepository;
    @Mock
    private ColmeiaRepository colmeiaRepository;
    @Mock
    private VistoriaRepository vistoriaRepository;
    @Mock
    private VistoriaMapper vistoriaMapper;

    @InjectMocks
    private VistoriaService vistoriaService;

    private Produtor produtor;
    private Apiario apiario;
    private Colmeia colmeia;
    private Vistoria vistoria;
    private VistoriaCriadaDTO vistoriaCriadaDTO;
    private VistoriaRetornoDTO vistoriaRetornoDTO;

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

        // Corrected enum values
        vistoriaCriadaDTO = new VistoriaCriadaDTO(
                LocalDate.now(), // dataVistoria
                apiario.getId(), // apiario_id
                colmeia.getId(), // colmeia_id
                CondicaoVistoria.SAUDAVEL, // Corrected enum value
                Collections.singletonList(TipoPraga.VARROA), // Corrected enum value
                Collections.singletonList(TipoPerda.OUTRO), // Corrected enum value
                "Observacoes da vistoria"
        );

        vistoria = new Vistoria();
        vistoria.setId(1L);
        vistoria.setApiario(apiario);
        vistoria.setColmeia(colmeia);
        vistoria.setDataVistoria(LocalDate.now());
        vistoria.setCondicao(CondicaoVistoria.SAUDAVEL); // Corrected enum value
        vistoria.setPragasIdentificadas(Collections.singletonList(TipoPraga.VARROA)); // Corrected enum value
        vistoria.setPerdasIdentificadas(Collections.singletonList(TipoPerda.OUTRO)); // Corrected enum value
        vistoria.setObservacoes("Observacoes da vistoria");

        vistoriaRetornoDTO = new VistoriaRetornoDTO(
                vistoria.getDataVistoria(),
                vistoria.getCondicao(),
                vistoria.getColmeia().getIdentificador(),
                vistoria.getApiario().getNome(),
                vistoria.getPragasIdentificadas(),
                vistoria.getPerdasIdentificadas(),
                vistoria.getObservacoes()
        );
    }

    @Test
    @DisplayName("Deve salvar uma vistoria com sucesso")
    void salvar_ComDadosValidos_DeveRetornarVistoriaRetornoDTO() {
        // Arrange
        when(colmeiaRepository.findById(colmeia.getId())).thenReturn(Optional.of(colmeia));
        when(vistoriaMapper.toEntityFromCriada(any(VistoriaCriadaDTO.class), any(ApiarioRepository.class), any(ColmeiaRepository.class))).thenReturn(vistoria);
        when(vistoriaRepository.save(any(Vistoria.class))).thenReturn(vistoria);
        when(colmeiaRepository.save(any(Colmeia.class))).thenReturn(colmeia); // Mock colmeia save
        when(vistoriaMapper.toRetornoDTO(any(Vistoria.class))).thenReturn(vistoriaRetornoDTO);

        // Act
        VistoriaRetornoDTO result = vistoriaService.salvar(produtor.getId(), apiario.getId(), colmeia.getId(), vistoriaCriadaDTO);

        // Assert
        assertNotNull(result);
        assertEquals(vistoriaRetornoDTO.dataVistoria(), result.dataVistoria());
        verify(colmeiaRepository, times(1)).findById(colmeia.getId());
        verify(vistoriaMapper, times(1)).toEntityFromCriada(any(VistoriaCriadaDTO.class), any(ApiarioRepository.class), any(ColmeiaRepository.class));
        verify(vistoriaRepository, times(1)).save(vistoria);
        verify(colmeiaRepository, times(1)).save(colmeia); // Verify colmeia update
        verify(vistoriaMapper, times(1)).toRetornoDTO(vistoria);
        assertEquals(vistoriaCriadaDTO.dataVistoria(), colmeia.getUltimaVistoria()); // Verify ultimaVistoria update
    }

    @Test
    @DisplayName("Deve lançar ResourceNotFoundException ao salvar vistoria para colmeia inexistente")
    void salvar_ColmeiaInexistente_DeveLancarExcecao() {
        // Arrange
        when(colmeiaRepository.findById(colmeia.getId())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> vistoriaService.salvar(produtor.getId(), apiario.getId(), colmeia.getId(), vistoriaCriadaDTO));
        verify(vistoriaRepository, never()).save(any());
        verify(colmeiaRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve lançar ResourceNotFoundException ao salvar vistoria para colmeia de outro apiário")
    void salvar_ColmeiaDeOutroApiario_DeveLancarExcecao() {
        // Arrange
        Apiario outroApiario = new Apiario();
        outroApiario.setId(11L); // Different apiario
        outroApiario.setProdutor(produtor);
        colmeia.setApiario(outroApiario); // Colmeia now belongs to another apiario
        when(colmeiaRepository.findById(colmeia.getId())).thenReturn(Optional.of(colmeia));

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> vistoriaService.salvar(produtor.getId(), apiario.getId(), colmeia.getId(), vistoriaCriadaDTO));
        verify(vistoriaRepository, never()).save(any());
        verify(colmeiaRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve lançar ResourceNotFoundException ao salvar vistoria para colmeia de apiário de outro produtor")
    void salvar_ColmeiaDeApiarioDeOutroProdutor_DeveLancarExcecao() {
        // Arrange
        Produtor outroProdutor = new Produtor();
        outroProdutor.setId(2L);
        apiario.setProdutor(outroProdutor); // Apiário agora pertence a outro produtor
        when(colmeiaRepository.findById(colmeia.getId())).thenReturn(Optional.of(colmeia));

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> vistoriaService.salvar(produtor.getId(), apiario.getId(), colmeia.getId(), vistoriaCriadaDTO));
        verify(vistoriaRepository, never()).save(any());
        verify(colmeiaRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve lançar IllegalArgumentException quando apiarioId do DTO não coincide com apiarioId da URL")
    void salvar_ApiarioIdDtoNaoCoincide_DeveLancarExcecao() {
        // Arrange
        Long wrongApiarioId = 99L;
        vistoriaCriadaDTO = new VistoriaCriadaDTO(
                LocalDate.now(),
                wrongApiarioId, // Different apiarioId in DTO
                colmeia.getId(),
                CondicaoVistoria.SAUDAVEL, // Corrected enum value
                Collections.emptyList(),
                Collections.emptyList(),
                "Obs"
        );
        when(colmeiaRepository.findById(colmeia.getId())).thenReturn(Optional.of(colmeia));

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> vistoriaService.salvar(produtor.getId(), apiario.getId(), colmeia.getId(), vistoriaCriadaDTO));
        verify(vistoriaRepository, never()).save(any());
        verify(colmeiaRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve lançar IllegalArgumentException quando colmeiaId do DTO não coincide com colmeiaId da URL")
    void salvar_ColmeiaIdDtoNaoCoincide_DeveLancarExcecao() {
        // Arrange
        Long wrongColmeiaId = 999L;
        vistoriaCriadaDTO = new VistoriaCriadaDTO(
                LocalDate.now(),
                apiario.getId(),
                wrongColmeiaId, // Different colmeiaId in DTO
                CondicaoVistoria.SAUDAVEL, // Corrected enum value
                Collections.emptyList(),
                Collections.emptyList(),
                "Obs"
        );
        when(colmeiaRepository.findById(colmeia.getId())).thenReturn(Optional.of(colmeia));

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> vistoriaService.salvar(produtor.getId(), apiario.getId(), colmeia.getId(), vistoriaCriadaDTO));
        verify(vistoriaRepository, never()).save(any());
        verify(colmeiaRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve listar vistorias com sucesso")
    void listar_ComProdutorExistente_DeveRetornarListaDeVistorias() {
        // Arrange
        when(produtorRepository.existsById(produtor.getId())).thenReturn(true);
        when(vistoriaRepository.findByApiarioProdutorId(produtor.getId())).thenReturn(Collections.singletonList(vistoria));
        when(vistoriaMapper.toRetornoDTO(vistoria)).thenReturn(vistoriaRetornoDTO);

        // Act
        List<VistoriaRetornoDTO> result = vistoriaService.listar(produtor.getId());

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(vistoriaRetornoDTO, result.get(0));
        verify(produtorRepository, times(1)).existsById(produtor.getId());
        verify(vistoriaRepository, times(1)).findByApiarioProdutorId(produtor.getId());
        verify(vistoriaMapper, times(1)).toRetornoDTO(vistoria);
    }

    @Test
    @DisplayName("Deve lançar ResourceNotFoundException ao listar vistorias de produtor inexistente")
    void listar_ProdutorInexistente_DeveLancarExcecao() {
        // Arrange
        when(produtorRepository.existsById(produtor.getId())).thenReturn(false);

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> vistoriaService.listar(produtor.getId()));
        verify(produtorRepository, times(1)).existsById(produtor.getId());
        verify(vistoriaRepository, never()).findByApiarioProdutorId(anyLong());
        verify(vistoriaMapper, never()).toRetornoDTO(any());
    }
}

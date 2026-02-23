package io.sage.BeesCaatinga.service;

import io.sage.BeesCaatinga.controller.dto.colmeia.ColmeiaAtualizadaDTO;
import io.sage.BeesCaatinga.controller.dto.colmeia.ColmeiaCriadaDTO;
import io.sage.BeesCaatinga.controller.dto.colmeia.ColmeiaRetornoDTO;
import io.sage.BeesCaatinga.controller.exception.ResourceNotFoundException;
import io.sage.BeesCaatinga.controller.mapper.ColmeiaMapper;
import io.sage.BeesCaatinga.model.Apiario;
import io.sage.BeesCaatinga.model.Colmeia;
import io.sage.BeesCaatinga.model.Produtor;
import io.sage.BeesCaatinga.model.Vistoria;
import io.sage.BeesCaatinga.model.enums.StatusColmeia;
import io.sage.BeesCaatinga.model.enums.TipoColmeia;
import io.sage.BeesCaatinga.repository.ApiarioRepository;
import io.sage.BeesCaatinga.repository.ColmeiaRepository;
import io.sage.BeesCaatinga.repository.VistoriaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ColmeiaServiceTest {

    @Mock
    private ApiarioRepository apiarioRepository;
    @Mock
    private VistoriaRepository vistoriaRepository;
    @Mock
    private ColmeiaRepository colmeiaRepository;
    @Mock
    private ColmeiaMapper colmeiaMapper;

    @InjectMocks
    private ColmeiaService colmeiaService;

    private Produtor produtor;
    private Apiario apiario;
    private Colmeia colmeiaAtiva;
    private Colmeia colmeiaInativa;
    private ColmeiaCriadaDTO colmeiaCriadaDTO;
    private ColmeiaRetornoDTO colmeiaRetornoDTO;
    private ColmeiaAtualizadaDTO colmeiaAtualizadaDTO;


    @BeforeEach
    void setUp() {
        produtor = new Produtor();
        produtor.setId(1L);

        apiario = new Apiario();
        apiario.setId(10L);
        apiario.setNome("Apiario Teste");
        apiario.setProdutor(produtor);
        apiario.setColmeias(new ArrayList<>());

        colmeiaCriadaDTO = new ColmeiaCriadaDTO(
                "C001", 10L, TipoColmeia.MADEIRA, true, "Obs",
                "Detalhes loc", "foto.jpg", BigDecimal.valueOf(10.0), BigDecimal.valueOf(20.0)
        );

        colmeiaAtiva = new Colmeia();
        colmeiaAtiva.setId(100L);
        colmeiaAtiva.setIdentificador("C001");
        colmeiaAtiva.setApiario(apiario);
        colmeiaAtiva.setAtiva(true);

        colmeiaInativa = new Colmeia();
        colmeiaInativa.setId(101L);
        colmeiaInativa.setIdentificador("C002");
        colmeiaInativa.setApiario(apiario);
        colmeiaInativa.setAtiva(false);

        // Corrected constructor call
        colmeiaAtualizadaDTO = new ColmeiaAtualizadaDTO(
                "C001-Atualizado",
                null, // apiario_id is optional for update
                TipoColmeia.CONCRETO,
                false,
                "Obs Att",
                "Detalhes loc Att",
                "fotoAtt.jpg",
                BigDecimal.valueOf(11.0),
                BigDecimal.valueOf(22.0)
        );

        colmeiaRetornoDTO = new ColmeiaRetornoDTO(
                "C001", "foto.jpg", "Apiario Teste", TipoColmeia.MADEIRA,
                StatusColmeia.SAUDAVEL, LocalDate.now(), "Obs",
                BigDecimal.valueOf(10.0), BigDecimal.valueOf(20.0), "Detalhes loc"
        );
    }

    @Test
    @DisplayName("Deve salvar uma colmeia com sucesso")
    void salvar_ComDadosValidos_DeveRetornarColmeiaRetornoDTO() {
        when(apiarioRepository.findById(apiario.getId())).thenReturn(Optional.of(apiario));
        when(colmeiaMapper.toEntityFromCriada(any(), any())).thenReturn(colmeiaAtiva);
        when(colmeiaRepository.save(any(Colmeia.class))).thenReturn(colmeiaAtiva);
        when(colmeiaMapper.toRetornoDTO(any(Colmeia.class))).thenReturn(colmeiaRetornoDTO);

        ColmeiaRetornoDTO result = colmeiaService.salvar(produtor.getId(), apiario.getId(), colmeiaCriadaDTO);

        assertNotNull(result);
        assertEquals(colmeiaRetornoDTO.identificador(), result.identificador());
        verify(colmeiaRepository).save(colmeiaAtiva);
    }

    @Test
    @DisplayName("Deve listar apenas colmeias ativas")
    void listarAtivas_ComColmeiasMistas_DeveRetornarApenasAtivas() {
        apiario.getColmeias().addAll(Arrays.asList(colmeiaAtiva, colmeiaInativa));
        when(apiarioRepository.findById(apiario.getId())).thenReturn(Optional.of(apiario));
        when(colmeiaMapper.toRetornoDTO(colmeiaAtiva)).thenReturn(colmeiaRetornoDTO);

        List<ColmeiaRetornoDTO> result = colmeiaService.listarAtivas(produtor.getId(), apiario.getId());

        assertEquals(1, result.size());
        assertEquals(colmeiaRetornoDTO.identificador(), result.get(0).identificador());
        verify(colmeiaMapper, times(1)).toRetornoDTO(colmeiaAtiva);
        verify(colmeiaMapper, never()).toRetornoDTO(colmeiaInativa);
    }

    @Test
    @DisplayName("Deve atualizar colmeia com sucesso")
    void atualizar_ComDadosValidos_DeveRetornarColmeiaAtualizada() {
        when(colmeiaRepository.findById(colmeiaAtiva.getId())).thenReturn(Optional.of(colmeiaAtiva));
        when(colmeiaRepository.save(any(Colmeia.class))).thenReturn(colmeiaAtiva);
        when(colmeiaMapper.toRetornoDTO(colmeiaAtiva)).thenReturn(colmeiaRetornoDTO);

        ColmeiaRetornoDTO result = colmeiaService.atualizar(produtor.getId(), apiario.getId(), colmeiaAtiva.getId(), colmeiaAtualizadaDTO);

        assertNotNull(result);
        verify(colmeiaRepository).save(colmeiaAtiva);
        assertEquals("C001-Atualizado", colmeiaAtiva.getIdentificador());
        assertEquals(TipoColmeia.CONCRETO, colmeiaAtiva.getTipo());
        assertFalse(colmeiaAtiva.getAtiva());
    }

    @Test
    @DisplayName("Deve deletar colmeia e suas vistorias")
    void deletar_ComVistoriasExistentes_DeveDeletarColmeiaEVistorias() {
        when(colmeiaRepository.findById(colmeiaAtiva.getId())).thenReturn(Optional.of(colmeiaAtiva));
        List<Vistoria> vistorias = Arrays.asList(new Vistoria(), new Vistoria());
        when(vistoriaRepository.findByColmeiaId(colmeiaAtiva.getId())).thenReturn(vistorias);

        colmeiaService.deletar(produtor.getId(), apiario.getId(), colmeiaAtiva.getId());

        verify(vistoriaRepository).deleteAll(vistorias);
        verify(colmeiaRepository).delete(colmeiaAtiva);
    }

    @Test
    @DisplayName("Deve deletar colmeia sem vistorias")
    void deletar_SemVistorias_DeveDeletarApenasColmeia() {
        when(colmeiaRepository.findById(colmeiaAtiva.getId())).thenReturn(Optional.of(colmeiaAtiva));
        when(vistoriaRepository.findByColmeiaId(colmeiaAtiva.getId())).thenReturn(Collections.emptyList());

        colmeiaService.deletar(produtor.getId(), apiario.getId(), colmeiaAtiva.getId());

        verify(vistoriaRepository, never()).deleteAll(any());
        verify(colmeiaRepository).delete(colmeiaAtiva);
    }
}

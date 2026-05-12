package io.sage.BeesCaatinga.service;

import io.sage.BeesCaatinga.controller.dto.apiario.ApiarioAtualizadoDTO;
import io.sage.BeesCaatinga.controller.dto.apiario.ApiarioCriadoDTO;
import io.sage.BeesCaatinga.controller.dto.apiario.ApiarioRetornoDTO;
import io.sage.BeesCaatinga.controller.dto.colmeia.ColmeiaRetornoEmApiarioDTO;
import io.sage.BeesCaatinga.controller.exception.ResourceNotFoundException;
import io.sage.BeesCaatinga.controller.mapper.ApiarioMapper;
import io.sage.BeesCaatinga.model.Apiario;
import io.sage.BeesCaatinga.model.Colmeia;
import io.sage.BeesCaatinga.model.Produtor;
import io.sage.BeesCaatinga.repository.ApiarioRepository;
import io.sage.BeesCaatinga.repository.ProdutorRepository;
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
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ApiarioServiceTest {

    @Mock
    private ProdutorRepository produtorRepository;
    @Mock
    private ApiarioRepository apiarioRepository;
    @Mock
    private ApiarioMapper apiarioMapper;

    @InjectMocks
    private ApiarioService apiarioService;

    private Produtor produtor;
    private Produtor outroProdutor; // For 'Apiario does not belong to Produtor' tests
    private Apiario apiario;
    private ApiarioCriadoDTO apiarioCriadoDTO;
    private ApiarioAtualizadoDTO apiarioAtualizadoDTO;
    private ApiarioRetornoDTO apiarioRetornoDTO;

    @BeforeEach
    void setUp() {
        produtor = new Produtor();
        produtor.setId(1L);
        produtor.setNomeCompleto("Produtor Teste");
        produtor.setApiarios(new ArrayList<>()); 

        outroProdutor = new Produtor();
        outroProdutor.setId(2L);
        outroProdutor.setNomeCompleto("Outro Produtor");

        apiario = new Apiario();
        apiario.setId(10L);
        apiario.setNome("Apiario Alfa");
        apiario.setNRegistro("Reg123");
        apiario.setDataDeCriacao(LocalDate.now());
        apiario.setObservacoes("Obs Criacao");
        apiario.setCep("12345-678");
        apiario.setNomeDaPropriedade("Fazenda Beta");
        apiario.setEstado("Estado X");
        apiario.setCidade("Cidade Y");
        apiario.setBairro("Bairro Z");
        apiario.setRua("Rua A");
        apiario.setNumero("100");
        apiario.setComplemento("Comp 1");
        apiario.setCaminhoDaFoto("foto.jpg");
        apiario.setLatitude(BigDecimal.valueOf(10.0));
        apiario.setLongitude(BigDecimal.valueOf(20.0));
        apiario.setProdutor(produtor);
        apiario.setColmeias(new ArrayList<>()); 

        apiarioCriadoDTO = new ApiarioCriadoDTO(
                "Apiario Alfa",          // nome
                "Reg123",                // nRegistro
                LocalDate.now(),         // dataDeCriacao
                "12345-678",             // cep
                "Fazenda Beta",          // nomeDaPropriedade
                "Estado X",              // estado
                "Cidade Y",              // cidade
                "Bairro Z",              // bairro
                "Rua A",                 // rua
                "100",                   // numero
                "Comp 1",                // complemento
                produtor.getId(),        // produtor_id
                BigDecimal.valueOf(10.0),// latitude
                BigDecimal.valueOf(20.0) // longitude
        );

        apiarioAtualizadoDTO = new ApiarioAtualizadoDTO(
                "Apiario Atualizado",
                "Novo NRegistro",
                LocalDate.now().plusDays(1), // Updated date
                "Novas Observacoes",
                "98765-432",
                "Fazenda Gama",
                "Estado Y",
                "Cidade X",
                "Bairro W",
                "Rua B",
                "200",
                "Comp 2",
                "nova_foto.jpg",
                BigDecimal.valueOf(20.0),
                BigDecimal.valueOf(10.0)
        );

        apiarioRetornoDTO = new ApiarioRetornoDTO(
                apiario.getId(),
                apiario.getNome(),
                apiario.getCaminhoDaFoto(),
                apiario.getNRegistro(),
                apiario.getDataDeCriacao(),
                apiario.getObservacoes(),
                apiario.getCep(),
                apiario.getNomeDaPropriedade(),
                apiario.getEstado(),
                apiario.getCidade(),
                apiario.getBairro(),
                apiario.getRua(),
                apiario.getNumero(),
                apiario.getComplemento(),
                Collections.emptyList() 
        );
    }

    @Test
    @DisplayName("Deve salvar um apiário com sucesso quando o produtor existir")
    void salvarApiario_ComProdutorExistente_DeveRetornarApiarioRetornoDTO() {
        // Arrange
        Long produtorId = 1L;
        when(produtorRepository.findById(produtorId)).thenReturn(Optional.of(produtor));
        when(apiarioMapper.toEntityFromCriado(apiarioCriadoDTO, produtorRepository)).thenReturn(apiario);
        when(apiarioRepository.save(apiario)).thenReturn(apiario);
        when(apiarioMapper.toRetornoDTO(apiario)).thenReturn(apiarioRetornoDTO);

        // Act
        ApiarioRetornoDTO result = apiarioService.salvarApiario(produtorId, apiarioCriadoDTO);

        // Assert
        assertNotNull(result);
        assertEquals(apiarioRetornoDTO.nome(), result.nome());
        verify(produtorRepository, times(1)).findById(produtorId);
        verify(apiarioMapper, times(1)).toEntityFromCriado(apiarioCriadoDTO, produtorRepository);
        verify(apiarioRepository, times(1)).save(apiario);
        verify(apiarioMapper, times(1)).toRetornoDTO(apiario);
        assertEquals(produtor, apiario.getProdutor());
    }

    @Test
    @DisplayName("Deve lançar ResourceNotFoundException ao salvar apiário com produtor inexistente")
    void salvarApiario_ComProdutorInexistente_DeveLancarExcecao() {
        // Arrange
        Long produtorId = 1L;
        when(produtorRepository.findById(produtorId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> apiarioService.salvarApiario(produtorId, apiarioCriadoDTO));
        verify(produtorRepository, times(1)).findById(produtorId);
        verify(apiarioMapper, never()).toEntityFromCriado(any(ApiarioCriadoDTO.class), any(ProdutorRepository.class));
        verify(apiarioRepository, never()).save(any());
        verify(apiarioMapper, never()).toRetornoDTO(any());
    }

    @Test
    @DisplayName("Deve listar apiários com sucesso quando o produtor existir")
    void listar_ComProdutorExistente_DeveRetornarListaDeApiarioRetornoDTO() {
        // Arrange
        Long produtorId = 1L;
        produtor.getApiarios().add(apiario);
        when(produtorRepository.findById(produtorId)).thenReturn(Optional.of(produtor));
        when(apiarioMapper.toRetornoDTO(apiario)).thenReturn(apiarioRetornoDTO);

        // Act
        List<ApiarioRetornoDTO> result = apiarioService.listar(produtorId);

        // Assert
        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
        assertEquals(apiarioRetornoDTO.nome(), result.get(0).nome());
        verify(produtorRepository, times(1)).findById(produtorId);
        verify(apiarioMapper, times(1)).toRetornoDTO(apiario);
    }

    @Test
    @DisplayName("Deve lançar ResourceNotFoundException ao listar apiários com produtor inexistente")
    void listar_ComProdutorInexistente_DeveLancarExcecao() {
        // Arrange
        Long produtorId = 1L;
        when(produtorRepository.findById(produtorId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> apiarioService.listar(produtorId));
        verify(produtorRepository, times(1)).findById(produtorId);
        verify(apiarioMapper, never()).toRetornoDTO(any());
    }

    @Test
    @DisplayName("Deve retornar lista vazia ao listar apiários de produtor sem apiários")
    void listar_ProdutorSemApiarios_DeveRetornarListaVazia() {
        // Arrange
        Long produtorId = 1L;
        produtor.setApiarios(new ArrayList<>());
        when(produtorRepository.findById(produtorId)).thenReturn(Optional.of(produtor));

        // Act
        List<ApiarioRetornoDTO> result = apiarioService.listar(produtorId);

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(produtorRepository, times(1)).findById(produtorId);
        verify(apiarioMapper, never()).toRetornoDTO(any());
    }

    @Test
    @DisplayName("Deve atualizar apiário com sucesso quando ele existe e pertence ao produtor")
    void atualizar_ApiarioExistenteEProprio_DeveRetornarApiarioRetornoDTO() {
        // Arrange
        Long produtorId = 1L;
        Long apiarioId = 10L;
        when(apiarioRepository.findById(apiarioId)).thenReturn(Optional.of(apiario));
        when(apiarioRepository.save(any(Apiario.class))).thenReturn(apiario); // Return the updated apiario
        when(apiarioMapper.toRetornoDTO(apiario)).thenReturn(apiarioRetornoDTO);

        // Act
        ApiarioRetornoDTO result = apiarioService.atualizar(produtorId, apiarioId, apiarioAtualizadoDTO);

        // Assert
        assertNotNull(result);
        assertEquals(apiarioAtualizadoDTO.nome(), apiario.getNome());
        assertEquals(apiarioAtualizadoDTO.nRegistro(), apiario.getNRegistro());
        assertEquals(apiarioAtualizadoDTO.dataDeCriacao(), apiario.getDataDeCriacao());
        assertEquals(apiarioAtualizadoDTO.observacoes(), apiario.getObservacoes());
        assertEquals(apiarioAtualizadoDTO.cep(), apiario.getCep());
        // ... continue asserting all updated fields
        verify(apiarioRepository, times(1)).findById(apiarioId);
        verify(apiarioRepository, times(1)).save(apiario);
        verify(apiarioMapper, times(1)).toRetornoDTO(apiario);
    }

    @Test
    @DisplayName("Deve lançar ResourceNotFoundException ao atualizar apiário inexistente")
    void atualizar_ApiarioInexistente_DeveLancarExcecao() {
        // Arrange
        Long produtorId = 1L;
        Long apiarioId = 10L;
        when(apiarioRepository.findById(apiarioId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> apiarioService.atualizar(produtorId, apiarioId, apiarioAtualizadoDTO));
        verify(apiarioRepository, times(1)).findById(apiarioId);
        verify(apiarioRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve lançar ResourceNotFoundException ao atualizar apiário que não pertence ao produtor")
    void atualizar_ApiarioNaoPertenceAoProdutor_DeveLancarExcecao() {
        // Arrange
        Long produtorId = 1L;
        Long apiarioId = 10L;
        apiario.setProdutor(outroProdutor); // Apiário pertence a outro produtor
        when(apiarioRepository.findById(apiarioId)).thenReturn(Optional.of(apiario));

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> apiarioService.atualizar(produtorId, apiarioId, apiarioAtualizadoDTO));
        verify(apiarioRepository, times(1)).findById(apiarioId);
        verify(apiarioRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve deletar apiário com sucesso quando ele existe, pertence ao produtor e não tem colmeias ativas")
    void deletar_ApiarioExistenteProprioSemColmeiasAtivas_DeveDeletar() {
        // Arrange
        Long produtorId = 1L;
        Long apiarioId = 10L;
        apiario.setColmeias(new ArrayList<>()); // No active colmeias
        when(apiarioRepository.findById(apiarioId)).thenReturn(Optional.of(apiario));
        doNothing().when(apiarioRepository).delete(apiario); // Mock void method

        // Act
        apiarioService.deletar(produtorId, apiarioId);

        // Assert
        verify(apiarioRepository, times(1)).findById(apiarioId);
        verify(apiarioRepository, times(1)).delete(apiario);
    }

    @Test
    @DisplayName("Deve lançar ResourceNotFoundException ao deletar apiário inexistente")
    void deletar_ApiarioInexistente_DeveLancarExcecao() {
        // Arrange
        Long produtorId = 1L;
        Long apiarioId = 10L;
        when(apiarioRepository.findById(apiarioId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> apiarioService.deletar(produtorId, apiarioId));
        verify(apiarioRepository, times(1)).findById(apiarioId);
        verify(apiarioRepository, never()).delete(any());
    }

    @Test
    @DisplayName("Deve lançar ResourceNotFoundException ao deletar apiário que não pertence ao produtor")
    void deletar_ApiarioNaoPertenceAoProdutor_DeveLancarExcecao() {
        // Arrange
        Long produtorId = 1L;
        Long apiarioId = 10L;
        apiario.setProdutor(outroProdutor); // Apiário pertence a outro produtor
        when(apiarioRepository.findById(apiarioId)).thenReturn(Optional.of(apiario));

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> apiarioService.deletar(produtorId, apiarioId));
        verify(apiarioRepository, times(1)).findById(apiarioId);
        verify(apiarioRepository, never()).delete(any());
    }

    @Test
    @DisplayName("Deve lançar IllegalStateException ao deletar apiário com colmeias ativas")
    void deletar_ApiarioComColmeiasAtivas_DeveLancarExcecao() {
        // Arrange
        Long produtorId = 1L;
        Long apiarioId = 10L;
        Colmeia colmeiaAtiva = new Colmeia();
        colmeiaAtiva.setAtiva(true);
        apiario.setColmeias(Arrays.asList(colmeiaAtiva)); // One active colmeia
        when(apiarioRepository.findById(apiarioId)).thenReturn(Optional.of(apiario));

        // Act & Assert
        assertThrows(IllegalStateException.class, () -> apiarioService.deletar(produtorId, apiarioId));
        verify(apiarioRepository, times(1)).findById(apiarioId);
        verify(apiarioRepository, never()).delete(any());
    }
}

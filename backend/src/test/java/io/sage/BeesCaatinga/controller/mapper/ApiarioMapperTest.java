package io.sage.BeesCaatinga.controller.mapper;

import io.sage.BeesCaatinga.controller.dto.apiario.ApiarioCriadoDTO;
import io.sage.BeesCaatinga.controller.dto.apiario.ApiarioRetornoDTO;
import io.sage.BeesCaatinga.controller.dto.colmeia.ColmeiaRetornoEmApiarioDTO;
import io.sage.BeesCaatinga.model.Apiario;
import io.sage.BeesCaatinga.model.Colmeia;
import io.sage.BeesCaatinga.model.Produtor;
import io.sage.BeesCaatinga.model.enums.StatusColmeia;
import io.sage.BeesCaatinga.repository.ProdutorRepository;
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
import java.util.ArrayList;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ApiarioMapperTest {

    @InjectMocks
    private ApiarioMapperImpl apiarioMapper; 

    @Mock
    private ProdutorRepository produtorRepository;

    @Mock
    private ColmeiaMapper colmeiaMapper; 

    private Produtor produtor;
    private Apiario apiario;
    private ApiarioCriadoDTO apiarioCriadoDTO;
    private Colmeia colmeia;
    private ColmeiaRetornoEmApiarioDTO colmeiaRetornoEmApiarioDTO;

    @BeforeEach
    void setUp() {
        produtor = new Produtor();
        produtor.setId(1L);
        produtor.setNomeCompleto("Produtor Teste");

        colmeia = new Colmeia();
        colmeia.setId(100L);
        colmeia.setIdentificador("Colmeia Teste");
        colmeia.setSituacao(StatusColmeia.SAUDAVEL); // Corrected enum value

        apiario = new Apiario();
        apiario.setId(10L);
        apiario.setNome("Apiario Alfa");
        apiario.setNRegistro("Reg123");
        apiario.setDataDeCriacao(LocalDate.of(2023, 1, 1));
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
                LocalDate.of(2023, 1, 1),// dataDeCriacao
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
        
        colmeiaRetornoEmApiarioDTO = new ColmeiaRetornoEmApiarioDTO(
                "Colmeia Teste",
                StatusColmeia.SAUDAVEL // Corrected enum value
        );
    }

    @Test
    @DisplayName("Deve mapear ApiarioCriadoDTO para Apiario com produtor existente")
    void toEntityFromCriado_ComProdutorExistente_DeveMapearCorretamente() {
        // Arrange
        when(produtorRepository.findById(produtor.getId())).thenReturn(Optional.of(produtor));

        // Act
        Apiario result = apiarioMapper.toEntityFromCriado(apiarioCriadoDTO, produtorRepository);

        // Assert
        assertNotNull(result);
        assertNull(result.getId());
        assertEquals(apiarioCriadoDTO.nome(), result.getNome());
        assertEquals(apiarioCriadoDTO.nRegistro(), result.getNRegistro());
        assertEquals(produtor, result.getProdutor());
        assertTrue(result.getColmeias().isEmpty());
        verify(produtorRepository, times(1)).findById(produtor.getId());
    }

    @Test
    @DisplayName("Deve lançar EntityNotFoundException ao mapear ApiarioCriadoDTO com produtor inexistente")
    void toEntityFromCriado_ComProdutorInexistente_DeveLancarExcecao() {
        // Arrange
        when(produtorRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(EntityNotFoundException.class, () -> apiarioMapper.toEntityFromCriado(apiarioCriadoDTO, produtorRepository));
        verify(produtorRepository, times(1)).findById(apiarioCriadoDTO.produtor_id());
    }

    @Test
    @DisplayName("Deve mapear Apiario para ApiarioRetornoDTO corretamente")
    void toRetornoDTO_DeveMapearCorretamente() {
        // Arrange
        apiario.getColmeias().add(colmeia);
        when(colmeiaMapper.toRetornoEmApiarioDTO(colmeia)).thenReturn(colmeiaRetornoEmApiarioDTO);

        // Act
        ApiarioRetornoDTO result = apiarioMapper.toRetornoDTO(apiario);

        // Assert
        assertNotNull(result);
        assertEquals(apiario.getNome(), result.nome());
        assertFalse(result.colmeias().isEmpty());
        assertEquals(1, result.colmeias().size());
        assertEquals(colmeiaRetornoEmApiarioDTO.identificador(), result.colmeias().get(0).identificador());
        verify(colmeiaMapper, times(1)).toRetornoEmApiarioDTO(colmeia);
    }
}

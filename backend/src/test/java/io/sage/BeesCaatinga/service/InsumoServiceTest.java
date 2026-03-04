package io.sage.BeesCaatinga.service;

import io.sage.BeesCaatinga.controller.dto.insumo.InsumoAtualizadoDTO;
import io.sage.BeesCaatinga.controller.dto.insumo.InsumoCriadoDTO;
import io.sage.BeesCaatinga.controller.dto.insumo.InsumoRetornoDTO;
import io.sage.BeesCaatinga.controller.exception.ResourceNotFoundException;
import io.sage.BeesCaatinga.controller.mapper.InsumoMapper;
import io.sage.BeesCaatinga.model.Insumo;
import io.sage.BeesCaatinga.model.Produtor;
import io.sage.BeesCaatinga.model.enums.StatusInsumo;
import io.sage.BeesCaatinga.model.enums.UnidadeMedida;
import io.sage.BeesCaatinga.repository.InsumoRepository;
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
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InsumoServiceTest {

    @Mock
    private ProdutorRepository produtorRepository;
    @Mock
    private InsumoRepository insumoRepository;
    @Mock
    private InsumoMapper insumoMapper;

    @InjectMocks
    private InsumoService insumoService;

    private Produtor produtor;
    private Insumo insumo;
    private InsumoCriadoDTO insumoCriadoDTO;
    private InsumoRetornoDTO insumoRetornoDTO;
    private InsumoAtualizadoDTO insumoAtualizadoDTO;

    @BeforeEach
    void setUp() {
        produtor = new Produtor();
        produtor.setId(1L);

        insumoCriadoDTO = new InsumoCriadoDTO(
                LocalDate.now(), "Cera de Abelha", "Material", 10.0,
                UnidadeMedida.UNIDADE, null, null
        );

        insumo = new Insumo();
        insumo.setId(1L);
        insumo.setNome("Cera de Abelha");
        insumo.setProdutor(produtor);
        insumo.setStatusInsumo(StatusInsumo.DISPONIVEL);
        insumo.setUnidadeMedida(UnidadeMedida.UNIDADE);

        insumoRetornoDTO = new InsumoRetornoDTO(
                LocalDate.now(), "Cera de Abelha", "Material", 10.0,
                UnidadeMedida.UNIDADE, StatusInsumo.DISPONIVEL, "Não informado"
        );

        insumoAtualizadoDTO = new InsumoAtualizadoDTO(
                LocalDate.now().plusDays(1), "Cera de Abelha Nova", "Material Novo", 20.0,
                UnidadeMedida.LITRO, StatusInsumo.EM_USO, LocalDate.now().plusYears(1), "Obs Att"
        );
    }

    @Test
    @DisplayName("Deve salvar um insumo com sucesso")
    void salvar_ComDadosValidos_DeveRetornarInsumoRetornoDTO() {
        // Arrange
        when(produtorRepository.findById(produtor.getId())).thenReturn(Optional.of(produtor));
        when(insumoMapper.toEntityFromCriado(insumoCriadoDTO)).thenReturn(insumo);
        when(insumoRepository.save(any(Insumo.class))).thenReturn(insumo);
        when(insumoMapper.toRetornoDTO(insumo)).thenReturn(insumoRetornoDTO);

        // Act
        InsumoRetornoDTO result = insumoService.salvar(produtor.getId(), insumoCriadoDTO);

        // Assert
        assertNotNull(result);
        assertEquals(insumoRetornoDTO.nome(), result.nome());
        assertEquals("Não informado", insumo.getObservacoes());
        verify(insumoRepository).save(insumo);
    }

    @Test
    @DisplayName("Deve lançar exceção ao salvar insumo com produtor inexistente")
    void salvar_ProdutorInexistente_DeveLancarExcecao() {
        // Arrange
        when(produtorRepository.findById(produtor.getId())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> insumoService.salvar(produtor.getId(), insumoCriadoDTO));
    }

    @Test
    @DisplayName("Deve listar insumos com sucesso")
    void listar_ComProdutorExistente_DeveRetornarListaDeInsumos() {
        // Arrange
        when(produtorRepository.existsById(produtor.getId())).thenReturn(true);
        when(insumoRepository.findByProdutorId(produtor.getId())).thenReturn(Collections.singletonList(insumo));
        when(insumoMapper.toRetornoDTO(insumo)).thenReturn(insumoRetornoDTO);

        // Act
        List<InsumoRetornoDTO> result = insumoService.listar(produtor.getId());

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(insumoRetornoDTO, result.get(0));
    }

    @Test
    @DisplayName("Deve lançar exceção ao listar insumos de produtor inexistente")
    void listar_ProdutorInexistente_DeveLancarExcecao() {
        // Arrange
        when(produtorRepository.existsById(produtor.getId())).thenReturn(false);

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> insumoService.listar(produtor.getId()));
    }

    @Test
    @DisplayName("Deve atualizar insumo com sucesso")
    void atualizar_ComDadosValidos_DeveRetornarInsumoAtualizado() {
        // Arrange
        when(insumoRepository.findById(insumo.getId())).thenReturn(Optional.of(insumo));
        when(insumoRepository.save(any(Insumo.class))).thenReturn(insumo);
        when(insumoMapper.toRetornoDTO(insumo)).thenReturn(insumoRetornoDTO);

        // Act
        InsumoRetornoDTO result = insumoService.atualizar(produtor.getId(), insumo.getId(), insumoAtualizadoDTO);

        // Assert
        assertNotNull(result);
        verify(insumoRepository).save(insumo);
        assertEquals("Cera de Abelha Nova", insumo.getNome());
        assertEquals(20.0, insumo.getQuantidade());
    }

    @Test
    @DisplayName("Deve deletar insumo com sucesso")
    void deletar_ComDadosValidos_DeveDeletarInsumo() {
        // Arrange
        when(insumoRepository.findById(insumo.getId())).thenReturn(Optional.of(insumo));
        doNothing().when(insumoRepository).delete(insumo);

        // Act
        insumoService.deletar(produtor.getId(), insumo.getId());

        // Assert
        verify(insumoRepository, times(1)).delete(insumo);
    }
}
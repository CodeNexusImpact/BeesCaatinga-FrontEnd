package io.sage.BeesCaatinga.controller.mapper;

import io.sage.BeesCaatinga.controller.dto.insumo.InsumoCriadoDTO;
import io.sage.BeesCaatinga.controller.dto.insumo.InsumoRetornoDTO;
import io.sage.BeesCaatinga.model.Insumo;
import io.sage.BeesCaatinga.model.enums.StatusInsumo;
import io.sage.BeesCaatinga.model.enums.UnidadeMedida;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class InsumoMapperTest {

    @InjectMocks
    private InsumoMapperImpl insumoMapper;

    private Insumo insumo;
    private InsumoCriadoDTO insumoCriadoDTO;

    @BeforeEach
    void setUp() {
        insumoCriadoDTO = new InsumoCriadoDTO(
                LocalDate.now(), "Cera de Abelha", "Material", 10.0,
                UnidadeMedida.UNIDADE, null, "Observacao"
        );

        insumo = new Insumo();
        insumo.setId(1L);
        insumo.setNome("Cera de Abelha");
        insumo.setStatusInsumo(StatusInsumo.DISPONIVEL);
        insumo.setUnidadeMedida(UnidadeMedida.UNIDADE);
        insumo.setObservacoes("Observacao");
    }

    @Test
    @DisplayName("Deve mapear InsumoCriadoDTO para Insumo")
    void toEntityFromCriado_DeveMapearCorretamente() {
        // Act
        Insumo result = insumoMapper.toEntityFromCriado(insumoCriadoDTO);

        // Assert
        assertNotNull(result);
        assertNull(result.getId());
        assertEquals(insumoCriadoDTO.nome(), result.getNome());
        assertEquals(StatusInsumo.DISPONIVEL, result.getStatusInsumo());
    }

    @Test
    @DisplayName("Deve mapear Insumo para InsumoRetornoDTO")
    void toRetornoDTO_DeveMapearCorretamente() {
        // Act
        InsumoRetornoDTO result = insumoMapper.toRetornoDTO(insumo);

        // Assert
        assertNotNull(result);
        assertEquals(insumo.getNome(), result.nome());
        assertEquals(insumo.getStatusInsumo(), result.statusInsumo());
    }

    @Test
    @DisplayName("Deve mapear observacoes nulas para 'Não informado'")
    void mapObservacoes_ComObservacoesNulas_DeveRetornarNaoInformado() {
        // Act
        String result = insumoMapper.mapObservacoes(null);

        // Assert
        assertEquals("Não informado", result);
    }
}

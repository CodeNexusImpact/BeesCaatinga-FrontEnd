package io.sage.BeesCaatinga.repository;

import io.sage.BeesCaatinga.model.Insumo;
import io.sage.BeesCaatinga.model.Produtor;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class InsumoRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private InsumoRepository insumoRepository;

    private Produtor produtor1;
    private Produtor produtor2;
    private Insumo insumo1;
    private Insumo insumo2;
    private Insumo insumo3;

    @BeforeEach
    void setUp() {
        produtor1 = new Produtor();
        produtor1.setNomeCompleto("Produtor 1");
        produtor1.setEmail("p1@email.com");
        produtor1.setSenha("123");
        entityManager.persist(produtor1);

        produtor2 = new Produtor();
        produtor2.setNomeCompleto("Produtor 2");
        produtor2.setEmail("p2@email.com");
        produtor2.setSenha("456");
        entityManager.persist(produtor2);

        insumo1 = new Insumo();
        insumo1.setNome("Cera");
        insumo1.setProdutor(produtor1);
        insumo1.setDataEntrada(LocalDate.of(2023, 1, 15));
        insumo1.setTipo("Material");
        entityManager.persist(insumo1);

        insumo2 = new Insumo();
        insumo2.setNome("Alimentador");
        insumo2.setProdutor(produtor1);
        insumo2.setDataEntrada(LocalDate.of(2023, 2, 20));
        insumo2.setTipo("Equipamento");
        entityManager.persist(insumo2);

        insumo3 = new Insumo();
        insumo3.setNome("Remédio");
        insumo3.setProdutor(produtor2);
        insumo3.setDataEntrada(LocalDate.of(2023, 3, 25));
        insumo3.setTipo("Medicamento");
        entityManager.persist(insumo3);

        entityManager.flush();
    }

    @Test
    @DisplayName("Deve encontrar todos os insumos de um produtor específico")
    void findByProdutorId_DeveRetornarInsumosDoProdutor() {
        // Act
        List<Insumo> resultado = insumoRepository.findByProdutorId(produtor1.getId());

        // Assert
        assertNotNull(resultado);
        assertEquals(2, resultado.size());
        assertTrue(resultado.stream().allMatch(i -> i.getProdutor().getId().equals(produtor1.getId())));
    }

    @Test
    @DisplayName("Deve retornar uma lista vazia se o produtor não tiver insumos")
    void findByProdutorId_ProdutorSemInsumos_DeveRetornarListaVazia() {
        // Arrange
        Produtor produtor3 = new Produtor();
        produtor3.setNomeCompleto("Produtor 3");
        produtor3.setEmail("p3@email.com");
        produtor3.setSenha("789");
        entityManager.persistAndFlush(produtor3);

        // Act
        List<Insumo> resultado = insumoRepository.findByProdutorId(produtor3.getId());

        // Assert
        assertTrue(resultado.isEmpty());
    }

    @Test
    @DisplayName("Deve buscar insumos por período de data")
    void buscarPorPeriodo_ComPeriodoValido_DeveRetornarInsumosCorretos() {
        // Arrange
        LocalDate inicio = LocalDate.of(2023, 1, 1);
        LocalDate fim = LocalDate.of(2023, 1, 31);

        // Act
        List<Insumo> resultado = insumoRepository.buscarPorPeriodo(produtor1.getId(), inicio, fim);

        // Assert
        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals(insumo1.getId(), resultado.get(0).getId());
    }

    @Test
    @DisplayName("Deve contar insumos agrupados por tipo para um produtor")
    void contarPorTipo_ComInsumosExistentes_DeveRetornarContagemAgrupada() {
        // Act
        List<Object[]> resultado = insumoRepository.contarPorTipo(produtor1.getId());

        // Assert
        assertNotNull(resultado);
        assertEquals(2, resultado.size()); // "Material" e "Equipamento"

        for (Object[] row : resultado) {
            String tipo = (String) row[0];
            Long count = (Long) row[1];

            if (tipo.equals("Material")) {
                assertEquals(1L, count);
            } else if (tipo.equals("Equipamento")) {
                assertEquals(1L, count);
            }
        }
    }
}

package io.sage.BeesCaatinga.repository;

import io.sage.BeesCaatinga.model.Produtor;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class ProdutorRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private ProdutorRepository produtorRepository;

    private Produtor produtor;

    @BeforeEach
    void setUp() {
        produtor = new Produtor();
        produtor.setNomeCompleto("Produtor de Teste");
        produtor.setEmail("teste@email.com");
        produtor.setSenha("senha123");
    }

    @Test
    @DisplayName("Deve encontrar um produtor pelo ID após persistir")
    void findById_AposPersistir_DeveRetornarProdutor() {
        // Arrange
        Produtor produtorPersistido = entityManager.persistAndFlush(produtor);

        // Act
        Optional<Produtor> resultado = produtorRepository.findById(produtorPersistido.getId());

        // Assert
        assertTrue(resultado.isPresent());
        assertEquals(produtorPersistido.getId(), resultado.get().getId());
        assertEquals("Produtor de Teste", resultado.get().getNomeCompleto());
    }

    @Test
    @DisplayName("Deve retornar vazio ao buscar por um ID que não existe")
    void findById_IdInexistente_DeveRetornarVazio() {
        // Act
        Optional<Produtor> resultado = produtorRepository.findById(999L); // ID inexistente

        // Assert
        assertFalse(resultado.isPresent());
    }
}

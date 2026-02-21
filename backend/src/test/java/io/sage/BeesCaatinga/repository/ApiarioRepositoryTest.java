package io.sage.BeesCaatinga.repository;

import io.sage.BeesCaatinga.model.Apiario;
import io.sage.BeesCaatinga.model.Produtor;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class ApiarioRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private ApiarioRepository apiarioRepository;

    private Produtor produtor;

    @BeforeEach
    void setUp() {
        Produtor produtorParaPersistir = new Produtor();
        produtorParaPersistir.setNomeCompleto("Produtor Pai");
        produtorParaPersistir.setEmail("produtor.pai@email.com");
        produtorParaPersistir.setSenha("senha123");
        produtor = entityManager.persist(produtorParaPersistir);
    }

    @Test
    @DisplayName("Deve encontrar um apiário pelo nome após persistir")
    void findByNome_AposPersistir_DeveRetornarApiario() {
        // Arrange
        Apiario apiario = new Apiario();
        apiario.setNome("Apiario Teste");
        apiario.setProdutor(produtor);
        apiario.setLatitude(new BigDecimal("-7.221990"));
        apiario.setLongitude(new BigDecimal("-39.314810"));
        entityManager.persistAndFlush(apiario);

        // Act
        Optional<Apiario> resultado = apiarioRepository.findByNome("Apiario Teste");

        // Assert
        assertTrue(resultado.isPresent());
        assertEquals("Apiario Teste", resultado.get().getNome());
        assertEquals(produtor.getId(), resultado.get().getProdutor().getId());
    }

    @Test
    @DisplayName("Deve retornar vazio ao buscar por um nome de apiário que não existe")
    void findByNome_NomeInexistente_DeveRetornarVazio() {
        // Act
        Optional<Apiario> resultado = apiarioRepository.findByNome("Nome Inexistente");

        // Assert
        assertFalse(resultado.isPresent());
    }

    @Test
    @DisplayName("Deve salvar e encontrar um apiário pelo ID")
    void saveAndFindById_DeveRetornarApiarioCorreto() {
        // Arrange
        Apiario apiario = new Apiario();
        apiario.setNome("Apiario Para FindById");
        apiario.setProdutor(produtor);
        apiario.setLatitude(new BigDecimal("-7.221990"));
        apiario.setLongitude(new BigDecimal("-39.314810"));
        Apiario apiarioSalvo = entityManager.persistAndFlush(apiario);

        // Act
        Optional<Apiario> resultado = apiarioRepository.findById(apiarioSalvo.getId());

        // Assert
        assertTrue(resultado.isPresent());
        assertEquals(apiarioSalvo.getId(), resultado.get().getId());
    }
}

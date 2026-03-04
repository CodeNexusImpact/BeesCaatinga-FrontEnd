package io.sage.BeesCaatinga.repository;

import io.sage.BeesCaatinga.model.Apiario;
import io.sage.BeesCaatinga.model.Colmeia;
import io.sage.BeesCaatinga.model.Produtor;
import io.sage.BeesCaatinga.model.enums.StatusColmeia;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class ColmeiaRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private ColmeiaRepository colmeiaRepository;

    private Apiario apiario1;
    private Apiario apiario2;
    private Colmeia colmeia1;
    private Colmeia colmeia2;
    private Colmeia colmeia3;

    @BeforeEach
    void setUp() {
        Produtor produtor = new Produtor();
        produtor.setNomeCompleto("Produtor");
        produtor.setEmail("produtor@email.com");
        produtor.setSenha("senha");
        entityManager.persist(produtor);

        apiario1 = new Apiario();
        apiario1.setNome("Apiario 1");
        apiario1.setProdutor(produtor);
        entityManager.persist(apiario1);

        apiario2 = new Apiario();
        apiario2.setNome("Apiario 2");
        apiario2.setProdutor(produtor);
        entityManager.persist(apiario2);

        colmeia1 = new Colmeia();
        colmeia1.setIdentificador("C1");
        colmeia1.setApiario(apiario1);
        colmeia1.setSituacao(StatusColmeia.SAUDAVEL);
        entityManager.persist(colmeia1);

        colmeia2 = new Colmeia();
        colmeia2.setIdentificador("C2");
        colmeia2.setApiario(apiario1);
        colmeia2.setSituacao(StatusColmeia.SAUDAVEL);
        entityManager.persist(colmeia2);

        colmeia3 = new Colmeia();
        colmeia3.setIdentificador("C3");
        colmeia3.setApiario(apiario1);
        colmeia3.setSituacao(StatusColmeia.TRATAMENTO_NECESSARIO);
        entityManager.persist(colmeia3);

        Colmeia colmeiaApiario2 = new Colmeia();
        colmeiaApiario2.setIdentificador("C4");
        colmeiaApiario2.setApiario(apiario2);
        colmeiaApiario2.setSituacao(StatusColmeia.SAUDAVEL);
        entityManager.persist(colmeiaApiario2);

        entityManager.flush();
    }

    @Test
    @DisplayName("Deve retornar a contagem de status de colmeias para um apiário específico")
    void obterStatusColmeias_ComApiarioId_DeveRetornarStatusAgrupados() {
        // Act
        List<Object[]> resultado = colmeiaRepository.obterStatusColmeias(apiario1.getId(), null);

        // Assert
        assertNotNull(resultado);
        assertEquals(2, resultado.size()); // SAUDAVEL e TRATAMENTO_NECESSARIO

        for (Object[] row : resultado) {
            StatusColmeia status = (StatusColmeia) row[0];
            Long count = (Long) row[1];
            if (status == StatusColmeia.SAUDAVEL) {
                assertEquals(2L, count);
            } else if (status == StatusColmeia.TRATAMENTO_NECESSARIO) {
                assertEquals(1L, count);
            }
        }
    }

    @Test
    @DisplayName("Deve retornar a contagem de status para uma colmeia específica")
    void obterStatusColmeias_ComColmeiaId_DeveRetornarStatusUnico() {
        // Act
        List<Object[]> resultado = colmeiaRepository.obterStatusColmeias(apiario1.getId(), colmeia1.getId());

        // Assert
        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals(StatusColmeia.SAUDAVEL, resultado.get(0)[0]);
        assertEquals(1L, resultado.get(0)[1]);
    }

    @Test
    @DisplayName("Deve contar colmeias por situação e apiário")
    void countBySituacaoFiltrando_ComSituacaoEApiario_DeveRetornarContagemCorreta() {
        // Act
        Long count = colmeiaRepository.countBySituacaoFiltrando(StatusColmeia.SAUDAVEL, apiario1.getId(), null);

        // Assert
        assertEquals(2L, count);
    }

    @Test
    @DisplayName("Deve contar colmeias por situação, apiário e id da colmeia")
    void countBySituacaoFiltrando_ComTodosOsFiltros_DeveRetornarContagemCorreta() {
        // Act
        Long count = colmeiaRepository.countBySituacaoFiltrando(StatusColmeia.SAUDAVEL, apiario1.getId(), colmeia1.getId());

        // Assert
        assertEquals(1L, count);
    }

    @Test
    @DisplayName("Deve retornar zero se a situação não corresponder ao filtro de colmeia")
    void countBySituacaoFiltrando_SituacaoNaoCorresponde_DeveRetornarZero() {
        // Act
        Long count = colmeiaRepository.countBySituacaoFiltrando(StatusColmeia.TRATAMENTO_NECESSARIO, apiario1.getId(), colmeia1.getId());

        // Assert
        assertEquals(0L, count);
    }
}

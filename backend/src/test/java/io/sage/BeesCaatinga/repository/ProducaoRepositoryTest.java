package io.sage.BeesCaatinga.repository;

import io.sage.BeesCaatinga.model.Apiario;
import io.sage.BeesCaatinga.model.Colmeia;
import io.sage.BeesCaatinga.model.Producao;
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
class ProducaoRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private ProducaoRepository producaoRepository;

    private Produtor produtor;
    private Apiario apiario;
    private Colmeia colmeia;

    @BeforeEach
    void setUp() {
        produtor = new Produtor();
        produtor.setNomeCompleto("Produtor de Producao");
        produtor.setEmail("producao@email.com");
        produtor.setSenha("123");
        entityManager.persist(produtor);

        apiario = new Apiario();
        apiario.setNome("Apiario de Producao");
        apiario.setProdutor(produtor);
        entityManager.persist(apiario);

        colmeia = new Colmeia();
        colmeia.setApiario(apiario);
        colmeia.setIdentificador("PC-01");
        entityManager.persist(colmeia);

        Producao producao1 = new Producao();
        producao1.setApiario(apiario);
        producao1.setColmeia(colmeia);
        producao1.setDataColeta(LocalDate.of(2023, 1, 10));
        producao1.setQuantidade(25.5);
        entityManager.persist(producao1);

        Producao producao2 = new Producao();
        producao2.setApiario(apiario);
        producao2.setColmeia(colmeia);
        producao2.setDataColeta(LocalDate.of(2023, 1, 25));
        producao2.setQuantidade(30.0);
        entityManager.persist(producao2);

        Producao producao3 = new Producao();
        producao3.setApiario(apiario);
        producao3.setColmeia(colmeia);
        producao3.setDataColeta(LocalDate.of(2023, 2, 15));
        producao3.setQuantidade(40.0);
        entityManager.persist(producao3);

        entityManager.flush();
    }

    @Test
    @DisplayName("Deve encontrar todas as produções de um produtor")
    void findByApiarioProdutorId_DeveRetornarProducoesCorretas() {
        // Act
        List<Producao> resultado = producaoRepository.findByApiarioProdutorId(produtor.getId());

        // Assert
        assertEquals(3, resultado.size());
    }

    @Test
    @DisplayName("Deve obter a produção total em um período")
    void obterProducaoTotal_ComPeriodoValido_DeveRetornarSomaCorreta() {
        // Arrange
        LocalDate inicio = LocalDate.of(2023, 1, 1);
        LocalDate fim = LocalDate.of(2023, 1, 31);

        // Act
        Double total = producaoRepository.obterProducaoTotal(inicio, fim, apiario.getId(), colmeia.getId());

        // Assert
        assertEquals(55.5, total);
    }

    @Test
    @DisplayName("Deve obter a produção mensal agrupada")
    void obterProducaoMensal_ComPeriodoValido_DeveRetornarGruposCorretos() {
        // Arrange
        LocalDate inicio = LocalDate.of(2023, 1, 1);
        LocalDate fim = LocalDate.of(2023, 2, 28);

        // Act
        List<Object[]> resultado = producaoRepository.obterProducaoMensal(inicio, fim, apiario.getId(), null);

        // Assert
        assertEquals(2, resultado.size()); // Janeiro e Fevereiro

        for (Object[] row : resultado) {
            Integer mes = (Integer) row[0];
            Double soma = (Double) row[1];
            if (mes == 1) {
                assertEquals(55.5, soma);
            } else if (mes == 2) {
                assertEquals(40.0, soma);
            }
        }
    }
}

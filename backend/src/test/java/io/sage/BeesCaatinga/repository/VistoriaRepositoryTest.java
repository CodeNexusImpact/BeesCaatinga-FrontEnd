package io.sage.BeesCaatinga.repository;

import io.sage.BeesCaatinga.controller.dto.relatorios.vistoria.VistoriaTabelaDTO;
import io.sage.BeesCaatinga.model.Apiario;
import io.sage.BeesCaatinga.model.Colmeia;
import io.sage.BeesCaatinga.model.Produtor;
import io.sage.BeesCaatinga.model.Vistoria;
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
class VistoriaRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private VistoriaRepository vistoriaRepository;

    private Produtor produtor;
    private Apiario apiario;
    private Colmeia colmeia;

    @BeforeEach
    void setUp() {
        produtor = new Produtor();
        produtor.setNomeCompleto("Produtor de Vistoria");
        produtor.setEmail("vistoria@email.com");
        produtor.setSenha("123");
        entityManager.persist(produtor);

        apiario = new Apiario();
        apiario.setNome("Apiario de Vistoria");
        apiario.setProdutor(produtor);
        entityManager.persist(apiario);

        colmeia = new Colmeia();
        colmeia.setApiario(apiario);
        colmeia.setIdentificador("V-01");
        entityManager.persist(colmeia);

        Vistoria vistoria1 = new Vistoria();
        vistoria1.setApiario(apiario);
        vistoria1.setColmeia(colmeia);
        vistoria1.setDataVistoria(LocalDate.of(2023, 1, 5));
        entityManager.persist(vistoria1);

        Vistoria vistoria2 = new Vistoria();
        vistoria2.setApiario(apiario);
        vistoria2.setColmeia(colmeia);
        vistoria2.setDataVistoria(LocalDate.of(2023, 2, 10));
        entityManager.persist(vistoria2);

        entityManager.flush();
    }

    @Test
    @DisplayName("Deve verificar a existência de vistoria por ID da colmeia")
    void existsByColmeiaId_DeveRetornarTrueSeExistir() {
        // Act
        boolean existe = vistoriaRepository.existsByColmeiaId(colmeia.getId());
        // Assert
        assertTrue(existe);
    }

    @Test
    @DisplayName("Deve encontrar vistorias pelo ID da colmeia")
    void findByColmeiaId_DeveRetornarVistoriasCorretas() {
        // Act
        List<Vistoria> resultado = vistoriaRepository.findByColmeiaId(colmeia.getId());
        // Assert
        assertEquals(2, resultado.size());
    }

    @Test
    @DisplayName("Deve encontrar vistorias pelo ID do produtor")
    void findByApiarioProdutorId_DeveRetornarVistoriasCorretas() {
        // Act
        List<Vistoria> resultado = vistoriaRepository.findByApiarioProdutorId(produtor.getId());
        // Assert
        assertEquals(2, resultado.size());
    }

    @Test
    @DisplayName("Deve contar vistorias em um período")
    void contarVistorias_ComPeriodoValido_DeveRetornarContagemCorreta() {
        // Arrange
        LocalDate inicio = LocalDate.of(2023, 1, 1);
        LocalDate fim = LocalDate.of(2023, 1, 31);
        // Act
        Long count = vistoriaRepository.contarVistorias(inicio, fim, apiario.getId(), colmeia.getId());
        // Assert
        assertEquals(1L, count);
    }

    @Test
    @DisplayName("Deve obter vistorias mensais agrupadas")
    void obterVistoriasMensais_ComPeriodoValido_DeveRetornarGruposCorretos() {
        // Arrange
        LocalDate inicio = LocalDate.of(2023, 1, 1);
        LocalDate fim = LocalDate.of(2023, 2, 28);
        // Act
        List<Object[]> resultado = vistoriaRepository.obterVistoriasMensais(inicio, fim, apiario.getId(), null);
        // Assert
        assertEquals(2, resultado.size()); // Janeiro e Fevereiro
    }

    @Test
    @DisplayName("Deve listar vistorias como VistoriaTabelaDTO")
    void listarVistorias_DeveRetornarListaDeDTOs() {
        // Arrange
        LocalDate inicio = LocalDate.of(2023, 1, 1);
        LocalDate fim = LocalDate.of(2023, 2, 28);
        // Act
        List<VistoriaTabelaDTO> resultado = vistoriaRepository.listarVistorias(inicio, fim, apiario.getId(), null);
        // Assert
        assertEquals(2, resultado.size());
        assertEquals(LocalDate.of(2023, 2, 10), resultado.get(0).getDataVistoria()); // O mais recente por causa do ORDER BY
    }
}

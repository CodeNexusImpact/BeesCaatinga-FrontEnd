package io.sage.BeesCaatinga.repository;

import io.sage.BeesCaatinga.controller.dto.relatorios.rastreabilidade.LoteTabelaDTO;
import io.sage.BeesCaatinga.model.Apiario;
import io.sage.BeesCaatinga.model.Lote;
import io.sage.BeesCaatinga.model.Produtor;
import io.sage.BeesCaatinga.model.enums.TipoAbelha;
import io.sage.BeesCaatinga.model.enums.TipoFlorada;
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
class LoteRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private LoteRepository loteRepository;

    private Produtor produtor;
    private Apiario apiario;
    private Lote lote1;
    private Lote lote2;
    private Lote lote3;

    @BeforeEach
    void setUp() {
        produtor = new Produtor();
        produtor.setNomeCompleto("Produtor de Lotes");
        produtor.setEmail("lotes@email.com");
        produtor.setSenha("123");
        entityManager.persist(produtor);

        apiario = new Apiario();
        apiario.setNome("Apiario de Lotes");
        apiario.setProdutor(produtor);
        apiario.setNomeDaPropriedade("Propriedade de Lotes");
        entityManager.persist(apiario);

        lote1 = new Lote();
        lote1.setApiario(apiario);
        lote1.setDataProducao(LocalDate.of(2023, 1, 10));
        lote1.setQuantidadeProduzida(50.5);
        lote1.setTipoAbelha(TipoAbelha.APIS_MELLIFERA);
        lote1.setTipoFlorada(TipoFlorada.SILVESTRE);
        lote1.setVendido(true);
        entityManager.persist(lote1);

        lote2 = new Lote();
        lote2.setApiario(apiario);
        lote2.setDataProducao(LocalDate.of(2023, 2, 15));
        lote2.setQuantidadeProduzida(100.0);
        lote2.setTipoAbelha(TipoAbelha.JANDAIRA);
        lote2.setTipoFlorada(TipoFlorada.SILVESTRE);
        lote2.setVendido(false);
        entityManager.persist(lote2);

        lote3 = new Lote();
        lote3.setApiario(apiario);
        lote3.setDataProducao(LocalDate.of(2023, 3, 20));
        lote3.setQuantidadeProduzida(75.2);
        lote3.setTipoAbelha(TipoAbelha.APIS_MELLIFERA);
        lote3.setTipoFlorada(TipoFlorada.MARMELEIRO);
        lote3.setVendido(true);
        entityManager.persist(lote3);

        entityManager.flush();
    }

    @Test
    @DisplayName("Deve encontrar lotes pelo ID do produtor")
    void findByApiarioProdutorId_DeveRetornarLotesCorretos() {
        // Act
        List<Lote> resultado = loteRepository.findByApiarioProdutorId(produtor.getId());

        // Assert
        assertEquals(3, resultado.size());
    }

    @Test
    @DisplayName("Deve contar todos os lotes dentro de um período")
    void contarLotes_ComFiltroDeData_DeveRetornarContagemCorreta() {
        // Arrange
        LocalDate inicio = LocalDate.of(2023, 1, 1);
        LocalDate fim = LocalDate.of(2023, 2, 28);

        // Act
        Long count = loteRepository.contarLotes(inicio, fim, apiario.getId(), null);

        // Assert
        assertEquals(2L, count);
    }
    
    @Test
    @DisplayName("Deve somar o peso total de lotes em um período")
    void somarPesoTotal_ComFiltroDeData_DeveRetornarSomaCorreta() {
        // Arrange
        LocalDate inicio = LocalDate.of(2023, 1, 1);
        LocalDate fim = LocalDate.of(2023, 2, 28);
        
        // Act
        Double pesoTotal = loteRepository.somarPesoTotal(inicio, fim, apiario.getId(), null);

        // Assert
        assertEquals(150.5, pesoTotal);
    }
    
    @Test
    @DisplayName("Deve contar lotes vendidos em um período")
    void contarVendidos_ComFiltroDeData_DeveRetornarContagemCorreta() {
        // Arrange
        LocalDate inicio = LocalDate.of(2023, 1, 1);
        LocalDate fim = LocalDate.of(2023, 3, 31);
        
        // Act
        Long vendidos = loteRepository.contarVendidos(inicio, fim, apiario.getId(), null);

        // Assert
        assertEquals(2L, vendidos);
    }

    @Test
    @DisplayName("Deve agrupar lotes por tipo de abelha")
    void agruparPorTipoAbelha_DeveRetornarGruposCorretos() {
        // Arrange
        LocalDate inicio = LocalDate.of(2023, 1, 1);
        LocalDate fim = LocalDate.of(2023, 3, 31);
        
        // Act
        List<Object[]> resultado = loteRepository.agruparPorTipoAbelha(inicio, fim, apiario.getId(), null);
        
        // Assert
        assertEquals(2, resultado.size()); // APIS_MELLIFERA e JANDAIRA
        for (Object[] row : resultado) {
            TipoAbelha tipo = (TipoAbelha) row[0];
            Long count = (Long) row[1];
            if (tipo == TipoAbelha.APIS_MELLIFERA) {
                assertEquals(2L, count);
            } else if (tipo == TipoAbelha.JANDAIRA) {
                assertEquals(1L, count);
            }
        }
    }
    
    @Test
    @DisplayName("Deve agrupar lotes por tipo de florada")
    void agruparPorFlorada_DeveRetornarGruposCorretos() {
        // Arrange
        LocalDate inicio = LocalDate.of(2023, 1, 1);
        LocalDate fim = LocalDate.of(2023, 3, 31);
        
        // Act
        List<Object[]> resultado = loteRepository.agruparPorFlorada(inicio, fim, apiario.getId(), null);
        
        // Assert
        assertEquals(2, resultado.size()); // SILVESTRE e MARMELEIRO
        for (Object[] row : resultado) {
            TipoFlorada tipo = (TipoFlorada) row[0];
            Long count = (Long) row[1];
            if (tipo == TipoFlorada.SILVESTRE) {
                assertEquals(2L, count);
            } else if (tipo == TipoFlorada.MARMELEIRO) {
                assertEquals(1L, count);
            }
        }
    }
    
    @Test
    @DisplayName("Deve listar lotes como LoteTabelaDTO")
    void listarLotesTabela_DeveRetornarListaDeDTOs() {
        // Arrange
        LocalDate inicio = LocalDate.of(2023, 1, 1);
        LocalDate fim = LocalDate.of(2023, 3, 31);
        
        // Act
        List<LoteTabelaDTO> resultado = loteRepository.listarLotesTabela(inicio, fim, apiario.getId(), null);
        
        // Assert
        assertEquals(3, resultado.size());
        LoteTabelaDTO dto = resultado.get(0); // O mais recente por causa do ORDER BY
        assertEquals(lote3.getId(), dto.id());
        assertEquals("Propriedade de Lotes", dto.nomeDaPropriedade());
        assertEquals(TipoFlorada.MARMELEIRO, dto.tipoFlorada());
    }
}

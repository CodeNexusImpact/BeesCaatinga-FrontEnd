package io.sage.BeesCaatinga.repository;

import io.sage.BeesCaatinga.model.Producao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ProducaoRepository extends JpaRepository<Producao, Long> {
    @Query("SELECT p FROM Producao p WHERE p.apiario.produtor.id = :produtorId")
    List<Producao> findByApiarioProdutorId(@Param("produtorId") Long produtorId);

    @Query("""
    SELECT MONTH(p.dataColeta) AS mes, SUM(p.quantidade)
    FROM Producao p
    WHERE p.dataColeta BETWEEN :inicio AND :fim
    AND p.apiario.id = :apiarioId
    AND (:colmeiaId IS NULL OR p.colmeia.id = :colmeiaId)
    GROUP BY MONTH(p.dataColeta)
    """)
    List<Object[]> obterProducaoMensal(
            LocalDate inicio,
            LocalDate fim,
            Long apiarioId,
            Long colmeiaId
    );

    @Query("""
    SELECT SUM(p.quantidade)
    FROM Producao p
    WHERE p.dataColeta BETWEEN :inicio AND :fim
    AND p.apiario.id = :apiarioId
    AND (:colmeiaId IS NULL OR p.colmeia.id = :colmeiaId)
    """)
    Double obterProducaoTotal(
            LocalDate inicio,
            LocalDate fim,
            Long apiarioId,
            Long colmeiaId
    );
}

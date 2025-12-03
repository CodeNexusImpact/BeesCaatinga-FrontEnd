package io.sage.BeesCaatinga.repository;

import io.sage.BeesCaatinga.model.Lote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface LoteRepository extends JpaRepository<Lote, Long> {
    @Query("SELECT l FROM Lote l WHERE l.apiario.produtor.id = :produtorId")
    List<Lote> findByApiarioProdutorId(@Param("produtorId") Long produtorId);

    @Query("""
    SELECT l
    FROM Lote l
    WHERE l.dataProducao BETWEEN :inicio AND :fim
    AND l.apiario.id = :apiarioId
    """)
    List<Lote> obterLotes(
            LocalDate inicio,
            LocalDate fim,
            Long apiarioId
    );
}

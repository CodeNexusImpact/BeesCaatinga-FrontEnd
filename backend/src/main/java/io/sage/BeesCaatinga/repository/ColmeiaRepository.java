package io.sage.BeesCaatinga.repository;

import io.sage.BeesCaatinga.model.Colmeia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ColmeiaRepository extends JpaRepository<Colmeia, Long> {
    @Query("""
    SELECT c.situacao, COUNT(c)
    FROM Colmeia c
    WHERE c.apiario.id = :apiarioId
    AND (:colmeiaId IS NULL OR c.id = :colmeiaId)
    GROUP BY c.situacao
    """)
    List<Object[]> obterStatusColmeias(
            Long apiarioId,
            Long colmeiaId
    );
}

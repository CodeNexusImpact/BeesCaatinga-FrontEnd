package io.sage.BeesCaatinga.repository;

import io.sage.BeesCaatinga.model.Colmeia;
import io.sage.BeesCaatinga.model.enums.StatusColmeia;
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

    @Query("""
    SELECT COUNT(c)
    FROM Colmeia c
    WHERE c.situacao = :situacao
    AND (:apiarioId IS NULL OR c.apiario.id = :apiarioId)
    AND (:colmeiaId IS NULL OR c.id = :colmeiaId)
    """)
    Long countBySituacaoFiltrando(StatusColmeia situacao, Long apiarioId, Long colmeiaId);
}

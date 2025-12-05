package io.sage.BeesCaatinga.repository;

import io.sage.BeesCaatinga.model.Insumo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface InsumoRepository extends JpaRepository<Insumo, Long> {
    List<Insumo> findByProdutorId(Long produtorId);

    @Query("""
        SELECT i
        FROM Insumo i
        WHERE i.produtor.id = :produtorId
        AND i.dataEntrada BETWEEN :inicio AND :fim
    """)
    List<Insumo> buscarPorPeriodo(Long produtorId, LocalDate inicio, LocalDate fim);

    @Query("""
        SELECT i.tipo, COUNT(i)
        FROM Insumo i
        WHERE i.produtor.id = :produtorId
        GROUP BY i.tipo
    """)
    List<Object[]> contarPorTipo(Long produtorId);
}

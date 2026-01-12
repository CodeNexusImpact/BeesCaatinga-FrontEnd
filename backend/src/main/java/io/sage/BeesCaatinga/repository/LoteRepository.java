package io.sage.BeesCaatinga.repository;

import io.sage.BeesCaatinga.controller.dto.relatorios.rastreabilidade.LoteTabelaDTO;
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

    @Query("""
    SELECT COUNT(l)
    FROM Lote l
    WHERE (:inicio IS NULL OR l.dataProducao >= :inicio)
      AND (:fim IS NULL OR l.dataProducao <= :fim)
      AND (:apiarioId IS NULL OR l.apiario.id = :apiarioId)
      AND (:colmeiaId IS NULL OR l.id = :colmeiaId)
    """)
    Long contarLotes(LocalDate inicio, LocalDate fim, Long apiarioId, Long colmeiaId);

    @Query("""
    SELECT SUM(l.quantidadeProduzida)
    FROM Lote l
    WHERE (:inicio IS NULL OR l.dataProducao >= :inicio)
      AND (:fim IS NULL OR l.dataProducao <= :fim)
      AND (:apiarioId IS NULL OR l.apiario.id = :apiarioId)
      AND (:colmeiaId IS NULL OR l.id = :colmeiaId)
    """)
    Double somarPesoTotal(LocalDate inicio, LocalDate fim, Long apiarioId, Long colmeiaId);

    @Query("""
    SELECT COUNT(l)
    FROM Lote l
    WHERE (:inicio IS NULL OR l.dataProducao >= :inicio)
      AND (:fim IS NULL OR l.dataProducao <= :fim)
      AND l.vendido = true
      AND (:apiarioId IS NULL OR l.apiario.id = :apiarioId)
      AND (:colmeiaId IS NULL OR l.id = :colmeiaId)
    """)
    Long contarVendidos(LocalDate inicio, LocalDate fim, Long apiarioId, Long colmeiaId);

    @Query("""
    SELECT l.tipoAbelha, COUNT(l)
    FROM Lote l
    WHERE (:inicio IS NULL OR l.dataProducao >= :inicio)
      AND (:fim IS NULL OR l.dataProducao <= :fim)
      AND (:apiarioId IS NULL OR l.apiario.id = :apiarioId)
      AND (:colmeiaId IS NULL OR l.id = :colmeiaId)
    GROUP BY l.tipoAbelha
    """)
    List<Object[]> agruparPorTipoAbelha(LocalDate inicio, LocalDate fim, Long apiarioId, Long colmeiaId);

    @Query("""
    SELECT l.tipoFlorada, COUNT(l)
    FROM Lote l
    WHERE (:inicio IS NULL OR l.dataProducao >= :inicio)
      AND (:fim IS NULL OR l.dataProducao <= :fim)
      AND (:apiarioId IS NULL OR l.apiario.id = :apiarioId)
      AND (:colmeiaId IS NULL OR l.id = :colmeiaId)
    GROUP BY l.tipoFlorada
    """)
    List<Object[]> agruparPorFlorada(LocalDate inicio, LocalDate fim, Long apiarioId, Long colmeiaId);

    @Query("""
    SELECT new io.sage.BeesCaatinga.controller.dto.relatorios.rastreabilidade.LoteTabelaDTO(
        l.id,
        l.dataProducao,
        l.quantidadeProduzida,
        l.tipoFlorada,
        l.apiario.nomeDaPropriedade,
        l.tipoAbelha
    )
    FROM Lote l
    WHERE (:inicio IS NULL OR l.dataProducao >= :inicio)
      AND (:fim IS NULL OR l.dataProducao <= :fim)
      AND (:apiarioId IS NULL OR l.apiario.id = :apiarioId)
      AND (:colmeiaId IS NULL OR l.id = :colmeiaId)
    ORDER BY l.dataProducao DESC
    """)
    List<LoteTabelaDTO> listarLotesTabela(LocalDate inicio, LocalDate fim, Long apiarioId, Long colmeiaId);
}

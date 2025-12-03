package io.sage.BeesCaatinga.repository;

import io.sage.BeesCaatinga.controller.dto.relatorios.vistoria.VistoriaTabelaDTO;
import io.sage.BeesCaatinga.model.Vistoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface VistoriaRepository  extends JpaRepository<Vistoria, Long>{
    boolean existsByColmeiaId(Long colmeiaId);
    List<Vistoria> findByColmeiaId(Long colmeiaId);
    @Query("SELECT v FROM Vistoria v WHERE v.apiario.produtor.id = :produtorId")
    List<Vistoria> findByApiarioProdutorId(@Param("produtorId") Long produtorId);

    @Query("""
    SELECT COUNT(v)
    FROM Vistoria v
    WHERE v.dataVistoria BETWEEN :inicio AND :fim
    AND v.apiario.id = :apiarioId
    AND (:colmeiaId IS NULL OR v.colmeia.id = :colmeiaId)
    """)
    Long contarVistorias(
            LocalDate inicio,
            LocalDate fim,
            Long apiarioId,
            Long colmeiaId
    );

    @Query("""
    SELECT MONTH(v.dataVistoria), COUNT(v)
    FROM Vistoria v
    WHERE v.dataVistoria BETWEEN :inicio AND :fim
    AND v.apiario.id = :apiarioId
    AND (:colmeiaId IS NULL OR v.colmeia.id = :colmeiaId)
    GROUP BY MONTH(v.dataVistoria)
    """)
    List<Object[]> obterVistoriasMensais(
            LocalDate inicio,
            LocalDate fim,
            Long apiarioId,
            Long colmeiaId
    );

    @Query("""
    SELECT new io.sage.BeesCaatinga.controller.dto.relatorios.vistoria.VistoriaTabelaDTO(
        v.dataVistoria,
        v.pragaDoenca,
        v.perdaProducao,
        v.observacoes,
        v.colmeia.situacao
    )
    FROM Vistoria v
    WHERE v.dataVistoria BETWEEN :inicio AND :fim
    AND v.apiario.id = :apiarioId
    AND (:colmeiaId IS NULL OR v.colmeia.id = :colmeiaId)
    ORDER BY v.dataVistoria DESC
    """)
    List<VistoriaTabelaDTO> listarVistorias(
            LocalDate inicio,
            LocalDate fim,
            Long apiarioId,
            Long colmeiaId
    );
}

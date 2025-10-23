package io.sage.BeesCaatinga.repository;

import io.sage.BeesCaatinga.model.Producao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProducaoRepository extends JpaRepository<Producao, Long> {
    @Query("SELECT p FROM Producao p WHERE p.apiario.produtor.id = :produtorId")
    List<Producao> findByApiarioProdutorId(@Param("produtorId") Long produtorId);
}

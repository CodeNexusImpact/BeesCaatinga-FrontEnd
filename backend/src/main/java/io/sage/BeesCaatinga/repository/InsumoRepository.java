package io.sage.BeesCaatinga.repository;

import io.sage.BeesCaatinga.model.Insumo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InsumoRepository extends JpaRepository<Insumo, Long> {
    List<Insumo> findByProdutorId(Long produtorId);
}

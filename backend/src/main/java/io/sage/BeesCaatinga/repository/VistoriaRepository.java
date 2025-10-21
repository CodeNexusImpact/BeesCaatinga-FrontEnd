package io.sage.BeesCaatinga.repository;

import io.sage.BeesCaatinga.model.Vistoria;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VistoriaRepository  extends JpaRepository<Vistoria, Long>{
    boolean existsByColmeiaId(Long colmeiaId);
    List<Vistoria> findByColmeiaId(Long colmeiaId);
}

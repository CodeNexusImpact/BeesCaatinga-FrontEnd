package io.sage.BeesCaatinga.repository;

import io.sage.BeesCaatinga.model.Apiario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ApiarioRepository extends JpaRepository<Apiario, Long> {
    Optional<Apiario> findByNome(String nome);
}

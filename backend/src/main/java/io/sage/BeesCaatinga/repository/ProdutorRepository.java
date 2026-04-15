package io.sage.BeesCaatinga.repository;

import io.sage.BeesCaatinga.model.Produtor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProdutorRepository extends JpaRepository<Produtor, Long> {
    Optional<Produtor> findByEmail(String email);
    Optional<Produtor> findByEmailAndSenha(String email, String senha);
}

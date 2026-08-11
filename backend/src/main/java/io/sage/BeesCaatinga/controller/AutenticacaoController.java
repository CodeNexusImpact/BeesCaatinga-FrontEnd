package io.sage.BeesCaatinga.controller;

import io.sage.BeesCaatinga.controller.dto.auth.LoginDTO;
import io.sage.BeesCaatinga.controller.dto.produtor.ProdutorRetornoDTO;
import io.sage.BeesCaatinga.controller.exception.ResourceNotFoundException;
import io.sage.BeesCaatinga.controller.mapper.ProdutorMapper;
import io.sage.BeesCaatinga.repository.ProdutorRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/login")
@RequiredArgsConstructor
public class AutenticacaoController {

    private final ProdutorRepository repository;
    private final ProdutorMapper mapper;

    @PostMapping
    public ResponseEntity<?> login(@RequestBody @Valid LoginDTO dto) {
        try {
            var produtor = repository.findFirstByEmailAndSenha(dto.email(), dto.senha())
                    .orElseThrow(() -> new ResourceNotFoundException("E-mail ou senha inválidos!"));

            return ResponseEntity.ok(mapper.toRetornoDTO(produtor));
        } catch (Exception e) {
            System.err.println("❌ Erro crítico no Login: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(401).body("Erro interno ao processar login. Verifique suas credenciais.");
        }
    }
}

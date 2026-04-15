package io.sage.BeesCaatinga.controller;

import io.sage.BeesCaatinga.controller.dto.auth.LoginDTO;
import io.sage.BeesCaatinga.controller.dto.produtor.ProdutorRetornoDTO;
import io.sage.BeesCaatinga.controller.exception.ResourceNotFoundException;
import io.sage.BeesCaatinga.controller.mapper.ProdutorMapper;
import io.sage.BeesCaatinga.model.Produtor;
import io.sage.BeesCaatinga.model.enums.Genero;
import io.sage.BeesCaatinga.repository.ProdutorRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AutenticacaoControllerTest {

    @Mock
    private ProdutorRepository repository;

    @Mock
    private ProdutorMapper mapper;

    @InjectMocks
    private AutenticacaoController controller;

    private LoginDTO loginDTO;
    private Produtor produtor;
    private ProdutorRetornoDTO produtorRetornoDTO;

    @BeforeEach
    void setUp() {
        loginDTO = new LoginDTO("teste@email.com", "senha123");
        
        produtor = new Produtor();
        produtor.setId(1L);
        produtor.setEmail("teste@email.com");
        produtor.setSenha("senha123");

        produtorRetornoDTO = new ProdutorRetornoDTO(
                1L,
                "foto.jpg",
                "Produtor Teste",
                Genero.MASCULINO,
                "teste@email.com",
                "Empresa Teste",
                "1234567890",
                "Endereco Teste"
        );
    }

    @Test
    @DisplayName("Deve realizar login com sucesso")
    void login_ComDadosValidos_DeveRetornarOk() {
        when(repository.findByEmailAndSenha(loginDTO.email(), loginDTO.senha()))
                .thenReturn(Optional.of(produtor));
        when(mapper.toRetornoDTO(produtor)).thenReturn(produtorRetornoDTO);

        ResponseEntity<ProdutorRetornoDTO> response = controller.login(loginDTO);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(produtorRetornoDTO, response.getBody());
        verify(repository, times(1)).findByEmailAndSenha(loginDTO.email(), loginDTO.senha());
        verify(mapper, times(1)).toRetornoDTO(produtor);
    }

    @Test
    @DisplayName("Deve lançar ResourceNotFoundException quando credenciais forem inválidas")
    void login_ComDadosInvalidos_DeveLancarExcecao() {
        when(repository.findByEmailAndSenha(loginDTO.email(), loginDTO.senha()))
                .thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> controller.login(loginDTO));
        verify(repository, times(1)).findByEmailAndSenha(loginDTO.email(), loginDTO.senha());
        verify(mapper, never()).toRetornoDTO(any());
    }
}

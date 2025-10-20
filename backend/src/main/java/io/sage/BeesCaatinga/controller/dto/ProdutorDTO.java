package io.sage.BeesCaatinga.controller.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.sage.BeesCaatinga.model.enums.Genero;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record ProdutorDTO(
        @Email(message = "Campo email preenchido incorretamente.")
        @NotBlank(message = "Campo email é obrigatório!")
        String email,
        @NotBlank(message = "Campo senha é obrigatório!")
        String senha,
        @NotBlank(message = "Campo nome completo é obrigatório!")
        String nomeCompleto,
        String nomeDaEmpresa,
        @NotBlank(message = "Campo número do telefone é obrigatório!")
        @Size(min = 10, max = 15, message = "Telefone deve ter entre 10 e 15 caracteres")
        String telefone,
        @NotNull(message = "Campo gênero é obrigatório!")
        Genero genero,
        @NotNull(message = "Campo data de nascimento é obrigatório")
        @Past(message = "Data de nascimento deve ser uma data passada")
        @JsonFormat(pattern = "dd/MM/yyyy")
        LocalDate dataDeNascimento,
        String endereco,
        String caminhoDaFoto
) {
}

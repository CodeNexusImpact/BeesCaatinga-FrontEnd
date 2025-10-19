package io.sage.BeesCaatinga.controller.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public record ApiarioDTO(
        @NotBlank(message = "Campo nome é obrigatório!")
        String nome,
        @NotBlank(message = "Campo número de registro é obrigatório!")
        String nRegistro,
        @JsonFormat(pattern = "dd/MM/yyyy")
        LocalDate dataDeCriacao,
        @NotBlank(message = "Campo CEP é obrigatório!")
        String cep,
        @NotBlank(message = "Campo Nome Propriedade é obrigatório!")
        String nomeDaPropriedade,
        @NotBlank(message = "Campo Estado é obrigatório!")
        String estado,
        @NotBlank(message = "Campo Cidade é obrigatório!")
        String cidade,
        @NotBlank(message = "Campo Bairro é obrigatório!")
        String bairro,
        @NotBlank(message = "Campo Rua é obrigatório!")
        String rua,
        String numero,
        String complemento,
        String observacoes
) {
}

package io.sage.BeesCaatinga.controller.dto.apiario;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ApiarioCriadoDTO(
        @NotNull(message = "Campo nome é obrigatório!")
        String nome,
        @NotNull(message = "Campo número de registro é obrigatório!")
        String nRegistro,
        @JsonFormat(pattern = "dd/MM/yyyy")
        LocalDate dataDeCriacao,
        @NotNull(message = "Campo CEP é obrigatório!")
        String cep,
        @NotNull(message = "Campo Nome Propriedade é obrigatório!")
        String nomeDaPropriedade,
        @NotNull(message = "Campo Estado é obrigatório!")
        String estado,
        @NotNull(message = "Campo Cidade é obrigatório!")
        String cidade,
        @NotNull(message = "Campo Bairro é obrigatório!")
        String bairro,
        @NotNull(message = "Campo Rua é obrigatório!")
        String rua,
        String numero,
        String complemento,
        @NotNull(message = "Campo produtor_id é obrigatório!")
        Long produtor_id,
        @NotNull(message = "Campo latitude é obrigatório!")
        BigDecimal latitude,
        @NotNull(message = "Campo longitude é obrigatório!")
        BigDecimal longitude
) {
}

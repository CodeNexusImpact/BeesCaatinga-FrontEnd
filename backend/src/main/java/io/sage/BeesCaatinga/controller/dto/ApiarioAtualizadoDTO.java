package io.sage.BeesCaatinga.controller.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ApiarioAtualizadoDTO(
        String nome,
        String nRegistro,
        @JsonFormat(pattern = "dd/MM/yyyy")
        LocalDate dataDeCriacao,
        String cep,
        String nomeDaPropriedade,
        String estado,
        String cidade,
        String bairro,
        String rua,
        String numero,
        String complemento,
        String observacoes,
        String caminhoDaFoto,
        BigDecimal latitude,
        BigDecimal longitude
) {
}

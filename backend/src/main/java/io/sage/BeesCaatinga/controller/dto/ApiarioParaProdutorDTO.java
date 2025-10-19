package io.sage.BeesCaatinga.controller.dto;

import jakarta.validation.constraints.NotBlank;

public record ApiarioParaProdutorDTO(
        @NotBlank(message = "Campo nome do apiário é obrigatório!")
        String nome
) {
}

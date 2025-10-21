package io.sage.BeesCaatinga.controller.dto.produtor;

import io.sage.BeesCaatinga.model.enums.Genero;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record ProdutorAtualizadoDTO(
        String caminhoDaFoto,
        String nomeCompleto,
        Genero genero,
        String nomeDaEmpresa,
        @Size(min = 10, max = 15, message = "Telefone deve ter entre 10 e 15 caracteres")
        String telefone,
        String endereco
) {
}

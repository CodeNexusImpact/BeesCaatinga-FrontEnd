package io.sage.BeesCaatinga.controller.dto;

import io.sage.BeesCaatinga.model.enums.Genero;

public record ProdutorRetornoDTO(
        String caminhoDaFoto,
        String nomeCompleto,
        Genero genero,
        String email,
        String nomeDaEmpresa,
        String telefone,
        String endereco
) {
}

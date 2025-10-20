package io.sage.BeesCaatinga.controller.dto.produtor;

import io.sage.BeesCaatinga.model.enums.Genero;

public record ProdutorRetornoDTO(
        Long id,
        String caminhoDaFoto,
        String nomeCompleto,
        Genero genero,
        String email,
        String nomeDaEmpresa,
        String telefone,
        String endereco
) {
}

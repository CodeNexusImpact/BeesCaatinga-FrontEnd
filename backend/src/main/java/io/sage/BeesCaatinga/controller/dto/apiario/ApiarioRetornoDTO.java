package io.sage.BeesCaatinga.controller.dto.apiario;

import io.sage.BeesCaatinga.controller.dto.colmeia.ColmeiaRetornoEmApiarioDTO;

import java.time.LocalDate;
import java.util.List;

public record ApiarioRetornoDTO(
        String nome,
        String caminhoDaFoto,
        String nRegistro,
        LocalDate dataDeCriacao,
        String observacoes,
        String cep,
        String nomeDaPropriedade,
        String estado,
        String cidade,
        String bairro,
        String rua,
        String numero,
        String complemento,
        List<ColmeiaRetornoEmApiarioDTO> colmeias
) {
}

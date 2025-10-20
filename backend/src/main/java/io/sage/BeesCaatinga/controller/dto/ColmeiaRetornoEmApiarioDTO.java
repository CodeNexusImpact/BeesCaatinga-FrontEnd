package io.sage.BeesCaatinga.controller.dto;

import io.sage.BeesCaatinga.model.enums.StatusColmeia;

public record ColmeiaRetornoEmApiarioDTO(
        String identificador,
        StatusColmeia statusColmeia
) {
}

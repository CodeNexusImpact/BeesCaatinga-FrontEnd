package io.sage.BeesCaatinga.controller.dto.colmeia;

import io.sage.BeesCaatinga.model.enums.StatusColmeia;

public record ColmeiaRetornoEmApiarioDTO(
        String identificador,
        StatusColmeia statusColmeia
) {
}

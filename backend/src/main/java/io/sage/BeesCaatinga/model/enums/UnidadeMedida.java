package io.sage.BeesCaatinga.model.enums;

public enum UnidadeMedida {
    UNIDADE("Unidade", "UND"),
    KILOGRAMA("Kilograma", "KG"),
    GRAMA("Grama", "G"),
    LITRO("Litro", "L"),
    MILILITRO("Mililitro", "ML"),
    METRO("Metro", "M"),
    CENTIMETRO("Centímetro", "CM"),
    MILIMETRO("Milímetro", "MM"),
    CAIXA("Caixa", "CX"),
    PACOTE("Pacote", "PC"),
    SACO("Saco", "SC"),
    FRASCO("Frasco", "FR"),
    AMPOLA("Ampola", "AMP"),
    COMPRIMIDO("Comprimido", "COMP"),
    PAR("Par", "PAR"),
    DUZIA("Dúzia", "DZ"),
    MILHEIRO("Milheiro", "MIL");

    private final String nome;
    private final String abreviacao;

    UnidadeMedida(String nome, String abreviacao) {
        this.nome = nome;
        this.abreviacao = abreviacao;
    }

    public static UnidadeMedida fromString(String value) {
        try {
            // Tenta pelo nome do enum (MILHEIRO)
            return UnidadeMedida.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            // Tenta pelo código (MIL)
            for (UnidadeMedida unidadeMedida : values()) {
                if (unidadeMedida.abreviacao.equalsIgnoreCase(value) ||
                        unidadeMedida.nome.equalsIgnoreCase(value)) {
                    return unidadeMedida;
                }
            }
            throw new IllegalArgumentException("Unidade de medida não encontrada: " + value);
        }
    }
}

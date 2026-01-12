package io.sage.BeesCaatinga.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.sage.BeesCaatinga.model.enums.StatusColmeia;
import io.sage.BeesCaatinga.model.enums.TipoColmeia;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "colmeias")
@Data
public class Colmeia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "identificador", unique = true)
    private String identificador;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "apiario_id", nullable = false)
    private Apiario apiario;
    @Enumerated(EnumType.STRING)
    private TipoColmeia tipo;
    private Boolean ativa;

    // LOCALIZAÇÃO
    @Column(precision = 9, scale = 6)
    private BigDecimal latitude;
    @Column(precision = 9, scale = 6)
    private BigDecimal longitude;

    private String observacoes;
    @Enumerated(EnumType.STRING)
    private StatusColmeia situacao;
    @JsonFormat(pattern = "dd/MM/yyyy")
    @Column(name = "ultima_vistoria")
    private LocalDate ultimaVistoria;
    @Column(name = "detalhes_da_localizacao")
    private String detalhesDaLocalizacao;
    private String caminhoDaFoto;
}

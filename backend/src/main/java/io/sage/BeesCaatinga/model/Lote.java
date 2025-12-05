package io.sage.BeesCaatinga.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.sage.BeesCaatinga.model.enums.TipoAbelha;
import io.sage.BeesCaatinga.model.enums.TipoFlorada;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "lotes")
@Data
public class Lote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @JsonFormat(pattern = "dd/MM/yyyy")
    @Column(name = "data_producao", nullable = false)
    private LocalDate dataProducao;
    private Double quantidadeProduzida;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "apiario_id", nullable = false)
    private Apiario apiario;
    @Enumerated(EnumType.STRING)
    private TipoFlorada tipoFlorada;
    @Enumerated(EnumType.STRING)
    private TipoAbelha tipoAbelha;
    private Boolean vendido;

    // LOCALIZAÇÃO
    @Column(precision = 9, scale = 6)
    private BigDecimal latitude;
    @Column(precision = 9, scale = 6)
    private BigDecimal longitude;
}

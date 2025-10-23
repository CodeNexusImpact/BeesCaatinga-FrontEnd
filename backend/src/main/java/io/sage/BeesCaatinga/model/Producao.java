package io.sage.BeesCaatinga.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.sage.BeesCaatinga.model.enums.StatusProduto;
import io.sage.BeesCaatinga.model.enums.StatusQualidade;
import io.sage.BeesCaatinga.model.enums.UnidadeMedida;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "producoes")
@Data
public class Producao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String tipoProducao;
    private Double quantidade;
    @Enumerated(EnumType.STRING)
    private UnidadeMedida unidadeMedida;
    private Double litros;

    // RELACIONAMENTOS
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "apiario_id", nullable = false)
    private Apiario apiario;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "colmeia_id", nullable = false)
    private Colmeia colmeia;

    @JsonFormat(pattern = "dd/MM/yyyy")
    @Column(name = "data_coleta")
    private LocalDate dataColeta;
    @JsonFormat(pattern = "dd/MM/yyyy")
    @Column(name = "data_venda")
    private LocalDate dataVenda;
    @Enumerated(EnumType.STRING)
    private StatusProduto statusProduto;
    @Enumerated(EnumType.STRING)
    private StatusQualidade statusQualidade;

    @PrePersist
    @PreUpdate
    protected void calcularLitros() {
        if (quantidade != null && unidadeMedida != null && tipoProducao != null) {
            if (unidadeMedida == UnidadeMedida.KILOGRAMA && ("MEL").equalsIgnoreCase(tipoProducao)) {
                // 1 litro de mel ≈ 1,4 kg
                this.litros = quantidade / 1.4;
            } else if (unidadeMedida == UnidadeMedida.LITRO) {
                // Se já está em litros, mantém o mesmo
                this.litros = quantidade;
            } else {
                // Para outros casos, não converte ou define regras específicas
                this.litros = null;
            }
        }
    }

    // CONSTRUTOR PARA DEFAULTS
    public Producao() {
        this.statusProduto = StatusProduto.EM_ESTOQUE;
        this.statusQualidade = StatusQualidade.NAO_AVALIADO;
    }
}

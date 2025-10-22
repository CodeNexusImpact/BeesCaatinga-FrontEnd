package io.sage.BeesCaatinga.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.sage.BeesCaatinga.model.enums.StatusInsumo;
import io.sage.BeesCaatinga.model.enums.UnidadeMedida;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "insumos")
@Data
public class Insumo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @JsonFormat(pattern = "dd/MM/yyyy")
    @Column(name = "data_entrada", nullable = false)
    private LocalDate dataEntrada;
    private String nome;
    private String tipo;
    private Double quantidade;
    @Enumerated(EnumType.STRING)
    private UnidadeMedida unidadeMedida;
    @JsonFormat(pattern = "dd/MM/yyyy")
    @Column(name = "data_validade", nullable = false)
    private LocalDate dataValidade;
    private String observacoes;
    @Enumerated(EnumType.STRING)
    private StatusInsumo statusInsumo;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produtor_id")
    private Produtor produtor;
}

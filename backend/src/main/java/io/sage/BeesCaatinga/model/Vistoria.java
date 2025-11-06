package io.sage.BeesCaatinga.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.sage.BeesCaatinga.model.enums.CondicaoVistoria;
import io.sage.BeesCaatinga.model.enums.TipoPerda;
import io.sage.BeesCaatinga.model.enums.TipoPraga;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "vistorias")
@Data
public class Vistoria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @JsonFormat(pattern = "dd/MM/yyyy")
    @Column(name = "data_vistoria", nullable = false)
    private LocalDate dataVistoria;

    // RELACIONAMENTOS
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "apiario_id", nullable = false)
    private Apiario apiario;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "colmeia_id", nullable = false)
    private Colmeia colmeia;

    // ENUMS
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CondicaoVistoria condicao;
    @ElementCollection
    @CollectionTable(name = "vistoria_pragas", joinColumns = @JoinColumn(name = "vistoria_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "praga")
    private List<TipoPraga> pragasIdentificadas = new ArrayList<>();
    @ElementCollection
    @CollectionTable(name = "vistoria_perdas", joinColumns = @JoinColumn(name = "vistoria_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "perda")
    private List<TipoPerda> perdasIdentificadas = new ArrayList<>();

    @Column(columnDefinition = "TEXT")
    private String observacoes;

}

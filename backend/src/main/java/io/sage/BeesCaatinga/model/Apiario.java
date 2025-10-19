package io.sage.BeesCaatinga.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "apiarios")
@Data
public class Apiario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    @Column(name = "n_registro", unique = true)
    private String nRegistro;
    @JsonFormat(pattern = "dd/MM/yyyy")
    @Column(name = "data_de_criacao")
    private LocalDate dataDeCriacao;
    private String cep;
    private String nomeDaPropriedade;
    private String estado;
    private String cidade;
    private String bairro;
    private String rua;
    private String numero;
    private String complemento;
    private String observacoes;
    @OneToMany(mappedBy = "apiario", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<Colmeia> colmeias = new ArrayList<>();
}

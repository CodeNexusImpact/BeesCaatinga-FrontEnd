package io.sage.BeesCaatinga.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.sage.BeesCaatinga.model.enums.Genero;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "produtores")
@Data
public class Produtor{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String email;
    private String senha;
    @Column(name = "nome_completo")
    private String nomeCompleto;
    @Column(name = "nome_da_empresa")
    private String nomeDaEmpresa;
    private String telefone;
    @Enumerated(EnumType.STRING)
    private Genero genero;
    @JsonFormat(pattern = "dd/MM/yyyy")
    @Column(name = "data_de_nascimento")
    private LocalDate dataDeNascimento;
    private String endereco;
    @OneToMany(mappedBy = "produtor", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<Apiario> apiarios = new ArrayList<>();
}
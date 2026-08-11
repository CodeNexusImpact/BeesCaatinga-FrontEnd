package io.sage.BeesCaatinga.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.sage.BeesCaatinga.controller.dto.produtor.ProdutorCriadoDTO;
import io.sage.BeesCaatinga.model.enums.Genero;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class BeesCaatingaIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Deve cadastrar um novo produtor e listar via API")
    void fluxoCadastroProdutor() throws Exception {
        var produtor = new ProdutorCriadoDTO(
                "Teste Integracao",
                "11999999999",
                "teste@integracao.com",
                LocalDate.of(1990, 1, 1),
                Genero.MASCULINO,
                "senha123"
        );

        // 1. POST /produtores
        mockMvc.perform(post("/produtores")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(produtor)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nomeCompleto").value("Teste Integracao"));

        // 2. GET /produtores
        mockMvc.perform(get("/produtores"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.email == 'teste@integracao.com')]").exists());
    }

    @Test
    @DisplayName("Deve listar apiários para um produtor existente")
    void listarApiariosParaProdutor() throws Exception {
        // Criar produtor primeiro
        var produtor = new ProdutorCriadoDTO("P1", "11999999999", "p1@test.com", LocalDate.of(1990, 1, 1), Genero.MASCULINO, "123");
        String response = mockMvc.perform(post("/produtores")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(produtor)))
                .andReturn().getResponse().getContentAsString();
        
        Long id = objectMapper.readTree(response).get("id").asLong();

        mockMvc.perform(get("/apiarios/" + id))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Deve listar produções para um produtor existente")
    void listarProducoesParaProdutor() throws Exception {
        // Criar produtor primeiro
        var produtor = new ProdutorCriadoDTO("P2", "11999999999", "p2@test.com", LocalDate.of(1990, 1, 1), Genero.MASCULINO, "123");
        String response = mockMvc.perform(post("/produtores")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(produtor)))
                .andReturn().getResponse().getContentAsString();
        
        Long id = objectMapper.readTree(response).get("id").asLong();

        mockMvc.perform(get("/producoes/" + id))
                .andExpect(status().isOk());
    }
}

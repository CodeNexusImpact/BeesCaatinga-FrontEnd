# Testes de Integração e Funcionalidades

Para garantir que a integração entre o Backend (Spring Boot) e o Frontend (Mobile) esteja funcionando, siga as instruções abaixo.

## 1. Testes de Integração Backend (Automáticos)
Criei uma suíte de testes de integração para verificar o fluxo completo das requisições (Controller -> Service -> Repository).

```java
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
        var result = mockMvc.perform(post("/produtores")
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
    @DisplayName("Deve listar apiários para um produtor (Retornar vazio se não houver)")
    void listarApiariosParaProdutor() throws Exception {
        mockMvc.perform(get("/apiarios/1"))
                .andExpect(status().isOk());
    }
}
```

## 2. Testes Manuais (via cURL)
Execute estes comandos no terminal para validar se a API está respondendo corretamente.

### Cadastrar Produtor
```bash
curl -X POST http://localhost:8080/produtores \
     -H "Content-Type: application/json" \
     -d '{
       "nomeCompleto": "Erick Apicultor",
       "telefone": "84988887777",
       "email": "erick@teste.com",
       "dataDeNascimento": "20/05/1995",
       "genero": "MASCULINO",
       "senha": "123"
     }'
```

### Listar Apiários (do produtor id 1)
```bash
curl -X GET http://localhost:8080/apiarios/1
```

### Listar Produções (do produtor id 1)
```bash
curl -X GET http://localhost:8080/producoes/1
```

## 3. Guia de Solução de Problemas (Back + Front)
Se as requisições não estiverem passando do celular/emulador para o backend:

1. **IP do Backend (Android Emulador):**
   O Android emulador vê `localhost` como ele mesmo. No arquivo `mobile/services/api.ts`, mude para:
   `const BASE_URL = 'http://10.0.2.2:8080';`

2. **IP do Backend (Celular Físico):**
   Use o IP da sua máquina na rede local (ex: `http://192.168.1.5:8080`).

3. **CORS:**
   Já atualizei o `WebConfig.java` para aceitar qualquer origem (`allowedOriginPatterns("*")`), o que resolve bloqueios de navegador.

4. **Datas:**
   O backend espera o formato `dd/MM/yyyy` conforme definido nos DTOs. Verifique se o frontend está enviando a data exatamente assim ou se precisa de formatação.

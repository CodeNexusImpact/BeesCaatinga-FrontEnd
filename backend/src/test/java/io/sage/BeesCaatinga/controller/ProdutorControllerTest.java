package io.sage.BeesCaatinga.controller;

import io.sage.BeesCaatinga.controller.dto.produtor.ProdutorRetornoDTO;
import io.sage.BeesCaatinga.model.enums.Genero;
import io.sage.BeesCaatinga.service.FileStorageService;
import io.sage.BeesCaatinga.service.ProdutorService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ProdutorController.class)
class ProdutorControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProdutorService produtorService;

    @MockBean
    private FileStorageService fileStorageService;

    @Test
    void deveFazerUploadDeFotoEAtualizarProdutor() throws Exception {
        // Arrange
        Long produtorId = 1L;
        String caminhoFoto = "produtores/foto.jpg";
        MockMultipartFile file = new MockMultipartFile("file", "foto.jpg", MediaType.IMAGE_JPEG_VALUE, "imagem".getBytes());
        
        ProdutorRetornoDTO produtorRetorno = new ProdutorRetornoDTO(
                produtorId, caminhoFoto, "Nome Completo", Genero.MASCULINO, "email@teste.com", "Empresa", "123456", "Endereco"
        );

        when(fileStorageService.salvarImagem(any(), anyString())).thenReturn(caminhoFoto);
        when(produtorService.atualizarFoto(eq(produtorId), anyString())).thenReturn(produtorRetorno);

        // Act & Assert
        mockMvc.perform(multipart("/produtores/{id}/foto", produtorId)
                        .file(file))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.caminhoDaFoto").value(caminhoFoto));

        verify(fileStorageService).salvarImagem(file, "produtores");
        verify(produtorService).atualizarFoto(produtorId, caminhoFoto);
    }
}

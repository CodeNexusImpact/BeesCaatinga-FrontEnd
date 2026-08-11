package io.sage.BeesCaatinga.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;

class FileStorageServiceTest {

    private FileStorageService fileStorageService;

    @TempDir
    Path tempDir;

    @BeforeEach
    void setUp() {
        fileStorageService = new FileStorageService(tempDir.toString());
    }

    @Test
    void deveSalvarImagemERetornarCaminhoRelativo() throws IOException {
        // Arrange
        String nomeOriginal = "test-image.jpg";
        MultipartFile file = new MockMultipartFile("file", nomeOriginal, "image/jpeg", "conteudo-da-imagem".getBytes());
        String subDiretorio = "produtores";

        // Act
        String caminhoRetornado = fileStorageService.salvarImagem(file, subDiretorio);

        // Assert
        assertNotNull(caminhoRetornado);
        assertTrue(caminhoRetornado.startsWith(subDiretorio + "/"));
        assertTrue(caminhoRetornado.endsWith(".jpg"));
        
        Path arquivoSalvo = tempDir.resolve(caminhoRetornado);
        assertTrue(Files.exists(arquivoSalvo));
    }

    @Test
    void deveLancarExcecaoQuandoArquivoForVazio() {
        // Arrange
        MultipartFile file = new MockMultipartFile("file", "", "image/jpeg", new byte[0]);

        // Act & Assert
        assertThrows(RuntimeException.class, () -> fileStorageService.salvarImagem(file, "teste"));
    }
}

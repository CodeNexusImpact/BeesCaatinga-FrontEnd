package io.sage.BeesCaatinga.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;

    public FileStorageService(@Value("${file.upload-dir:uploads}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Não foi possível criar o diretório onde os arquivos enviados serão armazenados.", ex);
        }
    }

    public String salvarImagem(MultipartFile file, String subDiretorio) {
        if (file.isEmpty()) {
            throw new RuntimeException("Falha ao armazenar arquivo vazio.");
        }

        String extensao = StringUtils.getFilenameExtension(file.getOriginalFilename());
        String nomeArquivo = UUID.randomUUID().toString() + (extensao != null ? "." + extensao : "");

        try {
            Path targetLocation = this.fileStorageLocation.resolve(subDiretorio).resolve(nomeArquivo);
            Files.createDirectories(targetLocation.getParent());
            
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return subDiretorio + "/" + nomeArquivo;
        } catch (IOException ex) {
            throw new RuntimeException("Não foi possível armazenar o arquivo " + nomeArquivo + ". Por favor, tente novamente!", ex);
        }
    }
}

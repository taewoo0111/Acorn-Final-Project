package com.example.FinalProject.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class FileController {

    @Value("${file.location}")
    private String fileLocation;

    @PostMapping("/uploadFile")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        // 파일이 비어 있는 경우
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("no_file");
        }

        // 원본 파일명과 저장할 파일명 생성
        String originalName = file.getOriginalFilename();
        String saveName = UUID.randomUUID().toString() + "_" + originalName;

        // 저장 경로에 파일 객체 생성 및 저장
        File saveFile = new File(fileLocation, saveName);
        file.transferTo(saveFile);

        // 저장된 파일 이름을 응답
        return ResponseEntity.ok(saveName);
    }
    
    @GetMapping("/download/{fileName}")
    public ResponseEntity<InputStreamResource> downloadFile(@PathVariable String fileName) throws IOException {
        File file = new File(fileLocation, fileName);
        if (!file.exists()) {
            throw new RuntimeException("File not found");
        }

        // MIME 타입 자동 추론
        String contentType = Files.probeContentType(file.toPath());
        if (contentType == null) {
            contentType = "application/octet-stream"; // 기본값 (바이너리 파일)
        }

        InputStreamResource resource = new InputStreamResource(new FileInputStream(file));

        return ResponseEntity.ok()
            .contentLength(file.length())
            .header("Content-Disposition", "attachment; filename=\"" + fileName + "\"")
            .header("Content-Type", contentType)
            .body(resource);
    }
}
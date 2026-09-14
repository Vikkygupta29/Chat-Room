package com.substring.chat.controllers;


import com.substring.chat.services.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
public class MediaController {


    private final FileService fileService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadMedia(
            @RequestParam("file") MultipartFile file) {

        try {
            String fileUrl = fileService.saveFile(file);
            return ResponseEntity.ok(fileUrl);

        } catch (Exception e) {
            return ResponseEntity
                    .status(500)
                    .body("Upload failed: " + e.getMessage());
        }
    }
}
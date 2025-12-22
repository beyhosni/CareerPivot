package com.careerpivot.backend.roadmap.web;

import com.careerpivot.backend.roadmap.domain.Roadmap;
import com.careerpivot.backend.roadmap.domain.ShareableLink;
import com.careerpivot.backend.roadmap.service.ShareService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/exports")
@RequiredArgsConstructor
public class ExportController {
    private final ShareService shareService;

    @PostMapping("/roadmap/{id}/share")
    public ResponseEntity<String> createShareLink(@PathVariable Integer id) {
        // Find roadmap by ID logic
        // For simplicity:
        Roadmap roadmap = new Roadmap();
        roadmap.setId(id);
        ShareableLink link = shareService.createShareLink(roadmap);
        return ResponseEntity.ok("/shared/" + link.getToken());
    }

    @GetMapping("/shared/{token}")
    public ResponseEntity<Roadmap> getSharedRoadmap(@PathVariable String token) {
        Roadmap roadmap = shareService.getSharedRoadmap(token);
        if (roadmap == null)
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok(roadmap);
    }

    @GetMapping("/roadmap/{id}/pdf")
    public ResponseEntity<byte[]> exportPdf(@PathVariable Integer id) {
        // Placeholder for PDF generation
        byte[] placeholder = "PDF Content Placeholder for Roadmap".getBytes();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"roadmap.pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(placeholder);
    }
}

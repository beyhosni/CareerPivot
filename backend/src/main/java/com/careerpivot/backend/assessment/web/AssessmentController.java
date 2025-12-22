package com.careerpivot.backend.assessment.web;

import com.careerpivot.backend.assessment.domain.Assessment;
import com.careerpivot.backend.assessment.service.AssessmentService;
import com.careerpivot.backend.auth.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/assessment")
@RequiredArgsConstructor
public class AssessmentController {

    private final AssessmentService service;

    @PostMapping
    public ResponseEntity<Assessment> submitAssessment(
            @AuthenticationPrincipal User user,
            @RequestBody AssessmentRequest request) {
        return ResponseEntity.ok(service.saveAssessment(user, request));
    }

    @GetMapping
    public ResponseEntity<Assessment> getAssessment(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(service.getAssessment(user));
    }
}

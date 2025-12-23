package com.careerpivot.backend.auth.web;

import com.careerpivot.backend.auth.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(service.authenticate(request));
    }

    @org.springframework.web.bind.annotation.GetMapping("/me")
    public ResponseEntity<com.careerpivot.backend.auth.domain.User> getMe(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.careerpivot.backend.auth.domain.User user) {
        return ResponseEntity.ok(user);
    }
}

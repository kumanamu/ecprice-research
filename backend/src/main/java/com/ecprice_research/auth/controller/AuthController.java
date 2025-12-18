package com.ecprice_research.auth.controller;

import com.ecprice_research.auth.dto.AuthResponse;
import com.ecprice_research.auth.dto.LoginRequest;
import com.ecprice_research.auth.dto.SignupRequest;
import com.ecprice_research.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody @Valid SignupRequest req) {
        System.out.println("🔥 SIGNUP CONTROLLER HIT");
        String token = authService.signup(req);  // 🔥 토큰 받기
        return ResponseEntity.ok(new AuthResponse(token, "ROLE_USER"));  // 🔥 토큰 반환
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody @Valid LoginRequest req) {
        String token = authService.login(req);
        return ResponseEntity.ok(new AuthResponse(token, "ROLE_USER"));
    }
}
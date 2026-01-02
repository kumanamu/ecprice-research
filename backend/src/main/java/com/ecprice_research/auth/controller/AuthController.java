package com.ecprice_research.auth.controller;

import com.ecprice_research.auth.dto.AuthResponse;
import com.ecprice_research.auth.dto.LoginRequest;
import com.ecprice_research.auth.dto.SignupRequest;
import com.ecprice_research.auth.jwt.JwtProvider;
import com.ecprice_research.auth.service.AuthService;
import com.ecprice_research.entity.User;
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
    private final JwtProvider jwtProvider;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody @Valid SignupRequest req) {
        System.out.println("🔥 SIGNUP CONTROLLER HIT");
        String token = authService.signup(req);
        return ResponseEntity.ok(new AuthResponse(token, "ROLE_USER"));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody @Valid LoginRequest req) {
        // ✅ User 객체 받기
        User user = authService.login(req);

        // ✅ 토큰 생성 (role 포함)
        String token = jwtProvider.createToken(user.getId(), user.getEmail(), user.getRole().name());

        // ✅ 실제 user의 role 사용
        return ResponseEntity.ok(new AuthResponse(token, user.getRole().name()));
    }
}
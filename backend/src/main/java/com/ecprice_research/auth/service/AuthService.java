package com.ecprice_research.auth.service;

import com.ecprice_research.auth.dto.LoginRequest;
import com.ecprice_research.auth.dto.SignupRequest;
import com.ecprice_research.auth.jwt.JwtProvider;
import com.ecprice_research.entity.Role;
import com.ecprice_research.entity.User;
import com.ecprice_research.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.ecprice_research.auth.exception.AuthException;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;
    private final PasswordEncoder passwordEncoder;

    public String signup(SignupRequest req) {

        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }

        User user = User.builder()
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .name(req.getName())
                .provider("local")
                .role(Role.ROLE_USER)
                .build();

        userRepository.save(user);

        return jwtProvider.createToken(user.getId(), user.getEmail(), user.getRole().name());
    }

    /**
     * 로그인 - User 객체 반환
     */
    public User login(LoginRequest req) {

        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new AuthException("이메일 또는 비밀번호가 올바르지 않습니다."));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new AuthException("이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        return user;  // ✅ User 객체 반환
    }
}
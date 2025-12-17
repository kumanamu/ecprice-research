package com.ecprice_research.auth.bootstrap;

import com.ecprice_research.entity.Role;
import com.ecprice_research.entity.User;
import com.ecprice_research.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminBootstrap {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostConstruct
    public void initAdmin() {

        if (userRepository.existsByEmail("admin@admin.com")) return;

        User admin = User.builder()
                .email("admin@admin.com")
                .password(passwordEncoder.encode("admin1234"))
                .provider("local")
                .name("ADMIN")
                .role(Role.ROLE_ADMIN)
                .build();

        userRepository.save(admin);
    }
}


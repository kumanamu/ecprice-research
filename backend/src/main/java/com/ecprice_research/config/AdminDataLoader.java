package com.ecprice_research.config;

import com.ecprice_research.entity.Role;
import com.ecprice_research.entity.User;
import com.ecprice_research.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * 초기 어드민 계정 자동 생성
 * 애플리케이션 시작 시 1회 실행
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AdminDataLoader {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // 초기 어드민 계정 정보
    private static final String ADMIN_EMAIL = "admin@jpkaresearch.store";
    private static final String ADMIN_PASSWORD = "Admin1234!";  // 실제 운영에서는 변경 필수!
    private static final String ADMIN_NAME = "System Admin";

    @PostConstruct
    public void init() {
        createAdminIfNotExists();
    }

    /**
     * 어드민 계정이 없으면 생성
     */
    private void createAdminIfNotExists() {
        // 이미 어드민 계정이 있는지 확인
        if (userRepository.findByEmail(ADMIN_EMAIL).isPresent()) {
            log.info("✅ [AdminDataLoader] 어드민 계정이 이미 존재합니다: {}", ADMIN_EMAIL);
            return;
        }

        // 어드민 계정 생성
        User admin = User.builder()
                .email(ADMIN_EMAIL)
                .password(passwordEncoder.encode(ADMIN_PASSWORD))
                .provider("local")
                .role(Role.ROLE_ADMIN)
                .name(ADMIN_NAME)
                .build();

        userRepository.save(admin);

        log.info("🎉 [AdminDataLoader] 초기 어드민 계정 생성 완료!");
        log.info("📧 이메일: {}", ADMIN_EMAIL);
        log.info("🔑 비밀번호: {}", ADMIN_PASSWORD);
        log.warn("⚠️ 보안을 위해 초기 비밀번호를 즉시 변경하세요!");
    }
}
package com.ecprice_research.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // OAuth 사용자만 값 있음
    @Column(unique = true)
    private String oauthId;

    @Column(nullable = false, unique = true)
    private String email;

    // 일반 로그인용 (OAuth 사용자는 null)
    private String password;

    // "local", "google"
    @Column(nullable = false)
    private String provider;

    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @CreationTimestamp
    private LocalDateTime createdAt;
}

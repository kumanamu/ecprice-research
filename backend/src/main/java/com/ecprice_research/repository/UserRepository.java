package com.ecprice_research.repository;

import com.ecprice_research.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByOauthId(String oauthId);

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}

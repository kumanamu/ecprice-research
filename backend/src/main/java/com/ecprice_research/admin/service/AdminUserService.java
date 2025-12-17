package com.ecprice_research.admin.service;

import com.ecprice_research.entity.User;
import com.ecprice_research.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }
}

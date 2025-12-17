package com.ecprice_research.admin.controller;

import com.ecprice_research.admin.service.AdminUserService;
import com.ecprice_research.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping
    public List<User> getAllUsers() {
        return adminUserService.findAllUsers();
    }
}

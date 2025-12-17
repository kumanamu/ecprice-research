package com.ecprice_research.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class SignupRequest {

    @Email
    @NotBlank
    private String email;

    @NotBlank
    @Size(min = 8, message = "비밀번호는 8자 이상이어야 합니다.")
    private String password;

    private String name;
}

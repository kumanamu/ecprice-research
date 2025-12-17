package com.ecprice_research.auth.exception;

import com.ecprice_research.auth.dto.ErrorResponse;
import com.ecprice_research.auth.exception.AuthException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AuthException.class)
    public ResponseEntity<ErrorResponse> handleAuth(AuthException e) {
        return ResponseEntity
                .badRequest()
                .body(new ErrorResponse(e.getMessage()));
    }
}

package com.ggirick.gardening_back.handlers;

import com.ggirick.gardening_back.exceptions.LoginFailedException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(LoginFailedException.class)
    public ResponseEntity<Map<String, String>> handleAuthException(LoginFailedException ex) {
        Map<String, String> errorResponse = new HashMap<>();

        errorResponse.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
    }


    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        e.printStackTrace(); // 서버 로그 용
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST).build();
    }
}

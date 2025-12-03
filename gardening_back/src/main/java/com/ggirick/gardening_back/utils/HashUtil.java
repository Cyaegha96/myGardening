package com.ggirick.gardening_back.utils;

import org.springframework.web.multipart.MultipartFile;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class HashUtil {
    // 인스턴스 생성 막아두기
    private HashUtil() {}

    // SHA-256 해시 생성
    public static String sha256(byte[] data) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] digest = md.digest(data);

            // 바이트 → 16진수 문자열 변환
            StringBuilder hex = new StringBuilder();
            for (byte b : digest) {
                hex.append(String.format("%02x", b));
            }
            return hex.toString();

        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 Algorithm not found", e);
        }
    }

    // MultipartFile 전용 오버로드
    public static String sha256(MultipartFile file) {
        try {
            return sha256(file.getBytes());
        } catch (Exception e) {
            throw new RuntimeException("Failed to hash file", e);
        }
    }
}

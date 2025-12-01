package com.ggirick.gardening_back.utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import com.ggirick.gardening_back.dto.auth.UserTokenDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Date;
import java.util.List;

@Component
public class JWTUtil {

    @Value("${jwt.access-expiration}")
    private Long accessExp;
    @Value("${jwt.refresh-expiration}")
    private Long refreshExp;


    private final Algorithm algorithm;
    private final JWTVerifier jwt;

    public JWTUtil(@Value("${jwt.secret}") String secret) {
        this.algorithm = Algorithm.HMAC256(secret);
        this.jwt = JWT.require(algorithm).build();
    }

    /**
     * Access Token을 생성합니다.
     * @param userInfo 사용자 정보 (uid, provider)
     * @return Access Token
     */
    public String createAccessToken(UserTokenDTO userInfo) {
        // 토큰의 Subject (제목)에 uid를 명시하는 것이 좋습니다.
        return JWT.create()
                .withSubject(userInfo.getUid())
                .withClaim("uid", userInfo.getUid()) // 사용자 고유 식별자
                .withClaim("provider", userInfo.getProvider()) // 로그인 방식
                .withIssuedAt(new Date())
                // Access Token 만료 시간 적용
                .withExpiresAt(new Date(System.currentTimeMillis() + accessExp * 1000))
                .sign(algorithm);
    }

    /**
     * Refresh Token을 생성합니다. (만료 시간이 더 길고, 클레임은 최소화)
     * @param userInfo 사용자 정보 (uid, provider)
     * @return Refresh Token
     */
    public String createRefreshToken(UserTokenDTO userInfo) {
        return JWT.create()
                .withSubject(userInfo.getUid())
                .withClaim("provider", userInfo.getProvider())
                .withIssuedAt(new Date())
                // Refresh Token 만료 시간 적용
                .withExpiresAt(new Date(System.currentTimeMillis() + refreshExp * 1000))
                .sign(algorithm);
    }


    public boolean validateToken(String token) {
        try{
            jwt.verify(token);
            return true;
        }catch(JWTVerificationException e){
            return false;
        }
    }

    public String getUid(String refreshToken) {
        DecodedJWT data = JWT.require(algorithm).build().verify(refreshToken);
        return data.getSubject();
    }

    public String getIdFromToken(String token) {
        DecodedJWT data = JWT.require(algorithm).build().verify(token);
        return data.getSubject();
    }

    public List<String> getRolesFromToken(String token) {
        DecodedJWT data = verifyToken(token);
        return data.getClaim("roles").asList(String.class);
    }

    /**
     * 토큰을 검증하고 디코딩합니다.
     *
     * @param token Access Token 또는 Refresh Token
     * @return 디코딩된 JWT
     */
    public DecodedJWT verifyToken(String token){
        return jwt.verify(token);
    }

    public Date getRefreshTokenExpirationDate() {

        long expirationTimeMillis = System.currentTimeMillis() + (refreshExp * 1000);

        return new Date(expirationTimeMillis);
    }


    //RefreshToken 대신 RefreshTokenHash 저장
    public static String sha256(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder();
            for (byte b : hash) {
                hex.append(String.format("%02x", b));
            }
            return hex.toString();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}

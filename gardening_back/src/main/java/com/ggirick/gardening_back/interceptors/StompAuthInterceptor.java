package com.ggirick.gardening_back.interceptors;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.ggirick.gardening_back.dto.auth.UserTokenDTO;
import com.ggirick.gardening_back.services.auth.RedisService;
import com.ggirick.gardening_back.utils.JWTUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class StompAuthInterceptor implements ChannelInterceptor {

    private final JWTUtil jwtUtil;
    private final RedisService redisService;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {

        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {

            String token = accessor.getFirstNativeHeader("Authorization");

            if (token == null || !token.startsWith("Bearer ")) {
                throw new IllegalArgumentException("No JWT token in STOMP CONNECT");
            }

            token = token.substring(7);

            try {
                DecodedJWT jwt = jwtUtil.verifyToken(token);

                // 블랙리스트 체크
                if (redisService.isBlacklisted(token)) {
                    throw new IllegalArgumentException("JWT is blacklisted");
                }

                // sessionId 체크
                String sessionId = jwt.getClaim("sessionId").asString();
                if (!redisService.isSessionValid(sessionId)) {
                    throw new IllegalArgumentException("Session revoked");
                }

                // 사용자 정보 추출
                String uid = jwt.getClaim("uid").asString();
                String provider = jwt.getClaim("provider").asString();

                UserTokenDTO principal = UserTokenDTO.builder()
                        .uid(uid)
                        .provider(provider)
                        .build();

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(principal, null, List.of());

                accessor.setUser(authentication);

            } catch (Exception e) {
                throw new IllegalArgumentException("JWT parsing failed: " + e.getMessage());
            }
        }

        return message;
    }
}

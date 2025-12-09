package com.ggirick.gardening_back.filters;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.ggirick.gardening_back.dto.auth.UserTokenDTO;
import com.ggirick.gardening_back.mappers.auth.UserMapper;
import com.ggirick.gardening_back.services.auth.RedisService;
import com.ggirick.gardening_back.utils.JWTUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import lombok.RequiredArgsConstructor;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JWTFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;

    private final UserMapper userMapper;

    private final RedisService redisService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String path = request.getServletPath();
        if(path.startsWith("/auth/existIdCheck")
                ||path.startsWith("/auth/qr")
                ||path.startsWith("/auth/checkOtp")
                ||path.startsWith("/auth/requestOtp")
                || path.startsWith("/auth/signup")
                || path.startsWith("/auth/register")
                || path.startsWith("/auth/refresh")
                || path.startsWith("/oauth")
                || path.startsWith("/swagger-ui")
                || path.startsWith("/v3/api-docs")
                ||path.startsWith("/oauth2/authorization/")) {
            filterChain.doFilter(request, response);
            return;
        }

        String header=   request.getHeader("Authorization");
        if(header == null || !header.startsWith("Bearer ")){//만약 인증 정보가 없다면
            filterChain.doFilter(request,response);
            System.out.println("토큰 헤더 없음");
            return; // 여기서 리턴은 되돌려보내라는 말이 아님 . 아무 작업 없이 다음 필터에게 넘기라는 말임.
        }

        String accessToken = header.substring(7);

        try {

            // 2. Access Token 검증
            DecodedJWT djwt = jwtUtil.verifyToken(accessToken);

            // 3. 토큰에서 기본 정보 추출 (UID와 Provider는 필수 클레임)
            String uid = djwt.getClaim("uid").asString();
            String provider = djwt.getClaim("provider").asString();
            String sessionId = djwt.getClaim("sessionId").asString();
            //블랙리스트 제어
            //만약 블랙리스트에 등록된 토큰이라면 revoked
            if (redisService.isBlacklisted(accessToken)) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Token is revoked.");
                return; }

            if (!redisService.isSessionValid(sessionId)) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Session revoked.");
                return;
            }


            // 4. UserTokenDTO 생성 (SecurityContext의 Principal로 사용)
            UserTokenDTO userTokenDTO = UserTokenDTO.builder()
                    .uid(uid)
                    .provider(provider)
                    .build();

            // 5. 권한 정보 조회
            System.out.println("접속자 UID: " + uid);
            List<String> roles = userMapper.selectRoleNameByUserUid(uid); // uid = userUid
            List<SimpleGrantedAuthority> authorities = roles.stream()
                    .map(r -> new SimpleGrantedAuthority("ROLE_" + r))
                    .toList();
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(userTokenDTO, null, authorities);

            SecurityContextHolder.getContext().setAuthentication(authentication);

        } catch (Exception e) {
            // 토큰 만료, 변조, 서명 오류 등의 경우
            SecurityContextHolder.clearContext();
            System.out.println("JWT 인증 실패: " + e.getMessage());
        }

        // 7. 다음 필터로 진행
        filterChain.doFilter(request, response);
    }
}

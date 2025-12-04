package com.ggirick.gardening_back.controllers.auth;


import com.ggirick.gardening_back.dto.auth.*;
import com.ggirick.gardening_back.exceptions.TokenRefreshException;
import com.ggirick.gardening_back.services.auth.AuthService;
import com.ggirick.gardening_back.services.auth.RedisService;
import com.ggirick.gardening_back.services.auth.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {


    private final AuthService authService;
    private final UserService userService;
    private final RedisService redisService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest, HttpServletRequest request) {

        String ipAddress = getCurrentIpAddress(request);

        try {
            //  AuthService 로그인 로직 실행
            TokenPair tokenPair = authService.login(
                    loginRequest.getId(),
                    loginRequest.getPassword(),
                    ipAddress
            );

            //  성공 시 200 OK와 토큰 쌍 반환
            return ResponseEntity.ok(tokenPair);

        } catch (AuthenticationException e) {
            // 인증 실패 (ID 없음 또는 PW 불일치)
            Map<String, String> errorResponse = Collections.singletonMap("error", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(errorResponse);

        } catch (Exception e) {
            //  기타 서버 오류

            e.printStackTrace();
            Map<String, String> errorResponse = Collections.singletonMap("error", "로그인 처리 중 서버 오류가 발생했습니다.");
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestParam("token") String refreshToken, HttpServletRequest request) {

        System.out.println("토큰 재발급 refreshToken: " + refreshToken);

        String currentIpAddress = getCurrentIpAddress(request);

        try {
            // AuthService를 통해 토큰 재발급 로직 실행
            TokenPair tokenPair = authService.refreshTokens(refreshToken, currentIpAddress);

            // 성공 시 200 OK와 함께 새로운 토큰 쌍 반환
            return ResponseEntity.ok(tokenPair);

        } catch (TokenRefreshException e) {
            //  Refresh Token이 유효하지 않거나 만료, DB 불일치 등의 경우
            // 클라이언트에게 다시 로그인해야 함을 알립니다.

            // Map 형태로 오류 메시지 반환
            Map<String, String> errorResponse = Collections.singletonMap("error", e.getMessage());

            // 401 Unauthorized 또는 403 Forbidden 반환
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(errorResponse);

        } catch (Exception e) {
            //  기타 서버 오류
            Map<String, String> errorResponse = Collections.singletonMap("error", "Internal Server Error during token refresh");

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody LogoutRequestDTO request) {
        System.out.println("로그아웃 호출");
        System.out.println(request.getAccessToken());
        System.out.println(request.getRefreshToken());
        try {
            int revokedCount = authService.logout(request);

            if (revokedCount > 0) {
                // 성공적으로 세션 무효화
                return ResponseEntity.ok(Collections.singletonMap("message", "로그아웃이 완료되었습니다."));
            } else {
                // 토큰이 유효하지 않거나 이미 무효화된 경우
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Collections.singletonMap("error", "유효하지 않거나 이미 만료된 토큰입니다."));
            }

        } catch (Exception e) {
            // JWT 파싱 오류 등 기타 서버 오류 처리
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "로그아웃 처리 중 서버 오류가 발생했습니다."));
        }
    }

    @PostMapping("/inactivate")
    public ResponseEntity<?> inactivateAccount(
            @AuthenticationPrincipal UserTokenDTO userTokenDTO,
            @RequestBody LogoutRequestDTO request
    ) {
        try {
            if (userTokenDTO == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "인증 정보가 없습니다."));
            }

            String uid = userTokenDTO.getUid();

            int result = authService.inactivateAccount(uid, request);

            if (result > 0) {
                return ResponseEntity.ok(Map.of("message", "회원 탈퇴가 완료되었습니다."));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "회원 탈퇴 처리에 실패했습니다."));
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "회원 탈퇴 중 서버 오류가 발생했습니다."));
        }
    }


    @PostMapping("/complete-profile")
    public ResponseEntity<String> completeProfile(@AuthenticationPrincipal UserTokenDTO userTokenDTO, @RequestBody UserInfoDTO dto) {
        try {

            if(userTokenDTO
                   == null || dto == null){
                return ResponseEntity.status(500).body("프로필 등록 실패 (필요한 값이 null입니다)");
            }
            dto.setUuid(userTokenDTO.getUid());
            userService.completeProfile(dto);
            return ResponseEntity.ok("프로필 등록 성공");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("프로필 등록 실패: " + e.getMessage());
        }
    }

    @GetMapping("/existIdCheck")
    public ResponseEntity<?> existIdCheck(@RequestParam("id") String id) {

        try {

            boolean isAlreadySignedUp = authService.existingId(id);
            if(isAlreadySignedUp){
                return ResponseEntity.ok(Map.of("message", "이미 가입된 아이디입니다."));
            }else{
                return ResponseEntity.ok(Map.of("message", "회원가입 가능한 아이디 입니다."));
            }

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "아이디 검색 도중 오류가 발생했습니다."));
        }
    }

    @GetMapping("/existPhoneCheck")
    public ResponseEntity<?> existPhoneCheck(@RequestParam("phone") String phone) {

        try {

            boolean isAlreadySignedUp = userService.getUserAuthByPhone(phone) != null;
            if(isAlreadySignedUp){
                return ResponseEntity.ok(Map.of("message", "이미 가입된 전화번호입니다."));
            }else{
                return ResponseEntity.ok(Map.of("message", "회원가입 가능한 전화번호 입니다."));
            }

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "전화번호 검색 도중 오류가 발생했습니다."));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody AuthDTO dto) {

        try {

            authService.signup(dto);
            return ResponseEntity.ok(Map.of("message", "회원가입 완료"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "회원가입 중 오류가 발생했습니다."));
        }
    }
    
    @GetMapping("/info")
    public ResponseEntity<?> getUserInfo(@AuthenticationPrincipal UserTokenDTO userTokenDTO) {
        System.out.println(userTokenDTO.getUid());
        try {
            UserInfoDTO info =  userService.getUserInfo(userTokenDTO.getUid());

            return ResponseEntity.ok(info);
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "회원 정보를 가져오는 중 오류가 발생했습니다."));
        }
        
    }



    @GetMapping("/requestOtp")
    public String getRequestOtp(@RequestParam("uid") String uid, @RequestParam("phone") String phone){
        String otp=  redisService.requestOtp(uid);

        return otp;
    }

    @GetMapping("/checkOtp")
    public String checkOtp(@RequestParam("uid") String uid, @RequestParam("otp") String otp){
        return redisService.checkOtp(uid,otp);
    }



    public String getCurrentIpAddress(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");

        // X-Forwarded-For가 없다면 다른 프록시 헤더 확인
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }
        if (ip == null ||ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }

        // 최종적으로 일반적인 IP 주소 가져오기 시도
        if (ip == null || ip.isEmpty()|| "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }

        // X-Forwarded-For에 여러 IP가 콤마로 구분되어 있을 경우, 첫 번째 IP(실제 클라이언트 IP)만 사용
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }

        return ip;
    }

}

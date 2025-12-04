package com.ggirick.gardening_back.services.auth;

import com.auth0.jwt.exceptions.TokenExpiredException;
import com.ggirick.gardening_back.exceptions.LoginFailedException;
import com.ggirick.gardening_back.dto.auth.*;
import com.ggirick.gardening_back.mappers.auth.AuthMapper;
import com.ggirick.gardening_back.mappers.auth.UserMapper;
import com.ggirick.gardening_back.mappers.auth.UserSessionMapper;
import com.ggirick.gardening_back.utils.JWTUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {


    private final JWTUtil jwtUtil;

    private final RedisService redisService;


    private final PasswordEncoder passwordEncoder;


    private final UserSessionMapper userSessionMapper;


    private final AuthMapper authMapper;


    private final UserMapper userMapper;


    private final RedisTemplate<String, Object> redisObjectTemplate; // Redis object template

    /**
     * 로그인 처리: 사용자의 id,pw를 받아서 인증처리 후 AccessToken, Refresh Token을 발급합니다.
     * @param id, rawPassword, ipAddress
     * @return  AccessToken, Refresh Token을 담은 TokenPair
     */
    @Transactional
    public TokenPair login(String id, String rawPassword, String ipAddress) {

        //  사용자 인증 정보 조회
        AuthDTO authInfo = authMapper.selectAuthById(id);

        if (authInfo == null) {
            // DB에서 ID를 찾지 못한 경우
            throw new LoginFailedException("사용자 ID를 찾을 수 없습니다.");
        }

        //  비밀번호 검증 (PasswordEncoder 사용)
        if (!passwordEncoder.matches(rawPassword, authInfo.getPw())) {
            // 비밀번호 불일치
            throw new LoginFailedException("비밀번호가 일치하지 않습니다.");
        }

        UsersDTO usersDTO = userMapper.selectUserByUid(authInfo.getUserUid());


        if ("BLOCKED".equals(usersDTO.getStatus())) {
            throw new LoginFailedException("계정이 차단되었습니다.");
        }

        if (!"ACTIVE".equals(usersDTO.getStatus())) {
            throw new LoginFailedException("로그인 불가: 계정이 비활성화 상태입니다.");
        }


        //  토큰 생성을 위한 DTO 구성
        String userUid = authInfo.getUserUid(); // auth 테이블에서 가져온 UID
        UserTokenDTO userInfo = UserTokenDTO.builder()
                .uid(userUid)
                .provider(authInfo.getProvider()) // DB에 저장된 provider 사용
                .build();


        String sessionId = UUID.randomUUID().toString();

        //  Access Token 및 Refresh Token 발급
        String accessToken = jwtUtil.createAccessToken(userInfo,sessionId);
        String refreshToken = jwtUtil.createRefreshToken(userInfo);

        // user_session 테이블에 Refresh Token 기록
        Date accessExpDate = jwtUtil.getAccessTokenExpirationDate();
        Date refreshExpDate = jwtUtil.getRefreshTokenExpirationDate();

        //새로운 세션 생성
  
        UserSessionDTO newSession = UserSessionDTO.builder()
                .sessionId(UUID.randomUUID().toString())
                .userUid(userUid)
                .provider(authInfo.getProvider())
              .refreshToken(refreshToken)
                .accessToken(accessToken)
                .lastAccessTokenExpiresAt(accessExpDate)
                 .expiresAt(refreshExpDate)
                .ipAddress(ipAddress)
                .isRevoked("N")
                .build();

        userSessionMapper.insertSession(newSession);

        log.debug("새 세션 {}", newSession.getSessionId());

        //세션 시간은 accessToken 만료 시간과 동일
        long ttlMillis = accessExpDate.getTime() - System.currentTimeMillis();
        if (ttlMillis <= 0) {
            // 토큰 만료면 예외
            throw new LoginFailedException("생성된 Access Token 만료시간이 유효하지 않습니다.");
        }


        Map<String, Object> redisSession = new HashMap<>();
        redisSession.put("uid", userUid);
        redisSession.put("provider", authInfo.getProvider());
        redisSession.put("ip", ipAddress);

        //redis db에 기록
        redisService.saveSession(userUid,newSession.getSessionId(), refreshToken, redisSession, ttlMillis);



        //login_history 테이블에 기록
        LoginHistoryDTO loginHistory = LoginHistoryDTO.builder()
                .userUid(userUid)
                .sessionId(newSession.getSessionId())
                .ipAddress(ipAddress)
                .loginAt(new Date()) // 현재 시간
                .build();

        authMapper.insertLoginHistory(loginHistory);

        //  토큰 쌍 반환
        return new TokenPair(accessToken, refreshToken);
    }


    @Transactional
    public TokenPair refreshTokens(String refreshToken,String currentIpAddress){


        Map<String, Object> session = redisService.getSessionByRefreshToken(refreshToken);
        if (session == null) {
            throw new TokenExpiredException("Refresh token session not found", Instant.now());
        }
        String uid= session.get("uid").toString();
        String provider= session.get("provider").toString();

        String oldSessionId =  redisService.getSessionIdByRefreshToken(refreshToken);


        // 3) DB에서 해당 세션이 이미 revoke되어 있는지 확인
        UserSessionDTO existingSession = userSessionMapper.selectSessionById(oldSessionId);
        if (existingSession == null || "Y".equalsIgnoreCase(existingSession.getIsRevoked())) {
            // 이미 무효화 되었거나 DB에 없으면 실패
            // 또한 Redis에 있더라도 DB에서 revoked라면 의심스러운 상황으로 처리
            // Redis 키도 제거 (cleanup)
            redisService.deleteSession(refreshToken);
            throw new TokenExpiredException("Refresh token session is revoked or invalid.", new Date().toInstant());
        }
        //새로운 Access Token 및 Refresh Token 발급

        UserTokenDTO userInfo = UserTokenDTO.builder().uid(uid).provider(provider).build();
        String newAccessToken = jwtUtil.createAccessToken(userInfo,oldSessionId);
        String newRefreshToken = jwtUtil.createRefreshToken(userInfo);

        Date refreshExpDate = jwtUtil.getRefreshTokenExpirationDate();
        Date accessExpDate  = jwtUtil.getAccessTokenExpirationDate();
        //새로운 세션 정보로 업데이트

        UserSessionDTO updateSession = UserSessionDTO.builder()
                .sessionId(oldSessionId)
                .userUid(uid)
                .provider(provider)
                .refreshToken(newRefreshToken)
                .accessToken(newAccessToken)
                .lastAccessTokenExpiresAt(accessExpDate)
                .expiresAt(refreshExpDate)
                .isRevoked("N")
                .ipAddress(currentIpAddress)
                .build();

        userSessionMapper.updateSession(updateSession);

        Map<String, Object> newRedisValue= new HashMap<>();
        newRedisValue.put("uid", uid);
        newRedisValue.put("provider", provider);
        newRedisValue.put("ip", currentIpAddress);

        //Redis: 새 refreshToken 키 저장, TTL 설정

        long newTtlMillis = accessExpDate.getTime() - System.currentTimeMillis();
        redisService.deleteSession(refreshToken);
        redisService.saveSession(uid, updateSession.getSessionId(), newRefreshToken, newRedisValue, newTtlMillis);
        return new TokenPair(newAccessToken, newRefreshToken);

    }

    /**
     * 로그아웃 처리: Refresh Token을 DB에서 무효화합니다.
     * @param logoutRequest 클라이언트가 보낸 Refresh Token
     * @return 무효화 성공 여부 (처리된 레코드 수)
     */
    @Transactional
    public int logout(LogoutRequestDTO logoutRequest) {
        String accessToken = logoutRequest.getAccessToken();
        String refreshToken = logoutRequest.getRefreshToken();
        if (refreshToken == null || refreshToken.isEmpty()) {
            return 0;
        }

        String sessionId = redisService.getSessionIdByRefreshToken(refreshToken);
        System.out.print("로그아웃할 세션 아이디:"+sessionId);
        int updated = 0;

        if (sessionId != null) {
            authMapper.logoutHistory(sessionId);
            updated = userSessionMapper.updateRevokedStatus(sessionId);
            redisService.deleteSession(refreshToken);
            redisService.addBlacklist(accessToken);
        }



        return updated;
    }


    public TokenPair issueTokenForOAuth(UserTokenDTO userInfo, String ipAddress) {
        String sessionId = UUID.randomUUID().toString();

        String accessToken = jwtUtil.createAccessToken(userInfo,sessionId);
        String refreshToken = jwtUtil.createRefreshToken(userInfo);
        Date accessExpDate = jwtUtil.getAccessTokenExpirationDate();
        Date refreshExpDate = jwtUtil.getRefreshTokenExpirationDate();



        // 1) DB에 세션 기록
        UserSessionDTO newSession = UserSessionDTO.builder()
                .sessionId(sessionId)
                .userUid(userInfo.getUid())
                .provider(userInfo.getProvider())
                .refreshToken(refreshToken)
                .accessToken(accessToken)
                .lastAccessTokenExpiresAt(accessExpDate)
                .expiresAt(refreshExpDate)
                .ipAddress(ipAddress)
                .isRevoked("N")
                .build();

        userSessionMapper.insertSession(newSession);

        // login history
        LoginHistoryDTO loginHistory = LoginHistoryDTO.builder()
                .userUid(userInfo.getUid())
                .sessionId(sessionId)
                .ipAddress(ipAddress)
                .loginAt(new Date())
                .build();
        authMapper.insertLoginHistory(loginHistory);

        // 2) Redis에 세션 저장
        long ttlMillis = accessExpDate.getTime() - System.currentTimeMillis();
        Map<String, Object> redisValue = new HashMap<>();
        redisValue.put("uid", userInfo.getUid());
        redisValue.put("provider", userInfo.getProvider());
        redisValue.put("ip", ipAddress);

        redisService.saveSession(userInfo.getUid(), sessionId, refreshToken, redisValue, ttlMillis);

        return new TokenPair(accessToken, refreshToken);
    }


    public boolean existingId(String id){
        AuthDTO existing = authMapper.selectAuthById(id);
        return existing != null;
    }

    @Transactional
    public int inactivateAccount(String uid, LogoutRequestDTO logoutRequest) {

        String accessToken = logoutRequest.getAccessToken();
        String refreshToken = logoutRequest.getRefreshToken();

        // 1) 사용자 상태 INACTIVE로 변경
        int updatedUser = userMapper.updateUserStatus(uid, "INACTIVE");
        if (updatedUser == 0) {
            throw new IllegalStateException("사용자 상태 업데이트 실패");
        }

        // 2) 모든 세션 revoke 처리
        int revokedSessions = userSessionMapper.revokeAllSessionsByUid(uid);

        // 3) Redis 세션 삭제 (refreshToken 기반)
        if (refreshToken != null) {
            redisService.deleteSession(refreshToken);
        }

        redisService.deleteAllSessionsByUid(uid);

        // 4) AccessToken 블랙리스트 추가
        if (accessToken != null) {
            redisService.addBlacklist(accessToken);
        }


        return revokedSessions;
    }



    @Transactional
    public void signup(AuthDTO dto) {
        try {
            //  ID 중복 체크
            if (existingId(dto.getId())) {
                throw new IllegalArgumentException("이미 사용 중인 ID입니다.");
            }

            //  UUID 생성
            String userUid = UUID.randomUUID().toString();

            // Users 테이블 등록
            int userInsert = userMapper.insertUser(userUid);
            if (userInsert != 1) {
                throw new RuntimeException("회원정보 생성 실패");
            }

            //  비밀번호 암호화
            dto.setPw(passwordEncoder.encode(dto.getPw()));

            //  Auth 테이블 등록
            dto.setUserUid(userUid);
            dto.setProvider("local");
            int authInsert = authMapper.insertAuth(dto);
            if (authInsert != 1) {
                throw new RuntimeException("인증정보 생성 실패");
            }

            // user_info 등록
            UserInfoDTO userInfoDTO = UserInfoDTO.builder()
                    .uuid(userUid)
                    .bio("자기소개를 수정해주세요")
                    .nickname(userMapper.randomUserNickName())
                    .build();

            //user_role. 등록
            userMapper.insertUserRole(UserRoleDTO.builder()
                    .userUid(userUid)
                    .assignedBy("system")
                    .roleId(1)
                    .build());

            int infoInsert = userMapper.insertUserInfo(userInfoDTO);
            if (infoInsert != 1) {
                throw new RuntimeException("유저정보 생성 실패");
            }

        } catch (Exception e) {
            e.printStackTrace(); // Oracle/MyBatis 오류 확인
            throw e; // 트랜잭션 롤백
        }
    }

    @Transactional
    public void registerOAuthUser(UserInfoDTO infoDTO,AuthDTO authDTO) {
        String userUid = UUID.randomUUID().toString();

        authDTO.setUserUid(userUid);

        authMapper.insertAuth(authDTO);
        userMapper.insertUser(userUid);

        UserInfoDTO info = UserInfoDTO.builder()
                .uuid(userUid)

                .bio("자기소개를 수정해주세요")
                .nickname(userMapper.randomUserNickName())
                .profileUrl(infoDTO.getProfileUrl())

                .name(infoDTO.getName())
                .nickname(infoDTO.getNickname())
                .build();

        userMapper.insertUserInfo(info);
        //user_role. 등록
        userMapper.insertUserRole(UserRoleDTO.builder()
                .userUid(userUid)
                .assignedBy("system")
                .roleId(1)
                .build());

    }


}

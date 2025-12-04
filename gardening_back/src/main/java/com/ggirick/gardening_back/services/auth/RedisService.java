package com.ggirick.gardening_back.services.auth;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.ggirick.gardening_back.utils.JWTUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class RedisService {

    private final RedisTemplate<String, Object> redis;

    private static final String BLACKLIST_PREFIX = "blacklist:";

    private static final String OTP_PREFIX = "OTP:";

    private final JWTUtil jwtUtil;
    /**
     * Redis 세션 저장
     *
     * 저장 구조:
     *
     * 1) user:{uid}:sessions  ← [sessionId, ...]
     * 2) ref:{sha256(refreshToken)}         ← sessionId
     * 3) session:{sessionId}  ← sessionData(Map)
     */
    public void saveSession(String userUid, String sessionId, String refreshToken,
                            Map<String, Object> sessionData, long ttlMs) {
        String hash = JWTUtil.sha256(refreshToken);

        // 세션 목록에 push (세션 목록은 ttl을 걸지 않음)
        String listKey = "user:" + userUid + ":sessions";
        redis.opsForList().leftPush(listKey, sessionId);

        // 2) refreshTokenHash → sessionId 매핑
        redis.opsForValue().set("ref:" + hash, sessionId, ttlMs, TimeUnit.MILLISECONDS);


        // 3) session:{sessionId} 에 세션 데이터 저장
        redis.opsForValue().set("session:" + sessionId, sessionData, ttlMs, TimeUnit.MILLISECONDS);


    }

    /**
     * refreshToken 기반 세션 조회
     */
    public Map<String, Object> getSessionByRefreshToken(String refreshToken) {
        String hash = JWTUtil.sha256(refreshToken);
        String refKey = "ref:" + hash;

        // refreshTokenHash → sessionId 조회
        String sessionId = (String) redis.opsForValue().get(refKey);
        if (sessionId == null) return null;

        // sessionId로 실제 세션 데이터 조회
        String sessionKey = "session:" + sessionId;
        return (Map<String, Object> ) redis.opsForValue().get(sessionKey);
    }

    public String getSessionIdByRefreshToken(String refreshToken) {
        String hash = JWTUtil.sha256(refreshToken);
        String refKey = "ref:" + hash;

        // refreshTokenHash → sessionId 조회
       return (String) redis.opsForValue().get(refKey);

    }


    /**
     * 단일 세션 삭제 (로그아웃)
     */
    public void deleteSession(String refreshToken) {
        String hash = JWTUtil.sha256(refreshToken);
        String refKey = "ref:" + hash;

        log.debug("logout-refKey: {}", refKey);

        String sessionId = (String) redis.opsForValue().get(refKey);
        if (sessionId != null) {
            // 먼저 uid 가져오기
            Map<String, Object> sessionData = (Map<String, Object>) redis.opsForValue().get("session:" + sessionId);
            if (sessionData != null && sessionData.get("uid") != null) {
                String uid = sessionData.get("uid").toString();
                String listKey = "user:" + uid + ":sessions";
                redis.opsForList().remove(listKey, 0, sessionId);
            }

            // 그 다음 삭제
            redis.delete("session:" + sessionId);
            redis.delete(refKey);
        }

    }


    /**
     * 유저 전체 세션 삭제 (전체 로그아웃)
     */
    public void deleteAllSessionsByUid(String uid) {
        String listKey = "user:" + uid + ":sessions";

        List<Object> all = redis.opsForList().range(listKey, 0, -1);
        if (all != null) {
            for (Object obj : all) {
                String sessionId = (String) obj;

                // 세션 상세 데이터 제거
                redis.delete("session:" + sessionId);
            }
        }

        // 목록 삭제
        redis.delete(listKey);

        // ref:{hash}도 삭제해야 하지만 hash를 모르므로
        // refresh 과정에서 자동 만료되도록 TTL 로 해결
    }


    /*
    블랙리스트 등록
     */
    public void addBlacklist(String accessToken) {
        String key = BLACKLIST_PREFIX + accessToken;
        // key 조회용 => data 중요하지 않음
        // Access Token 만료 시간 기준 계산
        DecodedJWT decoded = jwtUtil.verifyToken(accessToken);
        Date expiration = decoded.getExpiresAt();
        long now = System.currentTimeMillis();
        long remainingMillis = expiration.getTime() - now;

        if (remainingMillis > 0) {
            redis.opsForValue().set(key, "", Duration.ofMillis(remainingMillis));
        }
    }

    /*
    블랙리스트 조회
     */
    public boolean isBlacklisted(String token) {
        String key = BLACKLIST_PREFIX + token;
        return redis.opsForValue().get(key) != null;
    }

    /**
     * otp 인증용 키 생성
     * Redis 에 요청한 User의 ID + OTP KEY + 만료시간 기록
     * 3분 뒤 만료됨
     */
    public String requestOtp(String userUid) {
        redis.opsForValue().set(OTP_PREFIX + userUid, genOtpKey(), 3 * 60, TimeUnit.SECONDS);

        log.info("Temporay Password set : {}", redis.opsForValue().get(OTP_PREFIX +userUid));

        return (String) redis.opsForValue().get(OTP_PREFIX +userUid);
    }

    /**
     * @info : 임시 비밀번호 확인 (OTP)
     * @param userUid
     * @param otp
     * @return
     */
    public String checkOtp(String userUid, String otp) {

        String target = OTP_PREFIX + userUid;

        if(redis.hasKey(OTP_PREFIX + userUid)){
            String value = redis.opsForValue().get(target).toString();

            if(value.equals(otp)) {
                log.info("OTP is Correct");
                return "SUCCESS";
            }else {
                return "FAIL";
            }
        }else {
            return "NO DATA";
        }
    }

    // 임시 비밀번호 생성(OTP)
    private String genOtpKey() {
        return RandomStringUtils.randomAlphanumeric(10); // Eng(Upper, Lower) + Number
    }

}

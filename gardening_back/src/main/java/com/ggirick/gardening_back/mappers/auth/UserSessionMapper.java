package com.ggirick.gardening_back.mappers.auth;


import com.ggirick.gardening_back.dto.auth.UserSessionDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserSessionMapper {

    // 1. UID와 Refresh Token으로 유효한 세션 조회
    // IS_REVOKED = 'N' 조건과 EXPIRES_AT 조건도 쿼리에 포함 가능
    UserSessionDTO selectValidSessionByUidAndToken(
            @Param("userUid") String userUid,
            @Param("refreshToken") String refreshToken
    );
    // 2.  로그아웃/재발급 시 세션 무효화
    int updateRevokedStatus(@Param("sessionId") String sessionId); // 세션 ID로 업데이트
    // 3. 새로운 세션 정보 저장
    int insertSession(UserSessionDTO session);

    int updateSession(UserSessionDTO session);

    // 4. 특정 사용자의 모든 세션 무효화 (추가 로그아웃 옵션)
    int revokeAllUserSessions(@Param("uid") String uid);

    UserSessionDTO selectSessionById(@Param("sessionId") String sessionId);
}
package com.ggirick.gardening_back.mappers.auth;


import com.ggirick.gardening_back.dto.auth.AuthDTO;
import com.ggirick.gardening_back.dto.auth.LoginHistoryDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface AuthMapper {

    //  ID로 인증 정보를 조회 (PW 검증에 사용)
    AuthDTO selectAuthById(@Param("id") String id);

    AuthDTO selectAuthByUserUid(@Param("userUid") String userUid);



    // Provider로 인증 정보 조회
    AuthDTO selectAuthByProvider(@Param("provider") String provider, @Param("providerUserId") String providerUserid);


    //  로그인 기록 삽입
    int insertLoginHistory(LoginHistoryDTO history);

    // 로그아웃 기록 삽입
    int logoutHistory(String sessionId);

   //유저 auth db에 삽입
    int insertAuth(AuthDTO auth);

    int countAuthByEmail(@Param("email") String email);

    int countEmailExceptSelf(@Param("email") String email, @Param("uuid") String uuid);

    int countPhoneExceptSelf(@Param("phone") String phone, @Param("uuid") String uuid);

    String findUidByIdAndEmail(String email,String id);

    void updatePassword(String uid, @Param("password") String encode);
}
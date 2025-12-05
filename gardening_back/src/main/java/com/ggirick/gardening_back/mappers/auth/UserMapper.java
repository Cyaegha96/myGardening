package com.ggirick.gardening_back.mappers.auth;

import com.ggirick.gardening_back.dto.auth.AuthDTO;
import com.ggirick.gardening_back.dto.auth.UserInfoDTO;
import com.ggirick.gardening_back.dto.auth.UserRoleDTO;
import com.ggirick.gardening_back.dto.auth.UsersDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserMapper {

    //uuid기반 유저 조회
    UsersDTO selectUserByUid(@Param("uid") String uid);

    int updateUserStatus(@Param("uid") String uid, @Param("status") String status);
    int insertUserInfo(UserInfoDTO userInfo);
    
    //uuid 기반 user 테이블 등록 (회원가입)
    int insertUser(@Param("uuid") String uid);

    
    //uid에 따라 user정보 챙겨오기
    UserInfoDTO selectUserInfoByUid(@Param("uid") String uid);

    AuthDTO selectUserByPhone(@Param("phone") String phone);

    void updateUserEmailAndPhoneToAuth(@Param("userUid") String userUid, @Param("email") String email, @Param("phone") String phone);
    
    //랜덤 닉네임 정하기
    String randomUserNickName();

    int updateUserInfo(UserInfoDTO dto);

    int insertUserRole(UserRoleDTO dto);
    List<String> selectRoleNameByUserUid(@Param("userUid") String userUid);
}

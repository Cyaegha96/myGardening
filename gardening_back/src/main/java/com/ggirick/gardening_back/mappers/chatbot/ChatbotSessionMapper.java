package com.ggirick.gardening_back.mappers.chatbot;

import com.ggirick.gardening_back.dto.chatbot.ChatbotSessionDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ChatbotSessionMapper {

    // 사용자 UID 기준 ACTIVE 세션 조회
    ChatbotSessionDTO findActiveSessionByUserUid(String loginUid);

    // 세션 ID 조회
    ChatbotSessionDTO findById(int id);

    // 세션 생성
    void insert(ChatbotSessionDTO session);

    // 세션 종료 처리
    void updateStatusEnded(int id);

    // 세션 만료 처리
    void updateStatusExpired(int id);

    // 세션 복구 처리
    void updateStatusActive(int id);
}

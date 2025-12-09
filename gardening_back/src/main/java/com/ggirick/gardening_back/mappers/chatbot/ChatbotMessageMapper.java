package com.ggirick.gardening_back.mappers.chatbot;

import com.ggirick.gardening_back.dto.chatbot.ChatbotMessageDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ChatbotMessageMapper {
    // 메시지 저장
    void insertMessage(ChatbotMessageDTO message);

    // 특정 세션의 마지막 메시지 조회
    ChatbotMessageDTO getLastMessageBySessionId(int sessionId);

    // 세션 기반 메시지 삭제
    void deleteBySessionId(int sessionId);
}

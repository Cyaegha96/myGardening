package com.ggirick.gardening_back.mappers.chatbot;

import com.ggirick.gardening_back.dto.chatbot.ChatbotMessageDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ChatbotMessageMapper {
    // 메시지 저장 - user, chatbot 공통
    void insertMessage(ChatbotMessageDTO message);

    // 특정 세션의 마지막 메시지 조회
    ChatbotMessageDTO getLastMessageBySessionId(int sessionId);

    // 세션 기반 메시지 삭제
    void deleteBySessionId(int sessionId);

    // 특정 세션의 전체 메시지 조회 - 과거 ~ 현재순 (챗봇용)
    List<ChatbotMessageDTO> getMessagesBySessionId(int sessionId);

    // UI용: 최신 메시지 페이지 조회
    List<ChatbotMessageDTO> getMessagesForUI(@Param("sessionId") int sessionId,
                                             @Param("offset") int offset,
                                             @Param("limit") int limit);

    // 시스템 정책 저장
    void insertSystemPrompt(@Param("sessionId") int sessionId,
                            @Param("content") String content);

    // 최근 메세지 가져오기
    List<ChatbotMessageDTO> getLastNMessages(@Param("sessionId") int sessionId,
                                             @Param("limit") int limit);
}

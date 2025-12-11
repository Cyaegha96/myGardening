package com.ggirick.gardening_back.services.chatbot;

import com.ggirick.gardening_back.dto.chatbot.ChatbotSessionDTO;
import com.ggirick.gardening_back.mappers.chatbot.ChatbotSessionMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ChatbotSessionService {

    private final ChatbotSessionMapper sessionMapper;
    private final ChatbotMessageService messageService;

    // 세션 만료 시간
    private final long MAX_SESSION_HOURS = 3;

    // 세션 ID 조회
    public ChatbotSessionDTO findById(int id) {
        return sessionMapper.findById(id);
    }

    // 사용자 UID 기준 ACTIVE 세션 조회
    public ChatbotSessionDTO findActiveSessionByUserUid(String loginUid) {
        return sessionMapper.findActiveSessionByUserUid(loginUid);
    }

    // 세션 생성
    @Transactional
    public ChatbotSessionDTO createSession(String loginUid) {
        // 1. 활성되어 있는 세션 조회
        ChatbotSessionDTO active = sessionMapper.findActiveSessionByUserUid(loginUid);

        // 2. 존재하면 활성화 되어 있는 세션 리턴
        if (active != null) {
            return active;
        }

        // 3. 없으면 세션 생성
        ChatbotSessionDTO newSession = ChatbotSessionDTO.builder()
                .userUid(loginUid)
                .build();
        sessionMapper.insert(newSession);

        // 4. 생성된 세션 리턴
        return newSession;
    }

    // 세션 종료
    @Transactional
    public void endSession(int sessionId, String loginUid) {
        // 1. 현재 세션 정보 가져오기
        ChatbotSessionDTO session = sessionMapper.findById(sessionId);
        if (session == null) return;

        // 2. 로그인한 UID와 요청한 세션 정보의 UID 비교 후 종료 처리
        if (session.getUserUid().equals(loginUid)) {
            sessionMapper.updateStatusEnded(sessionId);
            System.out.println("세션 종료됨 !");
        }

        // 3. 해당 세션의 메세지 기록 삭제
        messageService.deleteBySessionId(sessionId);
        System.out.println("메세지도 삭제 됨!");
    }

    // 시간 만료 여부 확인 후 종료 처리
    @Transactional
    public void expiredSession(int sessionId) {
        // 1. 현재 세션 정보 가져오기
        ChatbotSessionDTO session = sessionMapper.findById(sessionId);

        // 2. 만료 시간이 지났다면
        if (isSessionExpired(session.getId())) {
            // 3. 만료처리
            sessionMapper.updateStatusExpired(sessionId);

            // 4. 해당 세션의 메세지 기록 삭제
            messageService.deleteBySessionId(sessionId);
        }

    }

    // 세션이 만료되었는지 여부
    public boolean isSessionExpired(int sessionId) {

        LocalDateTime last = messageService.getLastMessageBySessionId(sessionId).toLocalDateTime();
        LocalDateTime now = LocalDateTime.now();

        long hours = Duration.between(last, now).toHours();

        return hours >= MAX_SESSION_HOURS;
    }

    // 세션 복구 처리
    public void reactivateSession(int sessionId) {
        sessionMapper.updateStatusActive(sessionId);
    }
}

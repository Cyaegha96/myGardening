package com.ggirick.gardening_back.services.chatbot;

import com.ggirick.gardening_back.dto.chatbot.ChatbotMessageDTO;
import com.ggirick.gardening_back.dto.chatbot.ChatbotRequestDTO;
import com.ggirick.gardening_back.dto.chatbot.ChatbotResponseDTO;
import com.ggirick.gardening_back.dto.chatbot.ChatbotSessionDTO;
import com.ggirick.gardening_back.utils.FileUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class ChatbotService {
    private final ChatbotSessionService sessionService;
    private final ChatbotMessageService messageService;
    private final FileUtil fileUtil;

    // 상담 시작 (세션 생성 + 첫 챗봇 응답)
    @Transactional
    public ChatbotResponseDTO startSession(String loginUid) {

        // 1. 해당 사용자의 세션 조회
        ChatbotSessionDTO session = sessionService.findActiveSessionByUserUid(loginUid);

        // 2. 만들어진 세션이 있고, active 상태라면
        if (session != null && session.getStatus().equals("active")) {
            return null;
        }

        // 3. 세션 생성
        session = sessionService.createSession(loginUid);

        // 4. 첫 챗봇 안내 메시지
        String welcomeMessage = "안녕하세요! 무엇을 도와드릴까요?";

        // 5. DB에 저장
        ChatbotMessageDTO botDTO = ChatbotMessageDTO.builder()
                .sessionId(session.getId())
                .sender("bot")
                .content(welcomeMessage)
                .build();

        messageService.saveBotMessage(botDTO);

        return ChatbotResponseDTO.builder()
                .sessionId(session.getId())
                .content(botDTO.getContent())
                .build();
    }

    // 메시지 처리 (텍스트 또는 이미지)
    @Transactional
    public ChatbotResponseDTO sendMessage(int sessionId, String loginUid,
                                          ChatbotRequestDTO dto, MultipartFile file) throws Exception {
        // 1. sessionId로 세션 조회
        ChatbotSessionDTO session = sessionService.findById(sessionId);

        // 2. session 이 없거나, loginUid의 세션이 아니라면
        ChatbotResponseDTO responseDTO = new ChatbotResponseDTO();
        if (session == null || !loginUid.equals(session.getUserUid())) {
            return null;
        }

        // 3. 세션 만료 체크
        if (sessionService.isSessionExpired(sessionId)) {
            // 3-1. 기존 세션 만료 처리
            sessionService.expiredSession(sessionId);
            // 3-2. 해당 세션 메세지 DB 삭제
            messageService.deleteBySessionId(sessionId);

            // 3-3. 새 세션 생성
            session = sessionService.createSession(loginUid);
            sessionId = session.getId();
        }

        // 4. 사용자 메시지 저장
        ChatbotMessageDTO saveMsg = ChatbotMessageDTO.builder()
                .sessionId(sessionId)
                .sender("user")
                .content(dto.getContent())
                .build();
        messageService.saveUserMessage(saveMsg, file);

        // 5. 봇 응답 받아오기

        // 6. 봇 응답 저장

        // 7. 응답 리턴
        return null;
    }


    // 챗봇 응답 저장 공통 로직
    private void saveBotResponse(int sessionId, String botContent) {
        ChatbotMessageDTO botMessage = ChatbotMessageDTO.builder()
                .sessionId(sessionId)
                .sender("bot")
                .content(botContent)
                .build();

        messageService.saveBotMessage(botMessage);
    }


    // 세션 종료 (사용자 요청)
    @Transactional
    public boolean endSession(int sessionId, String loginUid) {

        ChatbotSessionDTO session = sessionService.findById(sessionId);
        if (session == null) return false;

        if (!loginUid.equals(session.getUserUid())) {
            return false;
        }
        // 2. 세션 종료
        sessionService.endSession(sessionId, loginUid);
        // 3. 종료된 세션 메세지 삭제
        messageService.deleteBySessionId(sessionId);

        return true;
    }

//
//
//    // 세션 메시지 조회
//    public List<ChatbotMessageDTO> getMessages(int sessionId, String loginUid) {
//
//        ChatbotSessionDTO session = sessionService.findById(sessionId);
//        if (session == null || !loginUid.equals(session.getUserUid())) {
//            return null;
//        }
//
//        return messageService.getMessagesBySessionId(sessionId);
//    }
}

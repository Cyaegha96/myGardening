package com.ggirick.gardening_back.services.chatbot;

import com.ggirick.gardening_back.dto.chatbot.ChatbotMessageDTO;
import com.ggirick.gardening_back.dto.chatbot.ChatbotRequestDTO;
import com.ggirick.gardening_back.dto.chatbot.ChatbotResponseDTO;
import com.ggirick.gardening_back.dto.chatbot.ChatbotSessionDTO;
import com.ggirick.gardening_back.dto.plant.PlantInfoDTO;
import com.ggirick.gardening_back.services.plant.PlantService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatbotService {

    // 정책: 식물 관련 질문 외에는 안내 멘트 반환
    private static final String POLICY_REJECT =
            "식물 관련 질문만 상담 가능합니다.\n" +
                    "식물 이름, 물주기, 잎/꽃 사진 등으로 질문해주세요.";

    private final ChatbotSessionService sessionService;
    private final ChatbotMessageService messageService;
    private final GeminiService geminiService;
    private final PlantService plantService;

    // 기존 세션 유지, 없으면 생성
    @Transactional
    public ChatbotResponseDTO startSession(String loginUid) {

        ChatbotSessionDTO session = sessionService.findActiveSessionByUserUid(loginUid);

        if (session != null && "active".equals(session.getStatus())) {
            return new ChatbotResponseDTO(session.getId(), "어떤 식물 이야기로 도와드릴까요?");
        }

        session = sessionService.createSession(loginUid);

        ChatbotMessageDTO bot = ChatbotMessageDTO.builder()
                .sessionId(session.getId())
                .sender("bot")
                .content("어떤 식물에 대해 상담해드릴까요?")
                .build();
        messageService.saveBotMessage(bot);

        return new ChatbotResponseDTO(session.getId(), bot.getContent());
    }

    // 메시지 처리 (정책 필터 + DB 우선 + 최소 Gemini 호출)
    @Transactional
    public ChatbotResponseDTO sendMessage(
            int sessionId,
            String loginUid,
            ChatbotRequestDTO dto,
            MultipartFile file
    ) throws Exception {

        ChatbotSessionDTO session = sessionService.findById(sessionId);
        if (session == null || !loginUid.equals(session.getUserUid())) return null;

        if (sessionService.isSessionExpired(sessionId)) {
            sessionService.expiredSession(sessionId);
            messageService.deleteBySessionId(sessionId);
            return startSession(loginUid);
        }

        ChatbotMessageDTO userMsg = ChatbotMessageDTO.builder()
                .sessionId(sessionId)
                .sender("user")
                .content(dto.getContent())
                .build();
        messageService.saveUserMessage(userMsg, file);

        // 1) 이미지 기반 식물 식별 (PlantNet 우선)
        if (file != null && !file.isEmpty()) {

            Optional<?> plantResultOpt =
                    plantService.getPlantDetailFromImage(file, "leaf", loginUid);

            if (plantResultOpt.isPresent()) {
                Object result = plantResultOpt.get();
                if (result instanceof PlantInfoDTO plantInfo) {
                    String reply = formatPlantInfo(plantInfo);
                    saveBotResponse(sessionId, reply);
                    return new ChatbotResponseDTO(sessionId, reply);
                }

                String reply = result.toString();
                saveBotResponse(sessionId, reply);
                return new ChatbotResponseDTO(sessionId, reply);
            }

            String fallback = "식물 식별에 실패했어요.\n좀 더 선명한 잎/꽃 사진을 보내주세요.";
            saveBotResponse(sessionId, fallback);
            return new ChatbotResponseDTO(sessionId, fallback);
        }

        // 2) 텍스트 기반 식물 부분 검색 (예) "파리지옥 알아?"
        List<PlantInfoDTO> foundPlants =
                plantService.searchPlantsByKeyword(dto.getContent());

        if (!foundPlants.isEmpty()) {

            // 정확하게 1개 발견 → 바로 응답
            if (foundPlants.size() == 1) {
                PlantInfoDTO plantInfo = foundPlants.get(0);
                String reply = formatPlantInfo(plantInfo);
                saveBotResponse(sessionId, reply);
                return new ChatbotResponseDTO(sessionId, reply);
            }

            // 여러 개 발견 → 선택 요청
            String reply = "여러 식물이 검색되었습니다.\n선택해서 다시 질문해주세요.\n\n" +
                    foundPlants.stream()
                            .map(p -> "- " + p.getCommonName())
                            .limit(5)
                            .collect(Collectors.joining("\n"));

            saveBotResponse(sessionId, reply);
            return new ChatbotResponseDTO(sessionId, reply);
        }


        // 3) DB에도 없고 이미지도 없음 → 정책 필터
        if (!isPlantRelated(dto.getContent())) {
            saveBotResponse(sessionId, POLICY_REJECT);
            return new ChatbotResponseDTO(sessionId, POLICY_REJECT);
        }

        // 4) 최후: Gemini 호출 (식물 질문 but DB 없음)
        String botAnswer;
        try {
            botAnswer = geminiService.getSmartChatResponse(null, dto.getContent(), "");
        } catch (Exception e) {
            botAnswer = "지금 상담이 많이 밀려있습니다.\n잠시 후 다시 시도해주세요.";
        }

        botAnswer = trimToThreeLines(botAnswer);
        saveBotResponse(sessionId, botAnswer);
        return new ChatbotResponseDTO(sessionId, botAnswer);
    }

    // 응답 줄 수 제한
    private String trimToThreeLines(String txt) {
        List<String> lines = List.of(txt.split("\n"));
        if (lines.size() <= 3) return txt;
        return String.join("\n", lines.subList(0, 3));
    }

    private void saveBotResponse(int sessionId, String content) {
        messageService.saveBotMessage(ChatbotMessageDTO.builder()
                .sessionId(sessionId)
                .sender("bot")
                .content(content)
                .build());
    }

    // 식물 관련 여부 판단
    private boolean isPlantRelated(String msg) {

        if (msg == null || msg.isBlank()) return false;

        String t = msg.toLowerCase().trim();

        // 불필요한 문장 표현 제거 (NLP 간단 처리)
        t = t.replaceAll("[?!.]", "")      // 문장부호 제거
                .replaceAll("알아|뭐야|맞아|키워도 돼|이름이 뭐야|어떻게", "")
                .trim();

        // 1) 명확한 식물 관련 키워드 우선 판별
        if (t.matches(".*(식물|잎|꽃|단풍|묘목|분갈이|뿌리|화분|씨|발아).*")) {
            return true;
        }

        // 2) 식물명 패턴 (예: 다육이, 선인장)
        if (t.matches(".*(다육|선인장|파리지옥|개나리|장미|선인장).*")) {
            return true;
        }

        // 3) DB 기반 부분 검색 (키워드 정리 완료된 후)
        List<PlantInfoDTO> found = plantService.searchPlantsByKeyword(t);
        return !found.isEmpty();
    }

    // 식물 정보 응답 2~3줄 요약
    private String formatPlantInfo(PlantInfoDTO p) {
        return String.format(
                "학명: %s\n일반명: %s\n물주기: %s",
                p.getScientificName(),
                p.getCommonName(),
                p.getWatering()
        );
    }

    // 기존 기능 복구: 세션 종료
    @Transactional
    public boolean endSession(int sessionId, String loginUid) {
        ChatbotSessionDTO session = sessionService.findById(sessionId);
        if (session == null || !loginUid.equals(session.getUserUid())) return false;
        sessionService.endSession(sessionId, loginUid);
        messageService.deleteBySessionId(sessionId);
        return true;
    }

    // 기존 기능 유지: 메시지 Paging 조회
    @Transactional(readOnly = true)
    public List<ChatbotMessageDTO> getMessagesForUI(
            int sessionId,
            String loginUid,
            int offset,
            int limit
    ) {
        ChatbotSessionDTO session = sessionService.findById(sessionId);
        if (session == null || !loginUid.equals(session.getUserUid())) {
            throw new RuntimeException("권한이 없습니다.");
        }
        return messageService.getMessagesForUI(sessionId, offset, limit);
    }
}

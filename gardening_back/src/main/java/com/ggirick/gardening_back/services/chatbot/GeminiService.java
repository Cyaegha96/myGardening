package com.ggirick.gardening_back.services.chatbot;

import com.google.genai.Client;
import com.google.genai.types.Content;
import com.google.genai.types.GenerateContentConfig; // *새로 추가: Config 클래스*
import com.google.genai.types.GenerateContentResponse;
import com.google.genai.types.Part;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GeminiService {
    // ... (이전 코드 생략: MODEL_NAME, chatbotApiKey, chatbotClient, initChatbotClient)

    private static final String MODEL_NAME = "gemini-2.5-flash";

    @Value("${EUNGYEONG_GEMINI_KEY}")
    private String chatbotApiKey;

    private Client chatbotClient;

    @javax.annotation.PostConstruct
    private void initChatbotClient() {
        if (chatbotApiKey == null || chatbotApiKey.isEmpty()) {
            throw new IllegalArgumentException("EUNGYEONG_GEMINI_KEY must be set in properties/yml");
        }

        chatbotClient = Client.builder()
                .apiKey(chatbotApiKey)
                .build();

        System.out.println("▶ Chatbot Gemini Client initialized!");
    }


    /**
     * 사용자 메시지(텍스트)와 이미지 파일(옵션)을 받아 Gemini 응답 반환
     */
    public String getChatResponseWithImage(MultipartFile imageFile, String message) {
        if (chatbotClient == null) {
            return "오류 발생: Gemini Client가 초기화되지 않았습니다.";
        }

        List<Part> parts = new ArrayList<>();

        try {
            // 2) 이미지 파일 처리
            if (imageFile != null && !imageFile.isEmpty()) {
                byte[] imageBytes = imageFile.getBytes();
                String mimeType = imageFile.getContentType();
                parts.add(Part.fromBytes(imageBytes, mimeType));
            }

            // 3) 텍스트 메시지 처리
            if (message != null && !message.trim().isEmpty()) {
                parts.add(Part.fromText(message));
            }

            // 4) 입력이 없는 경우 처리
            if (parts.isEmpty()) {
                return "오류 발생: 텍스트 메시지나 이미지 파일 중 하나 이상을 제공해야 합니다.";
            }

            // 5) Content 구성
            Content content = Content.builder()
                    .role("user")
                    .parts(parts)
                    .build();

            // 6) 모델 호출: 두 번째 시그니처 사용 (Content, Config)

            // Config 객체는 필수이므로, 기본 설정을 사용합니다. (temperature 등 필요 시 여기에 추가)
            GenerateContentConfig defaultConfig = GenerateContentConfig.builder().build();

            GenerateContentResponse response =
                    chatbotClient.models.generateContent(
                            MODEL_NAME,
                            content,        // Content 객체 (이미지+텍스트 포함)
                            defaultConfig   // 필수 Config 인자
                    );

            // 7) 텍스트 응답 반환
            return response.text();

        } catch (IOException e) {
            e.printStackTrace();
            return "오류 발생: 이미지 파일을 읽는 중 I/O 오류가 발생했습니다.";
        } catch (Exception e) {
            e.printStackTrace();
            return "오류 발생: " + e.getMessage();
        }
    }
}
package com.ggirick.gardening_back.services.chatbot;

import lombok.RequiredArgsConstructor;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GeminiService {

    // --- 이 부분을 gemini-2.5-flash로 수정했습니다 ---
    private static final String URL =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=";

    @Value("${EUNGYEONG_GEMINI_KEY}")
    private String apiKey;

    public String sendTextTest(String message) {
        try {
            OkHttpClient client = new OkHttpClient();

            MediaType mediaType = MediaType.parse("application/json; charset=utf-8");

            // 💡 요청 JSON 형식: 이스케이프 문제 발생 가능성 있음, JSON 라이브러리 사용 권장
            String json = "{ \"contents\": [{ \"parts\":[{ \"text\":\"" + message + "\" }] }] }";

            RequestBody body = RequestBody.create(mediaType, json);

            Request request = new Request.Builder()
                    .url(URL + apiKey)
                    .post(body)
                    .addHeader("Content-Type", "application/json")
                    .build();

            Response response = client.newCall(request).execute();
            String result = response.body().string();

            return result;

        } catch (Exception e) {
            e.printStackTrace();
            return "ERROR: " + e.getMessage();
        }
    }
}
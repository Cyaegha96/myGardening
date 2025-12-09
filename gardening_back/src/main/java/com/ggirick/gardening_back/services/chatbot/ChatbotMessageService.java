package com.ggirick.gardening_back.services.chatbot;

import com.ggirick.gardening_back.dto.chatbot.ChatbotMessageDTO;
import com.ggirick.gardening_back.mappers.chatbot.ChatbotMessageMapper;
import com.ggirick.gardening_back.utils.FileUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ChatbotMessageService {

    private final ChatbotMessageMapper messageMapper;
    private final FileUtil fileUtil;

    // 사용자 메시지 저장
    @Transactional
    public void saveUserMessage(ChatbotMessageDTO dto, MultipartFile file) throws Exception {
        // 1. file이 있으면 GCP 저장 -> fileInfo 받아서 set 해주기
        if (file != null && !file.isEmpty()) {
            int sessionId = dto.getSessionId();
            // 1-1. 폴더 경로 지정
            String folderPath = "chatbot/" + sessionId + "/";
            // 1-2. sysName, url 받아오기
            Map<String, String> fileInfo = fileUtil.uploadFileAndGetInfo(file.getOriginalFilename(), folderPath, file);
            // 1-3. dto에 set 해주기
            dto.setOriName(fileInfo.get("oriName"));
            dto.setSysName(fileInfo.get("sysName"));
            dto.setUrl(fileInfo.get("url"));
        }
        // 2. DB 저장
        messageMapper.insertMessage(dto);
    }

    // 챗봇 메시지 저장
    @Transactional
    public void saveBotMessage(ChatbotMessageDTO dto) {
        messageMapper.insertMessage(dto);
    }

    // 종료&만료된 세션 대화 기록 삭제
    public void deleteBySessionId(int sessionId) {
        messageMapper.deleteBySessionId(sessionId);
    }

    // 마지막 메시지 시간 조회
    public Timestamp getLastMessageBySessionId(int sessionId) {
        return messageMapper.getLastMessageBySessionId(sessionId).getCreatedAt();
    }
}

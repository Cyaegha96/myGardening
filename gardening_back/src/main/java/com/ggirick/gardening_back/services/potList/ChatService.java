package com.ggirick.gardening_back.services.potList;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ggirick.gardening_back.dto.potList.ChatDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {
    private final RabbitTemplate rabbitTemplate;

    public void sendMessage(ChatDTO chat) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            String objectToJson = objectMapper.writeValueAsString(chat);
            rabbitTemplate.convertAndSend("hello1.exchange", "hello1.key", objectToJson);
        }
        catch (Exception e) {
            log.error("sendMessageError", e);
        }
    }
}
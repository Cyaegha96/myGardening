package com.ggirick.gardening_back.services.potlist;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ggirick.gardening_back.dto.potlist.ChatDTO;
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
            rabbitTemplate.convertAndSend("hello.exchange", "hello.key", objectToJson);
        }
        catch (Exception e) {
            log.error("sendMessageError", e);
        }
    }
}
package com.ggirick.gardening_back.controllers.potlist;

import com.ggirick.gardening_back.dto.potlist.ChatDTO;
import com.ggirick.gardening_back.services.potlist.ChatService;
import com.rabbitmq.client.Channel;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;

@RestController
@RequiredArgsConstructor
@RequestMapping("/chat")
public class ChatController {
    private final ChatService chatService;

    @PostMapping("/send")
    public ResponseEntity<Void> sendMessage(@RequestBody ChatDTO chat) {
        chatService.sendMessage(chat);
        return ResponseEntity.ok().build();
    }

    @RabbitListener(queues = "hello1.queue", ackMode = "MANUAL")
    public void listener(Message msg, Channel channel) throws Exception {
        long tag = msg.getMessageProperties().getDeliveryTag();

        try {
            // 처리 실패 테스트용
//            throw new RuntimeException("Test fail!");
            String body = new String(msg.getBody(), StandardCharsets.UTF_8);
            System.out.println("받은 메시지: " + body);
            channel.basicAck(tag, false);

        } catch (Exception e) {
            // requeue=false 로 DLX로 보내기
            channel.basicNack(tag, false, false);
        }
    }
}

package com.ggirick.gardening_back.consumers.notification;

import com.ggirick.gardening_back.dto.chat.ChatDTO;
import com.ggirick.gardening_back.dto.notification.NotificationDTO;
import com.ggirick.gardening_back.services.chat.ChatService;
import com.ggirick.gardening_back.services.notification.NotificationService;
import com.rabbitmq.client.Channel;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class NotificationRabbitConsumer {
    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationService notificationService;

    @RabbitListener(queues = "notification.queue", ackMode = "MANUAL")
    public void receiveChatMessage(Message message, Channel channel) throws IOException {
        NotificationDTO notification = (NotificationDTO) new Jackson2JsonMessageConverter().fromMessage(message);

        MessageProperties props = message.getMessageProperties();
        long deliveryTag = props.getDeliveryTag();

        // x-death 헤더에서 재시도 횟수 확인
        Map<String, Object> headers = message.getMessageProperties().getHeaders();
        int retryCount = 0;
        if (headers.containsKey("x-death")) {
            List<Map<String, Object>> xDeath = (List<Map<String, Object>>) headers.get("x-death");
            if (!xDeath.isEmpty()) {
                retryCount = ((Long) xDeath.get(0).get("count")).intValue();
            }
        }

        if (retryCount >= 3) {
            System.out.println("메시지 폐기: " + notification);
            channel.basicAck(deliveryTag, false);
            return; // 3회 이상이면 폐기
        }

        List<NotificationDTO> notificationCurrentStateList = notificationService.getNotificationListByUserUid(notification.getUserUid());
        for(NotificationDTO notificationCurrentState: notificationCurrentStateList) {
            if(notificationCurrentState.getId() == notification.getId()) {
                if(notificationCurrentState.getIsRead().equals("Y")) {
                    channel.basicAck(deliveryTag, false);
                    return;
                }
            }
        }

        messagingTemplate.convertAndSend(
                "/topic/notification/" + notification.getUserUid(),
                notification
        );
        channel.basicNack(deliveryTag, false, false);
    }
}

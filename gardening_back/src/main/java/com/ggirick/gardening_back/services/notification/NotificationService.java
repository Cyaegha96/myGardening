package com.ggirick.gardening_back.services.notification;

import com.ggirick.gardening_back.dto.chat.ChatDTO;
import com.ggirick.gardening_back.dto.notification.NotificationDTO;
import com.ggirick.gardening_back.mappers.chat.ChatMapper;
import com.ggirick.gardening_back.mappers.notification.NotificationMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;

import static com.ggirick.gardening_back.config.ChatConfig.MAX_CHAT_HISTORY;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationMapper notificationMapper;

    // 알림 삽입
    public void insertNotification(NotificationDTO notificationInfo){
        notificationMapper.insertNotification(notificationInfo);
    }

    // 알림 읽음 처리
    public void updateIsReadById(int id){
        notificationMapper.updateIsReadById(id);
    }

    // 알림 삭제
    public void deleteNotificationById(int id){
        notificationMapper.deleteNotificationById(id);
    }

    // 사용자에 따른 알림 목록 조회
    public List<NotificationDTO> getNotificationListByUserUid(String userUid){
        return notificationMapper.getNotificationListByUserUid(userUid);
    }
}

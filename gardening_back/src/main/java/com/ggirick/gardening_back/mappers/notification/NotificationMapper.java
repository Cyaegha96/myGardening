package com.ggirick.gardening_back.mappers.notification;

import com.ggirick.gardening_back.dto.notification.NotificationDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface NotificationMapper {
    // 알림 삽입
    public void insertNotification(NotificationDTO notificationInfo);

    // 알림 읽음 처리
    public void updateIsReadById(int id);

    // 알림 삭제
    public void deleteNotificationById(int id);

    // 사용자에 따른 알림 목록 조회
    public List<NotificationDTO> getNotificationListByUserUid(String userUid);
}

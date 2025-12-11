package com.ggirick.gardening_back.controllers.notification;

import com.ggirick.gardening_back.dto.auth.UserTokenDTO;
import com.ggirick.gardening_back.dto.notification.NotificationDTO;
import com.ggirick.gardening_back.services.notification.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notification")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;

    @GetMapping
    public List<NotificationDTO> getUserNotificationList(@AuthenticationPrincipal UserTokenDTO userInfo) {
        return notificationService.getNotificationListByUserUid(userInfo.getUid());
    }

    @PatchMapping("/{id}")
    public void updateNotificationIsReadById(@AuthenticationPrincipal UserTokenDTO userInfo,
                                             @PathVariable int id) {
        if (userInfo != null) {
            List<NotificationDTO> notificationList = notificationService.getNotificationListByUserUid(userInfo.getUid());

            for (NotificationDTO notification : notificationList) {
                if (notification.getUserUid().equals(userInfo.getUid()) && notification.getId() == id) {
                    notificationService.updateIsReadById(id);
                }
            }
        }
    }

    @DeleteMapping("/{id}")
    public void deleteNotificationById(@AuthenticationPrincipal UserTokenDTO userInfo,
                                       @PathVariable int id) {
        if (userInfo != null) {
            List<NotificationDTO> notificationList = notificationService.getNotificationListByUserUid(userInfo.getUid());

            for (NotificationDTO notification : notificationList) {
                if (notification.getUserUid().equals(userInfo.getUid()) && notification.getId() == id) {
                    notificationService.deleteNotificationById(id);
                }
            }
        }
    }
}

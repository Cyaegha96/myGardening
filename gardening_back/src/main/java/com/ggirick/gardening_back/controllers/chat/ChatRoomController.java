package com.ggirick.gardening_back.controllers.chat;

import com.ggirick.gardening_back.dto.auth.UserTokenDTO;
import com.ggirick.gardening_back.dto.chat.ChatRoomDTO;
import com.ggirick.gardening_back.dto.notification.NotificationDTO;
import com.ggirick.gardening_back.dto.potList.PotListDetailDTO;
import com.ggirick.gardening_back.services.auth.UserService;
import com.ggirick.gardening_back.services.chat.ChatProcessService;
import com.ggirick.gardening_back.services.chat.ChatRoomService;
import com.ggirick.gardening_back.services.notification.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/chatRoom")
@RequiredArgsConstructor
public class ChatRoomController {
    private final SimpMessagingTemplate messagingTemplate;
    private final ChatRoomService chatRoomService;
    private final ChatProcessService chatProcessService;
    private final NotificationService notificationService;
    private final UserService userService;

    @Operation(
            summary = "채팅방 목록 조회",
            description = "기존 채팅방 목록을 조회합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공")
    })
    @GetMapping
    public ResponseEntity<List<ChatRoomDTO>> getChatroomList(@AuthenticationPrincipal UserTokenDTO userInfo) {
        if (userInfo != null) {
            return ResponseEntity.ok(chatRoomService.getChatRoomListByUserUid(userInfo.getUid()));
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @Operation(
            summary = "채팅방 생성",
            description = "새로운 채팅방을 생성합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "생성 성공")
    })
    @PostMapping
    public ResponseEntity<Void> insertChatRoom(@AuthenticationPrincipal UserTokenDTO userInfo,
                                               @RequestBody PotListDetailDTO potInfo) {
        if (userInfo != null) {
            int chatroomId = chatProcessService.createChatRoom(potInfo, userInfo.getUid());
            messagingTemplate.convertAndSend(
                    "/topic/chatroom/ack/" + potInfo.getWriterUid(),
                    potInfo.getWriterUid()
            );

            NotificationDTO notification = NotificationDTO.builder()
                    .type("chatroom")
                    .userUid(potInfo.getWriterUid())
                    .message(userService.getUserInfo(userInfo.getUid()).getNickname() + "님이 " + potInfo.getTitle() + "에 대한 채팅방을 생성하였습니다.")
                    .referenceId(chatroomId)
                    .build();
            notificationService.insertNotification(notification);
            messagingTemplate.convertAndSend(
                    "/topic/notification/" + potInfo.getWriterUid(),
                    notification
            );

            return ResponseEntity.status(HttpStatus.CREATED).build();
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
}

package com.ggirick.gardening_back.controllers.chat;

import com.ggirick.gardening_back.dto.auth.UserTokenDTO;
import com.ggirick.gardening_back.dto.chat.ChatDTO;
import com.ggirick.gardening_back.dto.chat.ChatRoomDTO;
import com.ggirick.gardening_back.services.chat.ChatRoomService;
import com.ggirick.gardening_back.services.chat.ChatService;
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

import java.time.OffsetDateTime;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/chatRoom/{roomId}/chat")
@RequiredArgsConstructor
public class ChatController {
    private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatService;
    private final ChatRoomService chatRoomService;

    @Operation(
            summary = "채팅 기록 조회",
            description = "기존 채팅방 기록을 조회합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공")
    })
    @GetMapping
    public ResponseEntity<List<ChatDTO>> getChatHistoryByRoomId(@PathVariable int roomId,
                                                                @RequestParam(required = false) OffsetDateTime cursorId,
                                                                @AuthenticationPrincipal UserTokenDTO userInfo) {
        List<ChatRoomDTO> chatRoomList = chatRoomService.getChatRoomListByUserUid(userInfo.getUid());
        if (chatRoomList.stream().anyMatch(room -> room.getId() == roomId)) {
            List<ChatDTO> chatList = chatService.getChatListByChatRoomId(roomId, cursorId);
            chatService.updateChatIsReadByUserUidAndChatRoomId(roomId, userInfo.getUid());
            // 접속중인 사용자라면 바로 확인 가능 하도록.
            chatList.forEach(chat -> {
                messagingTemplate.convertAndSend(
                        "/topic/chat/ack/" + chat.getChatRoomId(),
                        chat
                );
            });
            return ResponseEntity.ok(chatList);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}

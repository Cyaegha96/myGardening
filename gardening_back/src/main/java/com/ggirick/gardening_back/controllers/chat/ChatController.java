package com.ggirick.gardening_back.controllers.chat;

import com.ggirick.gardening_back.dto.chat.ChatDTO;
import com.ggirick.gardening_back.dto.chat.ChatRoomDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
public class ChatController {
    @Operation(
            summary = "채팅방 목록 조회",
            description = "기존 채팅방 목록을 조회합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공")
    })
    @GetMapping
    public ResponseEntity<List<ChatRoomDTO>> getChatroomList() {
        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "채팅 기록 조회",
            description = "기존 채팅방 기록을 조회합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공")
    })
    @GetMapping("/{roomId}")
    public ResponseEntity<List<ChatDTO>> getChatHistoryByRoomId(@PathVariable int roomId) {
        return ResponseEntity.ok().build();
    }
}

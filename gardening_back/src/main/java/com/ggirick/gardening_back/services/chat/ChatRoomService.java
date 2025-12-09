package com.ggirick.gardening_back.services.chat;

import com.ggirick.gardening_back.dto.chat.ChatRoomDTO;
import com.ggirick.gardening_back.enums.chat.ChatRoomStatus;
import com.ggirick.gardening_back.mappers.chat.ChatRoomMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatRoomService {
    private final ChatRoomMapper chatRoomMapper;

    // 채팅방 생성
    public void insertChatRoom(ChatRoomDTO chatRoomInfo) {
        chatRoomMapper.insertChatRoom(chatRoomInfo);
    }

    // 채팅방 상태 변경
    public void updateChatRoomStatus(ChatRoomStatus status) {
        chatRoomMapper.updateChatRoomStatus(status);
    }

    // 사용자 Uid에 따른 채팅방 목록 조회
    public List<ChatRoomDTO> getChatRoomListByUserUid(String userUid) {
        return chatRoomMapper.getChatRoomListByUserUid(userUid);
    }
}

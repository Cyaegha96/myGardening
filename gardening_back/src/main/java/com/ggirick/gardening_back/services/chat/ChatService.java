package com.ggirick.gardening_back.services.chat;

import com.ggirick.gardening_back.dto.chat.ChatDTO;
import com.ggirick.gardening_back.mappers.chat.ChatMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.ggirick.gardening_back.config.ChatConfig.MAX_CHAT_HISTORY;

@Service
@RequiredArgsConstructor
public class ChatService {
    private ChatMapper chatMapper;

    // 채팅 기록
    public void insertChat(ChatDTO chatInfo) {
        chatMapper.insertChat(chatInfo);
    }

    // 채팅방에 따른 채팅 조회
    public List<ChatDTO> getChatListByChatRoomId(int chatRoomId, int cursorId) {
        return chatMapper.getChatListByChatRoomId(chatRoomId, cursorId, MAX_CHAT_HISTORY);
    }

    // 채팅방에 따른 사용자가 작성자가 아닌 채팅 읽음 처리
    public void updateChatIsReadByUserUidAndChatRoomId(int chatRoomId, String userUid) {
        chatMapper.updateChatIsReadByUserUidAndChatRoomId(chatRoomId, userUid);
    }
}

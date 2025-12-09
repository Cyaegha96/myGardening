package com.ggirick.gardening_back.services.chat;

import com.ggirick.gardening_back.mappers.chat.ChatRoomParticipantsMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatRoomParticipantsService {
    private final ChatRoomParticipantsMapper chatRoomParticipantsMapper;

    public void insertParticipant(int chatRoomId, String userUid) {
        chatRoomParticipantsMapper.insertParticipant(chatRoomId, userUid);
    }
}

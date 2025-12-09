package com.ggirick.gardening_back.services.chat;

import com.ggirick.gardening_back.dto.chat.ChatRoomDTO;
import com.ggirick.gardening_back.dto.potList.PotListDetailDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ChatProcessService {
    private final ChatRoomService chatRoomService;
    private final ChatRoomParticipantsService chatRoomParticipantsService;

    @Transactional
    public void createChatRoom(PotListDetailDTO potInfo, String userUid) {
        int chatRoomId = chatRoomService.insertChatRoom(ChatRoomDTO.builder()
                .potListingId(potInfo.getId())
                .build());

        chatRoomParticipantsService.insertParticipant(chatRoomId, potInfo.getWriterUid());
        chatRoomParticipantsService.insertParticipant(chatRoomId, userUid);
    }
}

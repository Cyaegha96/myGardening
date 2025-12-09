package com.ggirick.gardening_back.mappers.chat;

import com.ggirick.gardening_back.dto.chat.ChatDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.OffsetDateTime;
import java.util.List;

@Mapper
public interface ChatMapper {
    // 채팅 기록
    void insertChat(ChatDTO chatInfo);

    // 채팅방에 따른 채팅 조회
    List<ChatDTO> getChatListByChatRoomId(@Param("chatRoomId") int chatRoomId,
                                          @Param("cursorId") OffsetDateTime cursorId,
                                          @Param("limit") int limit);

    // 특정 채팅 기록 조회
    ChatDTO getChatById(long id);

    // 채팅방에 따른 사용자가 작성자가 아닌 채팅 읽음 처리
    void updateChatIsReadByUserUidAndChatRoomId(@Param("chatRoomId") int chatRoomId,
                                                @Param("userUid") String userUid);

    // 채팅 읽음 처리
    void updateChatIsReadById(long id);
}

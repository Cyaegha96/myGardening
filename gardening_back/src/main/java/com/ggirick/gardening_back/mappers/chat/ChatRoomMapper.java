package com.ggirick.gardening_back.mappers.chat;

import com.ggirick.gardening_back.dto.chat.ChatRoomDTO;
import com.ggirick.gardening_back.enums.chat.ChatRoomStatus;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ChatRoomMapper {
    // 채팅방 생성
    public void insertChatRoom(ChatRoomDTO chatRoomInfo);

    // 채팅방 상태 변경
    public void updateChatRoomStatus(@Param("status") ChatRoomStatus status,
                                     @Param("id") int chatRoomId);

    // 사용자 Uid에 따른 채팅방 목록 조회
    public List<ChatRoomDTO> getChatRoomListByUserUid(String userUid);
}

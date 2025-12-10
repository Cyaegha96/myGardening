package com.ggirick.gardening_back.mappers.chat;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ChatRoomParticipantsMapper {
    // 채팅방 참여자 삽입
    public void insertParticipant(@Param("chatRoomId") int chatRoomId,
                                  @Param("userUid") String userUid);
}

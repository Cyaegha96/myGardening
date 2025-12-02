package com.ggirick.gardening_back.mappers.potList;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface PotListBookmarkMapper {
    // 분양글 찜
    int bookmarkPot(@Param("id") String id, @Param("userUid") String userUid);

    // 분양글 찜 해제
    int unBookmarkPot(@Param("id") String id, @Param("userUid") String userUid);
}

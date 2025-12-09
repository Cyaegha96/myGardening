package com.ggirick.gardening_back.mappers.potList;

import com.ggirick.gardening_back.dto.potList.PotListDetailDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PotListBookmarkMapper {
    // 분양글 찜
    void bookmarkPot(@Param("id") int id, @Param("userUid") String userUid);

    // 분양글 찜 해제
    void unBookmarkPot(@Param("id") int id, @Param("userUid") String userUid);

    // 사용자에 따른 찜 목록 조회
    List<PotListDetailDTO> getBookmarksByUserId(@Param("userUid") String userUid);
}

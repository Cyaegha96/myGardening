package com.ggirick.gardening_back.mappers.potList;

import com.ggirick.gardening_back.dto.potList.PotListDetailDTO;
import com.ggirick.gardening_back.dto.potList.PotListInsertDTO;
import com.ggirick.gardening_back.dto.potList.PotListPatchDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PotListMapper {
    // 분양글 목록 조회
    List<PotListDetailDTO> getPotList(
            @Param("cursorId") Integer cursorId,
            @Param("size") Integer size,
            @Param("keyword") String keyword,
            @Param("tagIds") List<Integer> tagIds
    );

    // 분양글 상세 조회
    PotListDetailDTO getPotById(@Param("id") int id);

    // 분양글 작성
    int insertPot(PotListInsertDTO insertInfo);

    // 분양글 수정
    // 분양글 끌어올리기(bump == true)
    // 분양글 조회수 증가(addViewCount == true)
    int updatePotById(PotListPatchDTO patchInfo, @Param("addViewCount") boolean addViewCount, @Param("bump") boolean bump);

    // 분양글 삭제
    int deletePotById(@Param("id") int id);
}

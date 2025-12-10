package com.ggirick.gardening_back.mappers.potList;

import com.ggirick.gardening_back.dto.potList.PotListDetailDTO;
import com.ggirick.gardening_back.dto.potList.PotListInsertDTO;
import com.ggirick.gardening_back.dto.potList.PotListPatchDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;

@Mapper
public interface PotListMapper {
    // 분양글 목록 조회
    List<PotListDetailDTO> getPotList(
            @Param("cursorId") OffsetDateTime cursorId,
            @Param("size") Integer size,
            @Param("keyword") String keyword,
            @Param("type") String searchType,
            @Param("tagIds") List<Integer> tagIds,
            @Param("location") String location
    );

    // 사용자 Uid를 통한 분양글 목록 조회
    List<PotListDetailDTO> getPotByUserId(@Param("id") String userUid, @Param("limit") long limit);

    // 분양글 상세 조회
    PotListDetailDTO getPotById(@Param("id") int id);

    // 분양글 작성
    int insertPot(PotListInsertDTO insertInfo);

    // 분양글 다음 시퀀스 번호 조회
    int getPotListSeqNextVal();

    // 분양글 수정
    // 분양글 끌어올리기(bump == true)
    // 분양글 조회수 증가(addViewCount == true)
    int updatePotById(@Param("patchInfo") PotListPatchDTO patchInfo, @Param("addViewCount") boolean addViewCount, @Param("bump") boolean bump);

    // 분양글 삭제
    int deletePotById(@Param("id") int id);
}

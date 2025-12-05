package com.ggirick.gardening_back.mappers.myPlant;

import com.ggirick.gardening_back.dto.myPlant.MyPlantDTO;
import com.ggirick.gardening_back.dto.myPlant.MyPlantResponseDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface MyPlantMapper {

    // 새로운 식물 등록
    void insert(MyPlantDTO dto);

    // 식물 정보 수정
    void update(MyPlantDTO dto);

    // 등록한 식물 정보 삭제
    void delete(int userPlantId);

    // 목록 조회 - 이미지 1장
    List<MyPlantResponseDTO> getListByUserUid(String userUid);

    // 단건 기본정보 조회 (상세 용)
    MyPlantResponseDTO getByPlantId(int userPlantId);

    // 권한체크용 userPlantId → ownerUid 조회
    String getOwnerUidByPlantId(int userPlantId);
}

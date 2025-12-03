package com.ggirick.gardening_back.mappers.myPlant;

import com.ggirick.gardening_back.dto.myPlant.MyPlantDiaryImageDTO;
import com.ggirick.gardening_back.dto.myPlant.MyPlantDiaryImageResponseDTO;
import com.ggirick.gardening_back.dto.myPlant.MyPlantImageDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MyPlantDiaryImageMapper {
    // 등록한 식물의 대표 이미지 조회
    List<MyPlantDiaryImageDTO> getImageByPlantId(int userPlantId);

    // imageId로 대표 이미지 조회
    MyPlantDiaryImageDTO getImageById(int imageId);

    // 이미지 등록
    void insert(MyPlantDiaryImageDTO dto);

    // 개별 이미지 삭제
    void deleteByImageId(int imageId);

    // 다이어리 id로 이미지 삭제
    void deleteByDiaryId(int diaryId);

    // 중복 이미지 존재 여부 조회 (유저별)
    MyPlantDiaryImageResponseDTO findByHashAndUserUid(@Param("hash") String hash,
                                                      @Param("loginUid") String loginUid);
}

package com.ggirick.gardening_back.mappers.myPlant;

import com.ggirick.gardening_back.dto.myPlant.MyPlantImageDTO;
import com.ggirick.gardening_back.dto.myPlant.MyPlantImageResponseDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface MyPlantImageMapper {
    // 등록한 식물의 대표 이미지 조회
    MyPlantImageDTO getImageByPlantId(int userPlantId);

    // imageId로 대표 이미지 조회
    MyPlantImageDTO getImageById(int imageId);

    // 이미지 등록
    void insert(MyPlantImageDTO dto);

    // 대표 이미지 삭제
    void delete(int imageId);

    // 중복 이미지 존재 여부 조회 (유저별)
    MyPlantImageResponseDTO findByHashAndUserUid(@Param("hash") String hash,
                                                 @Param("loginUid") String loginUid);
}

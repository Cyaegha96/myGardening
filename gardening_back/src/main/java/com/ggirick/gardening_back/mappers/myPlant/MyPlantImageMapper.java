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
    MyPlantImageResponseDTO getImageById(int imageId);

    // 이미지 등록
    void insert(MyPlantImageDTO dto);

    // 대표 이미지 삭제
    void delete(int imageId);

    // 대표 이미지 변경
    int update(MyPlantImageDTO dto);

    // 권한 체크용 - 식물 등록자가 맞는지
    String getOwnerUidByPlantImageId(int imageId);

    // 권한 체크용 - 해당 식물의 이미지인지
    int validateImageBelongsToPlant(@Param("imageId") int imageId,
                                       @Param("userPlantId") int userPlantId);

}

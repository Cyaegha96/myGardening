package com.ggirick.gardening_back.mappers.myPlant.diary;

import com.ggirick.gardening_back.dto.myPlant.diary.MyPlantDiaryImageDTO;
import com.ggirick.gardening_back.dto.myPlant.diary.MyPlantDiaryImageResponseDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MyPlantDiaryImageMapper {
    // 등록한 식물의 모든 다이어리 이미지 조회
    List<MyPlantDiaryImageDTO> getImagesByPlantId(int userPlantId);

    // imageId로 이미지 조회
    MyPlantDiaryImageDTO getImageById(int imageId);

    // diaryId로 이미지 조회
    MyPlantDiaryImageDTO getImageByDiaryId(int diaryId);

    // 이미지 등록
    void insert(MyPlantDiaryImageDTO dto);

    // 이미지 수정
    void update(MyPlantDiaryImageDTO dto);

    // imageId로 개별 이미지 삭제
    void deleteByImageId(int imageId);

    // diaryId로 이미지 삭제
    void deleteByDiaryId(int diaryId);

    // 권한 체크용 - 해당 식물의 등록자인지
    String getOwnerUidByDiaryImageId(int imageId);

    // 권한 체크용 - 해당 식물의 이미지인지
    int validateDiaryImageBelongsToPlant(@Param("imageId") int imageId,
                                    @Param("userPlantId") int userPlantId);


}

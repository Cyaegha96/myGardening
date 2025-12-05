package com.ggirick.gardening_back.dto.myPlant.diary;

import com.ggirick.gardening_back.enums.WeatherType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(name = "MyPlantDiaryDTO", description = "식물 다이어리 기록 entity DTO")
public class MyPlantDiaryDTO {

    @Schema(description = "다이어리 고유 번호", example = "1")
    private int diaryId;

    @Schema(description = "유저 식물 고유 번호", example = "10")
    private int userPlantId;

    @Schema(description = "다이어리 내용", example = "햇빛을 잘 받아서 그런지 잎이 많이 자랐습니다.")
    private String content;

    @Schema(description = "날씨 정보", example = "SUNNY/CLOUDY/RAINY/SNOWY")
    private WeatherType weather;

    @Schema(description = "등록일자", example = "2025-01-20 14:30:00")
    private Timestamp createdAt;

    @Schema(description = "수정일자", example = "2025-01-20 14:30:00")
    private Timestamp updatedAt;
}


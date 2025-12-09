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
@Schema(name = "MyPlantDiaryResponseDTO", description = "식물 다이어리 + 이미지 Response DTO")
public class MyPlantDiaryResponseDTO {

    @Schema(description = "다이어리 고유 번호", example = "3")
    private int diaryId;

    @Schema(description = "유저 식물 고유 번호", example = "9")
    private int userPlantId;

    @Schema(description = "다이어리 내용", example = "오늘은 잎사귀가 좀 처졌음")
    private String content;

    @Schema(description = "날씨 정보", nullable = true, example = "SUNNY")
    private WeatherType weather;

    @Schema(description = "등록일시", example = "2025-12-08 12:34:56")
    private Timestamp createdAt;

    @Schema(description = "수정일시", nullable = true, example = "2025-12-08 15:21:12")
    private Timestamp updatedAt;

    @Schema(description = "다이어리 이미지 URL", nullable = true, example = "https://bucket/image.jpg")
    private String imageUrl;
}

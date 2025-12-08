package com.ggirick.gardening_back.dto.myPlant.diary;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(name = "MyPlantDiaryDTO", description = "식물 다이어리 기록 요청 DTO")
public class MyPlantDiaryRequestDTO {
    @Schema(description = "유저 식물 고유 번호", example = "10")
    private int userPlantId;

    @Schema(description = "다이어리 내용", example = "햇빛을 잘 받아서 그런지 잎이 많이 자랐습니다.")
    private String content;

    @Schema(description = "날씨 정보", example = "맑음 / 흐림 / 비 / 눈")
    private String weather;
}

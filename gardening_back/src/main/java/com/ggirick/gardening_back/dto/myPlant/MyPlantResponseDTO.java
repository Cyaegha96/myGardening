package com.ggirick.gardening_back.dto.myPlant;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(name = "MyPlantResponseDTO", description = "식물 기본 조회 DTO")
public class MyPlantResponseDTO {

    @Schema(description = "유저 식물 고유 ID", example = "10")
    private int userPlantId;

    @Schema(description = "소유자 UID", example = "eun")
    private String userUid;

    @Schema(description = "식물 학명", example = "Sansevieria stuckyi")
    private String plant_scientific_name;

    @Schema(description = "식물 일반 명 (common name)", example = "Snake Plant")
    private String commonName;

    @Schema(description = "식물 별명", example = "노랑이")
    private String nickname;

    @Schema(description = "식물 메모", example = "생일날 만난 노랑이")
    private String memo;

    @Schema(description = "획득일/키우기 시작한 날짜", example = "2025-01-20 00:00:00")
    private Timestamp acquiredAt;

    @Schema(description = "식물 상태", example = "healthy / dry / sick")
    private String status;

    @Schema(description = "대표 이미지 URL", example = "https://storage.googleapis.com/.../plant.jpg")
    private String url;
}


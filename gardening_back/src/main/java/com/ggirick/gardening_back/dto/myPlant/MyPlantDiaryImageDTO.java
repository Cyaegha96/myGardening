package com.ggirick.gardening_back.dto.myPlant;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(name = "MyPlantDiaryImageDTO", description = "식물 다이어리 이미지 DTO")
public class MyPlantDiaryImageDTO {

    @Schema(description = "이미지 고유 번호", example = "1")
    private int imageId;

    @Schema(description = "다이어리 고유 번호", example = "3")
    private int diaryId;

    @Schema(description = "원본 파일명", example = "plant_diary.jpg")
    private String oriName;

    @Schema(description = "서버 저장용 파일명", example = "uuid_plant_diary.jpg")
    private String sysName;

    @Schema(description = "스토리지 public url", example = "https://storage.googleapis.com/.../uuid_plant_diary.jpg")
    private String url;

    @Schema(description = "이미 중복 체크용 해시", example = "sha256")
    private String hash;

    @Schema(description = "등록일자", example = "2025-01-20 10:00:00")
    private Timestamp createdAt;
}

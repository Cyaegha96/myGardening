package com.ggirick.gardening_back.dto.myPlant;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MyPlantImageDTO {
    @Schema(description = "이미지 고유 번호", example = "1")
    private int imageId;

    @Schema(description = "식물 고유 번호", example = "1")
    private int userPlantId;

    @Schema(description = "원본 파일명", example = "노랑이.png")
    private String oriName;

    @Schema(description = "서버저장용 파일명", example = "노랑이2e2e2e.png")
    private String sysName;

    @Schema(description = "스토리지 public url", example = "https://...노랑이2e2e2e.png")
    private String url;

    @Schema(description = "이미 중복 체크용 해시", example = "sha256")
    private String hash;

    @Schema(description = "등록일자", example = "yyyy-MM-dd HH:mm:ss")
    private Timestamp createdAt;
    @Schema(description = "수정일자", example = "yyyy-MM-dd HH:mm:ss")
    private Timestamp updatedAt;
}

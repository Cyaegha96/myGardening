package com.ggirick.gardening_back.dto.myPlant;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MyPlantDiaryImageResponseDTO {
    @Schema(description = "이미지 고유 번호", example = "1")
    private int imageId;

    @Schema(description = "스토리지 public url", example = "https://...노랑이2e2e2e.png")
    private String url;
}

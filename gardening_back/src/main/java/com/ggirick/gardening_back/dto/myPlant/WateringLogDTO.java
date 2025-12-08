package com.ggirick.gardening_back.dto.myPlant;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(name = "WateringLogDTO", description = "물주기 기록 DTO")
public class WateringLogDTO {

    @Schema(description = "물주기 고유 번호", example = "1")
    private int wateringId;

    @Schema(description = "유저 식물 고유 번호", example = "10")
    private int userPlantId;

    @Schema(description = "물 준 날짜/시간", example = "2025-01-20 08:15:00")
    private Timestamp wateredAt;
}

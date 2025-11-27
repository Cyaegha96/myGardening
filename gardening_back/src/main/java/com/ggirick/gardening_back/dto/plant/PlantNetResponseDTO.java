package com.ggirick.gardening_back.dto.plant;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Pl@ntNet 최소 응답 DTO - bestMatch 학명만 사용")
public class PlantNetResponseDTO {
    @Schema(description = "가장 유력한 식물 학명", example = "Monstera deliciosa")
    private String scientificName;
}
package com.ggirick.gardening_back.dto.myPlant;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.sql.Timestamp;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MyPlantImageHistoryResponseDTO {

    @Schema(description = "이미지 히스토리 고유 ID", example = "3")
    private Integer imageHistoryId;

    @Schema(description = "식물 고유 번호", example = "15")
    private Integer userPlantId;

    @Schema(description = "히스토리 이미지 URL", example = "https://storage.googleapis.com/.../myplant/3/diary/10/norang.png")
    private String url;

    @Schema(description = "등록일자", example = "2025-12-08 15:27:11")
    private Timestamp createdAt;

    public static MyPlantImageHistoryResponseDTO of(MyPlantImageHistoryDTO dto) {
        if (dto == null) return null;
        return MyPlantImageHistoryResponseDTO.builder()
                .imageHistoryId(dto.getImageHistoryId())
                .userPlantId(dto.getUserPlantId())
                .url(dto.getUrl())
                .createdAt(dto.getCreatedAt())
                .build();
    }

    public static List<MyPlantImageHistoryResponseDTO> ofList(List<MyPlantImageHistoryDTO> list) {
        return list.stream()
                .map(MyPlantImageHistoryResponseDTO::of)
                .toList();
    }
}

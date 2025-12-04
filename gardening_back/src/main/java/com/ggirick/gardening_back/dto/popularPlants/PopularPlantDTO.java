package com.ggirick.gardening_back.dto.popularPlants;

import com.ggirick.gardening_back.dto.tag.PlantTagDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PopularPlantDTO {
    private String scientificName;
    private String commonName;
    private String sampleImageUrl;
    private Integer count;  // 등록 횟수
    private List<PlantTagDTO> tags;
}

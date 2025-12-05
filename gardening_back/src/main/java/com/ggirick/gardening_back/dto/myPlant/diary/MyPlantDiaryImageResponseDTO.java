package com.ggirick.gardening_back.dto.myPlant.diary;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

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

    // entity -> response로 변환
    public static MyPlantDiaryImageResponseDTO of(MyPlantDiaryImageDTO dto) {
        return new MyPlantDiaryImageResponseDTO(
                dto.getImageId(),
                dto.getUrl()
        );
    }

    public static List<MyPlantDiaryImageResponseDTO> ofList(List<MyPlantDiaryImageDTO> list) {
        List<MyPlantDiaryImageResponseDTO> result = new ArrayList<>();
        for (MyPlantDiaryImageDTO dto : list) {
            result.add(of(dto));
        }
        return result;
    }

}

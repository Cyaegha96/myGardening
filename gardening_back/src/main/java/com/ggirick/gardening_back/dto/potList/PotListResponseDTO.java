package com.ggirick.gardening_back.dto.potList;


import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PotListResponseDTO {
    @Schema(description = "분양글 상세 내용")
    PotListDetailDTO potListDetailDTO;
    @Schema(description = "이미지 목록")
    List<PotListImageDTO> potListImageDTOList;
    @Schema(description = "작성자의 다른 분양글 목록")
    List<PotListDetailDTO> otherPotList;
}

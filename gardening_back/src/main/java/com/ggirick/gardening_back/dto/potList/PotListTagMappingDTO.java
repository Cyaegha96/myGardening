package com.ggirick.gardening_back.dto.potList;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PotListTagMappingDTO {
    @Schema(description = "시퀀스")
    int id;
    @Schema(description = "분양글 ID")
    int potListingId;
    @Schema(description = "태그 ID")
    int plantTagId;
}

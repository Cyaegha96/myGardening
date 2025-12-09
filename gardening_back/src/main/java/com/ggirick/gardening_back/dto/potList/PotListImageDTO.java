package com.ggirick.gardening_back.dto.potList;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PotListImageDTO {
    @Schema(description = "시퀀스")
    int id;
    @Schema(description = "파일 공개 url")
    String url;
}

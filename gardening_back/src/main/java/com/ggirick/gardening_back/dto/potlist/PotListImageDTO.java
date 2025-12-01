package com.ggirick.gardening_back.dto.potlist;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PotListImageDTO {
    @Schema(description = "시퀀스")
    int id;
    @Schema(description = "부모 분양글 id")
    int potListingId;
    @Schema(description = "파일 원본 이름")
    String oriName;
    @Schema(description = "파일 저장 이름(UUID포함)")
    String sysName;
    @Schema(description = "파일 저장 경로(gcp storage)")
    String url;
    @Schema(description = "생성일")
    Timestamp createdAt;
}

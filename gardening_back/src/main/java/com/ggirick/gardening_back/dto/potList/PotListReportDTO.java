package com.ggirick.gardening_back.dto.potList;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PotListReportDTO {
    @Schema(description = "시퀀스")
    int id;
    @Schema(description = "신고 분양글 id")
    int potListingId;
    @Schema(description = "신고자 id")
    String reporterUid;
    @Schema(description = "신고 사유")
    String reason;
    @Schema(description = "처리 상태")
    String status;
    @Schema(description = "생성일")
    Timestamp createdAt;
}
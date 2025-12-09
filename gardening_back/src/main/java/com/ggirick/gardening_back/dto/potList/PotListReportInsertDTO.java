package com.ggirick.gardening_back.dto.potList;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PotListReportInsertDTO {
    @Schema(description = "신고 분양글 id")
    int potListingId;
    @Schema(description = "신고자 id")
    String reporterUid;
    @Schema(description = "신고 사유")
    String reason;
}
package com.ggirick.gardening_back.dto.report;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReportResponse {

    private Long id;
    private String reason;
    private String reporterUid;
    private String status;
    private Long targetId;
    private String targetType;


}

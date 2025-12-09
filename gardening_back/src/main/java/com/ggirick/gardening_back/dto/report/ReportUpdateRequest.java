package com.ggirick.gardening_back.dto.report;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReportUpdateRequest {

    @NotBlank(message = "상태 값은 필수입니다.")
    private String status;

    private String reason; // optional
}
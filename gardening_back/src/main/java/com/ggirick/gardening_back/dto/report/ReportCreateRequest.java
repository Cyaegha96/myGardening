package com.ggirick.gardening_back.dto.report;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReportCreateRequest {

    @NotNull(message = "요청 대상 id는 필수입니다.")
    Long targetId;
    @Pattern(
            regexp = "^(board|board_comment)$",
            message = "targetType은 board 또는 board_comment만 가능합니다."
    )
    @NotBlank(message = "타입 내용은 필수입니다.")
     String targetType;
    @NotBlank(message = "이유는 필수입니다.")
    String reason;

}

package com.ggirick.gardening_back.dto.report;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlantInfoRequestCreateRequest {
    @NotBlank(message = "학명은 필수입니다.")
    String scientificName;
    @NotBlank(message = "변경 요청 내용은 필수입니다.")
    String changes;
}

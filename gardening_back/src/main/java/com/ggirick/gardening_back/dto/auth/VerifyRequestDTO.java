package com.ggirick.gardening_back.dto.auth;

import lombok.Data;

@Data
public class VerifyRequestDTO {
    private String email;
    private String code;
}

package com.ggirick.gardening_back.dto.auth;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LogoutRequestDTO {

    //로그인한 사용자의 refreshToken
    private String refreshToken;
    //로그인한 사용자의 accessToken
    private String accessToken;
}

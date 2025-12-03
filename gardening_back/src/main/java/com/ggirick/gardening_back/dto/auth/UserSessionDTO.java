package com.ggirick.gardening_back.dto.auth;

import lombok.*;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSessionDTO {
    private String sessionId;
    private String userUid;
    private String provider;
    private String refreshToken;
    private String accessToken;
    private Date lastAccessTokenIssuedAt;
    private Date lastAccessTokenExpiresAt;
    private Date expiresAt;
    private String ipAddress;
    private String isRevoked;
    private  Date createdAt;
}

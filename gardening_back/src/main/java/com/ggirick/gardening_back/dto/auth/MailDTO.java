package com.ggirick.gardening_back.dto.auth;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MailDTO {
    private String to;        // 받는 사람 이메일
    private String subject;   // 제목
    private String message;   // 본문 내용
    private String code;      // 인증코드(선택)
}
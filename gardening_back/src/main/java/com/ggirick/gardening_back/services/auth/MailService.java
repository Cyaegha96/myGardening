package com.ggirick.gardening_back.services.auth;

import com.ggirick.gardening_back.dto.auth.MailDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import jakarta.mail.Message;
import jakarta.mail.internet.MimeMessage;

import java.util.UUID;
@Service
@RequiredArgsConstructor
public class MailService {

    private final JavaMailSender javaMailSender;
    private final RedisService redisService;

    private MimeMessage createMessage(MailDTO mailDTO) throws Exception {
        MimeMessage message = javaMailSender.createMimeMessage();

        message.addRecipients(Message.RecipientType.TO, mailDTO.getTo());
        message.setSubject(mailDTO.getSubject());
        message.setText(mailDTO.getMessage());
        message.setFrom("wlvkddl808@naver.com");

        return message;
    }

    public void send(MailDTO mailDTO) throws Exception {
        try {
            MimeMessage mimeMessage = createMessage(mailDTO);
            javaMailSender.send(mimeMessage);
        } catch (MailException ex) {
            ex.printStackTrace();
            throw new IllegalAccessException("메일 전송 실패");
        }
    }

    public String sendCertificationMail(String email) throws Exception {
        try {
            String code = UUID.randomUUID().toString().substring(0, 6);

            MailDTO mailDTO = MailDTO.builder()
                    .to(email)
                    .subject("MyGardening 인증 번호입니다.")
                    .message("이메일 인증코드: " + code)
                    .code(code)
                    .build();

            send(mailDTO);

            redisService.setDataExpire(code, email, 60 * 5L);

            return code;
        } catch (Exception e) {
            throw new Exception("인증 메일 전송 중 오류: " + e.getMessage());
        }
    }

    public boolean verifyCertificationCode(String email, String code) {

        String redisEmail = redisService.getData(code);

        // 저장되지 않은 코드
        if (redisEmail == null) {
            return false;
        }

        // 자신에게 발급된 코드가 아니면 실패
        if (!redisEmail.equals(email)) {
            return false;
        }

        // 1회성: 성공 시 Redis에서 삭제
        redisService.deleteData(code);

        return true;
    }

    public void sendTempPasswordMail(String email, String tempPassword) throws Exception {
        try {
            MailDTO mailDTO = MailDTO.builder()
                    .to(email)
                    .subject("MyGardening 신규 비밀번호 발급용 otp 안내")
                    .message(
                            "신규 비밀번호 발급용 otp는 아래와 같습니다.\n\n" +
                                    tempPassword + "\n\n" +
                                    "3분 안에 otp를 입력하고 신규 비밀번호를 발급받으세요."
                    )
                    .code(tempPassword)
                    .build();

            send(mailDTO);

        } catch (Exception e) {
            throw new Exception("otp 메일 전송 중 오류: " + e.getMessage());
        }
    }

}

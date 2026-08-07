package com.pharmai.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.Objects;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendVerificationEmail(String toEmail, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            if (fromEmail == null || fromEmail.isBlank()) {
                throw new RuntimeException("Email cấu hình chưa được thiết lập (spring.mail.username)");
            }
            helper.setFrom(Objects.requireNonNull(fromEmail), "PharmAI - Nhà thuốc Thông minh");

            if (toEmail == null || toEmail.isBlank()) {
                throw new IllegalArgumentException("Địa chỉ email người nhận không được để trống");
            }
            helper.setTo(toEmail);
            helper.setSubject("PharmAI - Mã xác thực OTP đăng ký tài khoản");

            String htmlContent = """
                    <!DOCTYPE html>
                    <html lang="vi">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Xác thực tài khoản PharmAI</title>
                    </head>
                    <body style="margin:0;padding:0;background-color:#f4f6f9;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
                        <table width="100%%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9;padding:40px 0;">
                            <tr>
                                <td align="center">
                                    <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                                        <!-- Header -->
                                        <tr>
                                            <td style="background:linear-gradient(135deg,#22c55e 0%%,#16a34a 100%%);padding:32px 40px;text-align:center;">
                                                <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:700;letter-spacing:-0.5px;">💊 PharmAI</h1>
                                                <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:14px;">Hệ thống Nhà thuốc Thông minh</p>
                                            </td>
                                        </tr>
                                        <!-- Body -->
                                        <tr>
                                            <td style="padding:40px;">
                                                <h2 style="color:#1a1a2e;margin:0 0 12px;font-size:22px;">Xác thực tài khoản của bạn</h2>
                                                <p style="color:#6b7280;margin:0 0 28px;font-size:15px;line-height:1.6;">
                                                    Chào bạn! Cảm ơn bạn đã đăng ký tài khoản tại <strong>PharmAI</strong>.<br>
                                                    Vui lòng sử dụng mã OTP dưới đây để kích hoạt tài khoản:
                                                </p>
                                                <!-- OTP Box -->
                                                <div style="background:linear-gradient(135deg,#f0fdf4 0%%,#dcfce7 100%%);border:2px dashed #22c55e;border-radius:12px;padding:28px;text-align:center;margin:0 0 28px;">
                                                    <p style="color:#16a34a;margin:0 0 8px;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">MÃ XÁC THỰC OTP</p>
                                                    <p style="color:#15803d;margin:0;font-size:48px;font-weight:800;letter-spacing:12px;font-family:monospace;">%s</p>
                                                </div>
                                                <!-- Warning -->
                                                <div style="background:#fef9c3;border-left:4px solid #eab308;border-radius:0 8px 8px 0;padding:14px 16px;margin:0 0 28px;">
                                                    <p style="color:#92400e;margin:0;font-size:13px;line-height:1.5;">
                                                        ⚠️ <strong>Lưu ý bảo mật:</strong> Mã OTP này có hiệu lực trong <strong>10 phút</strong>. 
                                                        Vui lòng không chia sẻ mã này với bất kỳ ai, kể cả nhân viên PharmAI.
                                                    </p>
                                                </div>
                                                <p style="color:#9ca3af;margin:0;font-size:13px;line-height:1.6;">
                                                    Nếu bạn không thực hiện yêu cầu đăng ký này, vui lòng bỏ qua email này.<br>
                                                    Tài khoản chưa xác thực sẽ tự động bị xóa sau 24 giờ.
                                                </p>
                                            </td>
                                        </tr>
                                        <!-- Footer -->
                                        <tr>
                                            <td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb;text-align:center;">
                                                <p style="color:#9ca3af;margin:0;font-size:12px;">
                                                    © 2024 PharmAI. Mọi quyền được bảo lưu.<br>
                                                    Email này được gửi tự động, vui lòng không trả lời.
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </body>
                    </html>
                    """.formatted(otp);

            helper.setText(htmlContent, true);
            mailSender.send(message);
            System.out.println("[EmailService] OTP sent successfully to: " + toEmail);

        } catch (MessagingException e) {
            System.err.println("[EmailService] Failed to send email to: " + toEmail + " - " + e.getMessage());
            throw new RuntimeException("Không thể gửi email xác thực. Vui lòng thử lại sau.", e);
        } catch (Exception e) {
            System.err.println("[EmailService] Unexpected error: " + e.getMessage());
            throw new RuntimeException("Lỗi gửi email: " + e.getMessage(), e);
        }
    }
}

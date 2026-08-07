package com.pharmai.backend.controller;

import com.pharmai.backend.model.User;
import com.pharmai.backend.repository.UserRepository;
import com.pharmai.backend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email và mật khẩu không được trống"));
        }

        Optional<User> userOpt = userRepository.findByEmail(email.trim());
        
        if (userOpt.isEmpty() || !userOpt.get().getPassword().equals(password)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Email hoặc mật khẩu không đúng"));
        }

        User user = userOpt.get();
        if (user.getEnabled() == null || !user.getEnabled()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Tài khoản chưa được kích hoạt. Vui lòng xác thực email.", "email", user.getEmail()));
        }

        Map<String, Object> data = new HashMap<>();
        data.put("user", user);
        data.put("token", "springboot-jwt-token-" + user.getId() + "-" + System.currentTimeMillis());

        Map<String, Object> response = new HashMap<>();
        response.put("data", data);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> userData) {
        String name = userData.get("name");
        String email = userData.get("email");
        String phone = userData.get("phone");
        String password = userData.get("password");

        if (name == null || email == null || phone == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Vui lòng nhập đầy đủ thông tin đăng ký"));
        }

        String trimmedEmail = email.trim();
        Optional<User> existingUserOpt = userRepository.findByEmail(trimmedEmail);

        User userToSave;
        if (existingUserOpt.isPresent()) {
            User existingUser = existingUserOpt.get();
            if (existingUser.getEnabled() != null && existingUser.getEnabled()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("message", "Email này đã được đăng ký sử dụng"));
            } else {
                // If user is registered but not enabled, reuse the user entity
                userToSave = existingUser;
                userToSave.setName(name.trim());
                userToSave.setPhone(phone.trim());
                userToSave.setPassword(password);
            }
        } else {
            userToSave = new User();
            userToSave.setName(name.trim());
            userToSave.setEmail(trimmedEmail);
            userToSave.setPhone(phone.trim());
            userToSave.setPassword(password);
        }

        // Generate 6-digit OTP code
        String otp = String.format("%06d", (int) (Math.random() * 1000000));
        userToSave.setVerificationCode(otp);

        // Auto-enable and set ADMIN role if it's the admin address
        if (trimmedEmail.equalsIgnoreCase("admin@pharmai.com") || trimmedEmail.equalsIgnoreCase("admin@gmail.com")) {
            userToSave.setRole("ROLE_ADMIN");
            userToSave.setEnabled(true);
            userToSave.setVerificationCode(null);
            userRepository.save(userToSave);

            Map<String, Object> data = new HashMap<>();
            data.put("user", userToSave);
            data.put("token", "springboot-jwt-token-" + userToSave.getId() + "-" + System.currentTimeMillis());

            Map<String, Object> response = new HashMap<>();
            response.put("data", data);
            response.put("message", "Đăng ký tài khoản Admin thành công!");
            return ResponseEntity.ok(response);
        } else {
            userToSave.setRole("ROLE_USER");
            userToSave.setEnabled(false);
            userRepository.save(userToSave);

            // Send OTP to email - if fails, return error to user
            try {
                emailService.sendVerificationEmail(trimmedEmail, otp);
            } catch (Exception emailEx) {
                System.err.println("[AuthController] Email sending failed: " + emailEx.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("message", "Không thể gửi email xác thực. Vui lòng kiểm tra địa chỉ email hoặc thử lại sau."));
            }

            return ResponseEntity.ok(Map.of(
                "message", "Đăng ký thành công! Vui lòng nhập mã OTP đã gửi đến email của bạn.",
                "email", trimmedEmail,
                "requiresVerification", true
            ));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");

        if (email == null || otp == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email và mã OTP không được trống"));
        }

        Optional<User> userOpt = userRepository.findByEmail(email.trim());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Không tìm thấy tài khoản"));
        }

        User user = userOpt.get();
        if (user.getEnabled() != null && user.getEnabled()) {
            return ResponseEntity.ok(Map.of("message", "Tài khoản đã được xác thực từ trước"));
        }

        if (user.getVerificationCode() != null && user.getVerificationCode().equals(otp.trim())) {
            user.setEnabled(true);
            user.setVerificationCode(null);
            userRepository.save(user);

            Map<String, Object> data = new HashMap<>();
            data.put("user", user);
            data.put("token", "springboot-jwt-token-" + user.getId() + "-" + System.currentTimeMillis());

            Map<String, Object> response = new HashMap<>();
            response.put("data", data);
            response.put("message", "Xác thực tài khoản thành công!");

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Mã OTP không chính xác"));
        }
    }
}


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

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> googleData) {
        String email = googleData.get("email");
        String name = googleData.get("name");

        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email không hợp lệ từ Google"));
        }

        String trimmedEmail = email.trim();
        Optional<User> userOpt = userRepository.findByEmail(trimmedEmail);

        User user;
        if (userOpt.isPresent()) {
            user = userOpt.get();
            // Automatically enable user if logging in via verified Google account
            user.setEnabled(true);
            user.setVerificationCode(null);
            if (trimmedEmail.equalsIgnoreCase("admin@pharmai.com") || trimmedEmail.equalsIgnoreCase("admin@gmail.com")) {
                user.setRole("ROLE_ADMIN");
            }
            if ((user.getName() == null || user.getName().isEmpty()) && name != null) {
                user.setName(name.trim());
            }
            userRepository.save(user);
        } else {
            user = new User();
            user.setName(name != null && !name.trim().isEmpty() ? name.trim() : trimmedEmail.split("@")[0]);
            user.setEmail(trimmedEmail);
            user.setPhone("");
            user.setPassword("GOOGLE_OAUTH_ACCOUNT");
            if (trimmedEmail.equalsIgnoreCase("admin@pharmai.com") || trimmedEmail.equalsIgnoreCase("admin@gmail.com")) {
                user.setRole("ROLE_ADMIN");
            } else {
                user.setRole("ROLE_USER");
            }
            user.setEnabled(true);
            user.setVerificationCode(null);
            userRepository.save(user);
        }

        Map<String, Object> data = new HashMap<>();
        data.put("user", user);
        data.put("token", "springboot-jwt-token-" + user.getId() + "-" + System.currentTimeMillis());

        Map<String, Object> response = new HashMap<>();
        response.put("data", data);
        response.put("message", "Đăng nhập Google thành công!");

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

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email không được để trống"));
        }

        Optional<User> userOpt = userRepository.findByEmail(email.trim());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Không tìm thấy tài khoản"));
        }

        User user = userOpt.get();
        if (request.containsKey("name") && request.get("name") != null) {
            user.setName(request.get("name").trim());
        }
        if (request.containsKey("phone") && request.get("phone") != null) {
            user.setPhone(request.get("phone").trim());
        }
        if (request.containsKey("address") && request.get("address") != null) {
            user.setAddress(request.get("address").trim());
        }

        userRepository.save(user);

        Map<String, Object> data = new HashMap<>();
        data.put("user", user);

        Map<String, Object> response = new HashMap<>();
        response.put("data", data);
        response.put("message", "Cập nhật thông tin cá nhân thành công!");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String oldPassword = request.get("oldPassword");
        String newPassword = request.get("newPassword");

        if (email == null || oldPassword == null || newPassword == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Vui lòng nhập đầy đủ thông tin mật khẩu"));
        }

        Optional<User> userOpt = userRepository.findByEmail(email.trim());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Không tìm thấy tài khoản"));
        }

        User user = userOpt.get();
        if (!user.getPassword().equals(oldPassword)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Mật khẩu hiện tại không chính xác"));
        }

        if (newPassword.length() < 6) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Mật khẩu mới phải có ít nhất 6 ký tự"));
        }

        user.setPassword(newPassword);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Đổi mật khẩu thành công! Vui lòng sử dụng mật khẩu mới cho lần đăng nhập sau."));
    }
}


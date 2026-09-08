package com.pharmai.backend.controller;

import com.pharmai.backend.model.Order;
import com.pharmai.backend.model.User;
import com.pharmai.backend.repository.OrderRepository;
import com.pharmai.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping
    public ResponseEntity<?> getAllUsers(@RequestParam(required = false) String search,
                                         @RequestParam(required = false) String role,
                                         @RequestParam(required = false) Boolean enabled) {
        List<User> users = userRepository.findAll();
        List<Order> allOrders = orderRepository.findAll();

        // Calculate order count & total spent map by email
        Map<String, Integer> orderCountMap = new HashMap<>();
        Map<String, Double> totalSpentMap = new HashMap<>();

        for (Order order : allOrders) {
            if (order.getUserEmail() != null) {
                String email = order.getUserEmail().toLowerCase().trim();
                orderCountMap.put(email, orderCountMap.getOrDefault(email, 0) + 1);
                if ("completed".equalsIgnoreCase(order.getStatus())) {
                    totalSpentMap.put(email, totalSpentMap.getOrDefault(email, 0.0) + order.getTotalPrice());
                }
            }
        }

        List<Map<String, Object>> result = users.stream().map(u -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", u.getId());
            map.put("name", u.getName());
            map.put("email", u.getEmail());
            map.put("phone", u.getPhone());
            map.put("address", u.getAddress());
            map.put("role", u.getRole() != null ? u.getRole() : "ROLE_USER");
            map.put("enabled", u.getEnabled() != null ? u.getEnabled() : false);
            
            String userEmail = u.getEmail() != null ? u.getEmail().toLowerCase().trim() : "";
            map.put("orderCount", orderCountMap.getOrDefault(userEmail, 0));
            map.put("totalSpent", totalSpentMap.getOrDefault(userEmail, 0.0));
            return map;
        }).collect(Collectors.toList());

        // Apply search filter
        if (search != null && !search.trim().isEmpty()) {
            String q = search.trim().toLowerCase();
            result = result.stream().filter(u -> {
                String name = u.get("name") != null ? u.get("name").toString().toLowerCase() : "";
                String email = u.get("email") != null ? u.get("email").toString().toLowerCase() : "";
                String phone = u.get("phone") != null ? u.get("phone").toString().toLowerCase() : "";
                return name.contains(q) || email.contains(q) || phone.contains(q);
            }).collect(Collectors.toList());
        }

        // Apply role filter
        if (role != null && !role.trim().isEmpty() && !"all".equalsIgnoreCase(role)) {
            result = result.stream()
                    .filter(u -> role.equalsIgnoreCase(u.get("role").toString()))
                    .collect(Collectors.toList());
        }

        // Apply enabled filter
        if (enabled != null) {
            result = result.stream()
                    .filter(u -> enabled.equals(u.get("enabled")))
                    .collect(Collectors.toList());
        }

        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String name = payload.get("name");
        String password = payload.get("password");

        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email không được để trống"));
        }
        if (password == null || password.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Mật khẩu không được để trống"));
        }

        String trimmedEmail = email.trim().toLowerCase();
        if (userRepository.findByEmail(trimmedEmail).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email đã tồn tại trong hệ thống"));
        }

        User user = new User();
        user.setEmail(trimmedEmail);
        user.setName(name != null && !name.trim().isEmpty() ? name.trim() : trimmedEmail.split("@")[0]);
        user.setPhone(payload.getOrDefault("phone", ""));
        user.setAddress(payload.getOrDefault("address", ""));
        user.setPassword(password.trim());
        user.setRole(payload.getOrDefault("role", "ROLE_USER"));
        user.setEnabled("false".equalsIgnoreCase(payload.get("enabled")) ? false : true);

        userRepository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Tạo tài khoản khách hàng thành công!", "user", user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable("id") Long id, @RequestBody Map<String, Object> payload) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();

        if (payload.containsKey("name") && payload.get("name") != null) {
            user.setName(payload.get("name").toString().trim());
        }
        if (payload.containsKey("phone") && payload.get("phone") != null) {
            user.setPhone(payload.get("phone").toString().trim());
        }
        if (payload.containsKey("address") && payload.get("address") != null) {
            user.setAddress(payload.get("address").toString().trim());
        }
        if (payload.containsKey("role") && payload.get("role") != null) {
            user.setRole(payload.get("role").toString().trim());
        }
        if (payload.containsKey("enabled") && payload.get("enabled") != null) {
            user.setEnabled(Boolean.parseBoolean(payload.get("enabled").toString()));
        }

        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Cập nhật thông tin khách hàng thành công!", "user", user));
    }

    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<?> toggleUserStatus(@PathVariable("id") Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();
        boolean current = user.getEnabled() != null ? user.getEnabled() : false;
        user.setEnabled(!current);
        userRepository.save(user);

        String statusMsg = user.getEnabled() ? "Đã mở khóa tài khoản" : "Đã khóa tài khoản khách hàng";
        return ResponseEntity.ok(Map.of("message", statusMsg, "enabled", user.getEnabled()));
    }

    @PutMapping("/{id}/reset-password")
    public ResponseEntity<?> resetPassword(@PathVariable("id") Long id, @RequestBody Map<String, String> payload) {
        String newPassword = payload.get("newPassword");
        if (newPassword == null || newPassword.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Mật khẩu mới không được trống"));
        }

        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();
        user.setPassword(newPassword.trim());
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Đặt lại mật khẩu cho khách hàng thành công!"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable("id") Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        userRepository.delete(userOpt.get());
        return ResponseEntity.ok(Map.of("message", "Đã xóa tài khoản khách hàng thành công!"));
    }
}

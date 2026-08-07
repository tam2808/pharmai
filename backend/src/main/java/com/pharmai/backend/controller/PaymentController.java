package com.pharmai.backend.controller;

import com.pharmai.backend.model.Order;
import com.pharmai.backend.repository.OrderRepository;
import com.pharmai.backend.service.VNPayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * PaymentController — Tích hợp VNPay Sandbox
 *
 * Endpoints:
 *   POST /api/payment/vnpay          → Tạo URL thanh toán
 *   GET  /api/payment/vnpay-return   → Callback redirect (trình duyệt user)
 *   GET  /api/payment/vnpay-ipn      → IPN server-to-server từ VNPay
 *   GET  /api/payment/order/{id}     → Truy vấn trạng thái đơn hàng
 */
@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private VNPayService vnPayService;

    @Autowired
    private OrderRepository orderRepository;

    @Value("${vnpay.frontend-url}")
    private String frontendUrl;

    // ────────────────────────────────────────────────────────────
    // 1. Tạo URL thanh toán VNPay
    // ────────────────────────────────────────────────────────────

    /**
     * Tạo URL thanh toán và trả về cho frontend.
     * Body: { "orderId": "ORD-xxx", "amount": 150000 }
     */
    @PostMapping("/vnpay")
    public ResponseEntity<?> createVnpayUrl(
            @RequestBody Map<String, Object> request,
            HttpServletRequest httpRequest) {

        String orderId   = (String) request.get("orderId");
        Number amountNum = (Number) request.get("amount");

        if (orderId == null || orderId.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Thiếu thông tin orderId"));
        }
        if (amountNum == null || amountNum.longValue() <= 0) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Số tiền không hợp lệ"));
        }

        long amount     = amountNum.longValue();
        // VNPay chỉ chấp nhận ký tự ASCII cho orderInfo
        String orderInfo = "Thanh toan don hang " + orderId;

        // Lấy IP thực của client (qua proxy)
        String ipAddr = httpRequest.getHeader("X-Forwarded-For");
        if (ipAddr == null || ipAddr.isBlank()) {
            ipAddr = httpRequest.getRemoteAddr();
        }
        // Lấy IP đầu tiên nếu có nhiều (X-Forwarded-For có thể chứa danh sách)
        if (ipAddr != null && ipAddr.contains(",")) {
            ipAddr = ipAddr.split(",")[0].trim();
        }

        // Đảm bảo ipAddr không null (fallback sang localhost nếu cần)
        if (ipAddr == null || ipAddr.isBlank()) {
            ipAddr = "127.0.0.1";
        }

        String paymentUrl = vnPayService.createPaymentUrl(orderId, amount, orderInfo, ipAddr);

        Map<String, Object> data = new HashMap<>();
        data.put("paymentUrl", paymentUrl);
        data.put("orderId",    orderId);

        return ResponseEntity.ok(Map.of("data", data));
    }

    // ────────────────────────────────────────────────────────────
    // 2. Return URL — Trình duyệt user được redirect về đây
    // ────────────────────────────────────────────────────────────

    /**
     * VNPay redirect trình duyệt user về đây sau khi thanh toán.
     * Backend xác thực chữ ký, cập nhật DB, rồi redirect về frontend.
     *
     * Params từ VNPay: vnp_ResponseCode, vnp_TxnRef, vnp_Amount,
     *   vnp_TransactionNo, vnp_BankCode, vnp_PayDate, vnp_SecureHash, ...
     */
    @GetMapping("/vnpay-return")
    public void vnpayReturn(
            @RequestParam Map<String, String> allParams,
            HttpServletResponse response) throws Exception {

        String vnp_ResponseCode  = allParams.getOrDefault("vnp_ResponseCode", "99");
        String vnp_TxnRef        = allParams.getOrDefault("vnp_TxnRef", "");
        String vnp_TransactionNo = allParams.getOrDefault("vnp_TransactionNo", "");
        String vnp_Amount        = allParams.getOrDefault("vnp_Amount", "0");
        String vnp_BankCode      = allParams.getOrDefault("vnp_BankCode", "");
        String vnp_PayDate       = allParams.getOrDefault("vnp_PayDate", "");

        boolean isValid        = vnPayService.verifyPaymentReturn(allParams);
        boolean isSuccess      = isValid && "00".equals(vnp_ResponseCode);

        // Cập nhật trạng thái đơn hàng trong DB
        if (vnp_TxnRef == null || vnp_TxnRef.isBlank()) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Missing vnp_TxnRef");
            return;
        }
        Optional<Order> orderOpt = orderRepository.findById(vnp_TxnRef);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            if (isSuccess) {
                order.setStatus("completed");
            } else {
                // Chỉ cập nhật nếu chưa completed (tránh race condition với IPN)
                if (!"completed".equalsIgnoreCase(order.getStatus())) {
                    order.setStatus("cancelled");
                }
            }
            orderRepository.save(order);
        }

        // Xây dựng URL redirect về frontend với đầy đủ thông tin
        StringBuilder redirectUrl = new StringBuilder(frontendUrl + "/order-success");
        redirectUrl.append("?orderId=").append(encode(vnp_TxnRef));
        redirectUrl.append("&status=").append(isSuccess ? "success" : "failed");
        redirectUrl.append("&vnp_ResponseCode=").append(encode(vnp_ResponseCode));
        redirectUrl.append("&vnp_TransactionNo=").append(encode(vnp_TransactionNo));
        redirectUrl.append("&vnp_Amount=").append(encode(vnp_Amount));
        redirectUrl.append("&vnp_BankCode=").append(encode(vnp_BankCode));
        redirectUrl.append("&vnp_PayDate=").append(encode(vnp_PayDate));

        response.sendRedirect(redirectUrl.toString());
    }

    // ────────────────────────────────────────────────────────────
    // 3. IPN URL — Server-to-Server từ VNPay (không qua trình duyệt)
    // ────────────────────────────────────────────────────────────

    /**
     * VNPay IPN (Instant Payment Notification) — server gọi server.
     * Đây là cơ chế đáng tin cậy hơn vnpay-return để cập nhật trạng thái.
     * Phản hồi đúng chuẩn VNPay: {"RspCode":"00","Message":"Confirm Success"}
     *
     * LƯU Ý: URL này phải được public (dùng ngrok khi dev local).
     *         Đăng ký IPN URL tại: https://sandbox.vnpayment.vn/merchant_webapi
     */
    @GetMapping("/vnpay-ipn")
    public void vnpayIpn(
            @RequestParam Map<String, String> allParams,
            HttpServletResponse response) throws Exception {

        response.setContentType("application/json;charset=UTF-8");
        PrintWriter out = response.getWriter();

        try {
            String vnp_TxnRef       = allParams.getOrDefault("vnp_TxnRef", "");
            String vnp_ResponseCode = allParams.getOrDefault("vnp_ResponseCode", "99");
            String vnp_Amount       = allParams.getOrDefault("vnp_Amount", "0");

            // Bước 1: Xác thực chữ ký
            boolean isValidSig = vnPayService.verifyPaymentReturn(allParams);
            if (!isValidSig) {
                out.print("{\"RspCode\":\"97\",\"Message\":\"Invalid Checksum\"}");
                return;
            }

            // Bước 2: Tìm đơn hàng (vnp_TxnRef luôn non-null vì getOrDefault trả về "")
            if (vnp_TxnRef.isEmpty()) {
                out.print("{\"RspCode\":\"01\",\"Message\":\"Order not found\"}");
                return;
            }
            Optional<Order> orderOpt = orderRepository.findById(vnp_TxnRef);
            if (orderOpt.isEmpty()) {
                out.print("{\"RspCode\":\"01\",\"Message\":\"Order not found\"}");
                return;
            }

            Order order = orderOpt.get();

            // Bước 3: Kiểm tra số tiền
            long expectedAmount = Math.round(order.getTotalPrice() * 100);
            long receivedAmount = Long.parseLong(vnp_Amount);
            if (expectedAmount != receivedAmount) {
                out.print("{\"RspCode\":\"04\",\"Message\":\"Invalid Amount\"}");
                return;
            }

            // Bước 4: Kiểm tra xem đơn đã được xử lý chưa (idempotent)
            if ("completed".equalsIgnoreCase(order.getStatus())) {
                out.print("{\"RspCode\":\"02\",\"Message\":\"Order already confirmed\"}");
                return;
            }

            // Bước 5: Cập nhật trạng thái
            if ("00".equals(vnp_ResponseCode)) {
                order.setStatus("completed");
            } else {
                order.setStatus("cancelled");
            }
            orderRepository.save(order);

            out.print("{\"RspCode\":\"00\",\"Message\":\"Confirm Success\"}");

        } catch (Exception e) {
            out.print("{\"RspCode\":\"99\",\"Message\":\"Unknown error: " + e.getMessage() + "\"}");
        }
    }

    // ────────────────────────────────────────────────────────────
    // 4. Query trạng thái đơn hàng
    // ────────────────────────────────────────────────────────────

    /**
     * Truy vấn trạng thái đơn hàng theo ID.
     * Frontend dùng để confirm trạng thái sau callback.
     */
    @GetMapping("/order/{orderId}")
    public ResponseEntity<?> getOrderStatus(@PathVariable String orderId) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Order order = orderOpt.get();
        Map<String, Object> data = new HashMap<>();
        data.put("orderId",       order.getId());
        data.put("status",        order.getStatus());
        data.put("totalPrice",    order.getTotalPrice());
        data.put("paymentMethod", order.getPaymentMethod());
        data.put("fullName",      order.getFullName());
        data.put("createdAt",     order.getCreatedAt());
        return ResponseEntity.ok(Map.of("data", data));
    }

    // ────────────────────────────────────────────────────────────
    // Helper
    // ────────────────────────────────────────────────────────────

    private String encode(String value) {
        if (value == null || value.isEmpty()) return "";
        return java.net.URLEncoder.encode(value, java.nio.charset.StandardCharsets.UTF_8);
    }
}

package com.pharmai.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * VNPayService — Tích hợp cổng thanh toán VNPay Sandbox
 *
 * Quy tắc xây dựng chữ ký HMAC-SHA512 (đúng chuẩn VNPay 2.1.0):
 *   - hashData   : key=rawValue nối bằng & (KHÔNG URL-encode giá trị)
 *   - queryString: key=URLEncode(value) nối bằng & (URL-encode giá trị)
 *   - Cả hai đều sắp xếp key theo thứ tự alphabet
 *   - Chỉ đưa vào hashData các tham số bắt đầu bằng "vnp_"
 *
 * Tài liệu tham khảo: https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/
 */
@Service
public class VNPayService {

    @Value("${vnpay.tmn-code}")
    private String tmnCode;

    @Value("${vnpay.hash-secret}")
    private String hashSecret;

    @Value("${vnpay.url}")
    private String vnpayUrl;

    @Value("${vnpay.return-url}")
    private String returnUrl;

    /**
     * Tạo URL thanh toán VNPay Sandbox với mã ngân hàng/QR tùy chọn.
     *
     * @param orderId   Mã đơn hàng (vnp_TxnRef)
     * @param amount    Số tiền VNĐ (chưa nhân 100)
     * @param orderInfo Mô tả đơn hàng (ASCII only)
     * @param ipAddr    IP của khách hàng
     * @param bankCode  Mã ngân hàng hoặc "VNPAYQR" để mở trực tiếp trang QR Code
     * @return URL đầy đủ để redirect đến cổng VNPay Sandbox
     */
    public String createPaymentUrl(String orderId, long amount, String orderInfo, String ipAddr, String bankCode) {
        // Chuẩn hóa địa chỉ IP (chuyển IPv6 local sang IPv4)
        if (ipAddr == null || ipAddr.isBlank() || "0:0:0:0:0:0:0:1".equals(ipAddr) || "::1".equals(ipAddr)) {
            ipAddr = "127.0.0.1";
        }

        // Thời gian tạo và hết hạn giao dịch (GMT+7)
        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());

        // Dùng TreeMap để tự động sort theo alphabet key
        Map<String, String> vnp_Params = new TreeMap<>();
        vnp_Params.put("vnp_Version",    "2.1.0");
        vnp_Params.put("vnp_Command",    "pay");
        vnp_Params.put("vnp_TmnCode",    tmnCode);
        vnp_Params.put("vnp_Amount",     String.valueOf(amount * 100)); // VNPay nhân 100
        vnp_Params.put("vnp_CurrCode",   "VND");
        vnp_Params.put("vnp_TxnRef",     orderId);
        vnp_Params.put("vnp_OrderInfo",  orderInfo);
        vnp_Params.put("vnp_OrderType",  "other");
        vnp_Params.put("vnp_Locale",     "vn");
        vnp_Params.put("vnp_ReturnUrl",  returnUrl);
        vnp_Params.put("vnp_IpAddr",     ipAddr);
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        // Thêm vnp_BankCode nếu có (ví dụ: "VNPAYQR" để mở trực tiếp trang quét mã QR)
        if (bankCode != null && !bankCode.isBlank()) {
            vnp_Params.put("vnp_BankCode", bankCode.trim());
        }

        // ── Build hashData (raw) và queryString (encoded) ──
        StringBuilder hashData   = new StringBuilder();
        StringBuilder queryString = new StringBuilder();

        boolean first = true;
        for (Map.Entry<String, String> entry : vnp_Params.entrySet()) {
            String key   = entry.getKey();
            String value = entry.getValue();
            if (value != null && !value.isEmpty()) {
                if (!first) {
                    hashData.append('&');
                    queryString.append('&');
                }
                // hashData dùng raw value (đúng chuẩn VNPay)
                hashData.append(key).append('=').append(value);
                // queryString dùng URL-encoded value
                queryString.append(URLEncoder.encode(key, StandardCharsets.UTF_8))
                           .append('=')
                           .append(URLEncoder.encode(value, StandardCharsets.UTF_8));
                first = false;
            }
        }

        // Ký HMAC-SHA512
        String vnp_SecureHash = hmacSHA512(hashSecret, hashData.toString());
        queryString.append("&vnp_SecureHash=").append(vnp_SecureHash);

        return vnpayUrl + "?" + queryString;
    }

    /** Overload tạo payment URL mặc định */
    public String createPaymentUrl(String orderId, long amount, String orderInfo, String ipAddr) {
        return createPaymentUrl(orderId, amount, orderInfo, ipAddr, null);
    }

    // ----------------------------------------------------------------
    // Xác thực callback từ VNPay
    // ----------------------------------------------------------------

    /**
     * Xác thực chữ ký phản hồi từ VNPay.
     * Cùng quy tắc build hashData như khi tạo URL (raw value, sorted key, chỉ các key vnp_).
     *
     * @param params Map tham số nhận từ VNPay callback/IPN
     * @return true nếu chữ ký hợp lệ
     */
    public boolean verifyPaymentReturn(Map<String, String> params) {
        String vnp_SecureHash = params.get("vnp_SecureHash");
        if (vnp_SecureHash == null || vnp_SecureHash.isEmpty()) return false;

        // Dùng TreeMap để tự động sắp xếp theo alphabet key
        Map<String, String> sortedParams = new TreeMap<>(params);
        sortedParams.remove("vnp_SecureHash");
        sortedParams.remove("vnp_SecureHashType");

        // Build hashData với raw value (chỉ lấy tham số có tiền tố "vnp_")
        StringBuilder hashData = new StringBuilder();
        boolean first = true;
        for (Map.Entry<String, String> entry : sortedParams.entrySet()) {
            String key   = entry.getKey();
            String value = entry.getValue();
            if (key != null && key.startsWith("vnp_") && value != null && !value.isEmpty()) {
                if (!first) hashData.append('&');
                hashData.append(key).append('=').append(value);
                first = false;
            }
        }

        String computedHash = hmacSHA512(hashSecret, hashData.toString());
        return computedHash.equalsIgnoreCase(vnp_SecureHash);
    }

    // ----------------------------------------------------------------
    // Helper
    // ----------------------------------------------------------------

    /**
     * Tính HMAC-SHA512 với key UTF-8.
     */
    public String hmacSHA512(String key, String data) {
        try {
            Mac hmac = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey = new SecretKeySpec(
                    key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmac.init(secretKey);
            byte[] hash = hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(hash.length * 2);
            for (byte b : hash) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException("Lỗi tính HMAC-SHA512: " + e.getMessage(), e);
        }
    }
}


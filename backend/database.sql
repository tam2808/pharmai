-- ============================================================
-- SQL Script for initializing MySQL Database: pharmai_db
-- ============================================================

CREATE DATABASE IF NOT EXISTS pharmai_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pharmai_db;

-- 1. Table: users
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'ROLE_USER',
    enabled TINYINT(1) DEFAULT 0,
    verification_code VARCHAR(10)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Table: drugs
CREATE TABLE IF NOT EXISTS drugs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    active_ingredient VARCHAR(255) NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    form VARCHAR(100) NOT NULL,
    category VARCHAR(255) NOT NULL,
    price DOUBLE NOT NULL,
    image VARCHAR(500),
    description TEXT,
    usage_instruction TEXT,
    ingredients TEXT,
    warnings TEXT,
    requires_prescription BOOLEAN DEFAULT FALSE,
    in_stock BOOLEAN DEFAULT TRUE,
    manufacturer VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Table: orders
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(100) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    notes TEXT,
    total_price DOUBLE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Table: order_items
CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(100) NOT NULL,
    drug_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    price DOUBLE NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (drug_id) REFERENCES drugs(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Insert Mock Data — 30 Loại Thuốc
-- ============================================================

INSERT INTO drugs (name, active_ingredient, dosage, form, category, price, image, description, usage_instruction, ingredients, warnings, requires_prescription, in_stock, manufacturer) VALUES

-- ============ GIẢM ĐAU - HẠ SỐT ============
('Paracetamol 500mg', 'Paracetamol', '500mg', 'Viên nén', 'Giảm đau - Hạ sốt', 25000, '/images/paracetamol.png',
 'Thuốc giảm đau, hạ sốt thông dụng. Được sử dụng rộng rãi để điều trị các triệu chứng đau nhẹ đến vừa và hạ sốt.',
 'Người lớn: 1-2 viên/lần, ngày 3-4 lần. Khoảng cách giữa 2 lần dùng tối thiểu 4-6 giờ. Không dùng quá 8 viên/ngày.\nTrẻ em 6-12 tuổi: 1/2-1 viên/lần, ngày 3-4 lần theo chỉ dẫn của bác sĩ.',
 'Mỗi viên chứa: Paracetamol 500mg. Tá dược: tinh bột ngô, povidon, natri croscarmellose, magnesi stearat.',
 'Không dùng cho người bệnh suy gan nặng. Thận trọng khi dùng cho người nghiện rượu. Không dùng quá liều quy định. Không dùng đồng thời với các thuốc khác có chứa paracetamol.',
 FALSE, TRUE, 'DHG Pharma'),

('Ibuprofen 400mg', 'Ibuprofen', '400mg', 'Viên nén bao phim', 'Giảm đau - Hạ sốt', 28000, '/images/ibuprofen.png',
 'Thuốc giảm đau, hạ sốt, chống viêm không steroid (NSAID). Điều trị đau đầu, đau răng, đau cơ, đau bụng kinh, viêm xương khớp.',
 'Người lớn: 200-400mg/lần, ngày 3-4 lần. Uống sau bữa ăn hoặc với sữa. Không dùng quá 1200mg/ngày khi tự điều trị.',
 'Mỗi viên chứa: Ibuprofen 400mg. Tá dược: cellulose vi tinh thể, croscarmellose natri, magnesi stearat, lớp bao phim HPMC.',
 'Không dùng cho người có tiền sử loét dạ dày hoặc xuất huyết tiêu hóa. Thận trọng với người hen suyễn, suy tim, suy thận. Không dùng trong 3 tháng cuối thai kỳ. Tránh dùng cùng với aspirin.',
 FALSE, TRUE, 'Abbott'),

('Aspirin 100mg', 'Acid acetylsalicylic', '100mg', 'Viên nén bao tan trong ruột', 'Giảm đau - Hạ sốt', 22000, '/images/aspirin.png',
 'Aspirin liều thấp dùng để ngăn ngừa cục máu đông, giảm nguy cơ nhồi máu cơ tim và đột quỵ ở bệnh nhân có nguy cơ tim mạch cao.',
 'Phòng ngừa huyết khối: 75-100mg/ngày, uống 1 lần vào buổi tối sau ăn. Viên bao tan trong ruột, nuốt nguyên viên, không nhai.',
 'Mỗi viên chứa: Acid acetylsalicylic 100mg dạng bao tan trong ruột. Tá dược: cellulose vi tinh thể, tinh bột ngô, lớp bao tan trong ruột.',
 'Cần kê đơn để dùng dài hạn. Chống chỉ định tuyệt đối với người dị ứng salicylate, loét dạ dày đang hoạt động, rối loạn đông máu. Không dùng cho trẻ em dưới 16 tuổi (hội chứng Reye). Ngừng thuốc 7 ngày trước phẫu thuật.',
 TRUE, TRUE, 'Bayer'),

-- ============ KHÁNG SINH ============
('Amoxicillin 500mg', 'Amoxicillin trihydrate', '500mg', 'Viên nang', 'Kháng sinh', 45000, '/images/amoxicillin.png',
 'Kháng sinh nhóm penicillin phổ rộng, điều trị nhiễm khuẩn đường hô hấp, tiết niệu, da và mô mềm do vi khuẩn nhạy cảm.',
 'Người lớn: 250-500mg mỗi 8 giờ hoặc 500-875mg mỗi 12 giờ. Thời gian điều trị 7-14 ngày tùy mức độ nhiễm khuẩn. Uống có thể không phụ thuộc bữa ăn.',
 'Mỗi viên nang chứa: Amoxicillin trihydrate tương đương Amoxicillin 500mg. Tá dược: magnesi stearat, natri croscarmellose.',
 'Cần kê đơn của bác sĩ. Không dùng cho người dị ứng với penicillin hoặc cephalosporin. Có thể gây phản ứng dị ứng nghiêm trọng (sốc phản vệ). Thận trọng với người suy thận. Hoàn thành đủ liệu trình để tránh kháng thuốc.',
 TRUE, TRUE, 'Pymepharco'),

('Azithromycin 500mg', 'Azithromycin dihydrate', '500mg', 'Viên nén bao phim', 'Kháng sinh', 65000, '/images/azithromycin.png',
 'Kháng sinh nhóm macrolid phổ rộng, điều trị viêm phổi cộng đồng, viêm xoang, viêm họng, nhiễm khuẩn da và nhiễm khuẩn lây truyền qua đường tình dục.',
 'Người lớn: 500mg/ngày x 3 ngày (viêm phổi, viêm xoang) hoặc 1g liều duy nhất (nhiễm Chlamydia). Uống lúc đói hoặc 1 giờ trước ăn.',
 'Mỗi viên chứa: Azithromycin dihydrate tương đương Azithromycin 500mg. Tá dược: tinh bột biến tính, crospovidon, magnesi stearat.',
 'Cần kê đơn. Không dùng cho người dị ứng macrolid. Thận trọng với bệnh nhân có tiền sử rối loạn nhịp tim (QT kéo dài). Có thể tương tác với warfarin, digoxin, ergotamin.',
 TRUE, TRUE, 'Zuellig Pharma'),

('Ciprofloxacin 500mg', 'Ciprofloxacin hydrochloride', '500mg', 'Viên nén bao phim', 'Kháng sinh', 58000, '/images/ciprofloxacin.png',
 'Kháng sinh nhóm fluoroquinolon, điều trị nhiễm khuẩn tiết niệu, hô hấp, tiêu hóa, xương khớp và da do vi khuẩn gram âm và gram dương nhạy cảm.',
 'Người lớn: 250-750mg mỗi 12 giờ tùy mức độ nhiễm khuẩn. Thời gian điều trị 3-14 ngày. Uống với nhiều nước, tránh dùng cùng antacid.',
 'Mỗi viên chứa: Ciprofloxacin hydrochloride tương đương Ciprofloxacin 500mg. Tá dược: cellulose vi tinh thể, tinh bột sắn, magnesi stearat.',
 'Cần kê đơn bắt buộc. Không dùng cho trẻ em đang phát triển xương (trừ một số trường hợp đặc biệt), phụ nữ có thai hoặc cho con bú. Có thể gây đứt gân Achilles ở người cao tuổi. Tránh tiếp xúc ánh nắng trực tiếp.',
 TRUE, TRUE, 'Medochemie'),

-- ============ TIÊU HÓA ============
('Omeprazole 20mg', 'Omeprazole', '20mg', 'Viên nang', 'Tiêu hóa', 35000, '/images/omeprazole.png',
 'Thuốc ức chế bơm proton (PPI), điều trị loét dạ dày - tá tràng, trào ngược dạ dày thực quản (GERD), hội chứng Zollinger-Ellison.',
 'Người lớn: 20-40mg/ngày, uống trước bữa ăn sáng 30 phút. Thời gian điều trị 2-8 tuần tùy bệnh lý. Nuốt nguyên viên nang, không nhai hay nghiền.',
 'Mỗi viên nang chứa: Omeprazole 20mg dạng pellet bao tan trong ruột. Tá dược: đường cầu, hydroxypropylcellulose, phtalat hydroxypropylmethylcellulose.',
 'Không dùng cho phụ nữ có thai trong tam cá nguyệt đầu (trừ khi thật sự cần thiết). Cần loại trừ ác tính dạ dày trước khi điều trị. Dùng kéo dài có thể tăng nguy cơ gãy xương, thiếu magie và vitamin B12. Tương tác với clopidogrel.',
 FALSE, TRUE, 'Domesco'),

('Domperidone 10mg', 'Domperidone maleate', '10mg', 'Viên nén', 'Tiêu hóa', 18000, '/images/domperidone.png',
 'Thuốc chống nôn và tăng nhu động ruột. Điều trị buồn nôn, nôn, khó tiêu, chướng bụng, trào ngược dạ dày - thực quản.',
 'Người lớn: 10mg x 3 lần/ngày, uống 15-30 phút trước bữa ăn. Không dùng quá 30mg/ngày. Thời gian điều trị không quá 7 ngày.',
 'Mỗi viên chứa: Domperidone maleate tương đương Domperidone 10mg. Tá dược: cellulose vi tinh thể, lactose monohydrate, bột talc.',
 'Thận trọng với bệnh nhân có rối loạn nhịp tim (kéo dài QT). Không dùng liều cao hoặc kéo dài hơn khuyến cáo. Tránh dùng cùng với các thuốc ức chế CYP3A4 (ketoconazole, erythromycin). Cần thận trọng ở người cao tuổi.',
 FALSE, TRUE, 'Janssen'),

('Diosmectite 3g', 'Diosmectite', '3g', 'Gói bột pha uống', 'Tiêu hóa', 12000, '/images/diosmectite.png',
 'Thuốc bảo vệ và phục hồi niêm mạc tiêu hóa. Điều trị tiêu chảy cấp và mạn tính, đau bụng do rối loạn tiêu hóa ở người lớn và trẻ em.',
 'Người lớn: 3 gói/ngày (1 gói x 3 lần), pha mỗi gói với 50ml nước ấm, uống giữa các bữa ăn.\nTrẻ em < 1 tuổi: 1 gói/ngày; 1-2 tuổi: 1-2 gói/ngày; > 2 tuổi: 2-3 gói/ngày.',
 'Mỗi gói 3g chứa: Diosmectite 3g. Tá dược: đường saccharose, hương vani tự nhiên.',
 'Dùng thận trọng ở bệnh nhân táo bón. Nên uống cách xa các thuốc khác ít nhất 2 giờ vì có thể làm giảm hấp thu các thuốc dùng đồng thời. Không thay thế việc bù nước và điện giải khi tiêu chảy nặng.',
 FALSE, TRUE, 'Ipsen'),

('Lactulose 10g/15ml', 'Lactulose', '10g/15ml', 'Dung dịch uống', 'Tiêu hóa', 42000, '/images/lactulose.png',
 'Thuốc nhuận tràng thẩm thấu, điều trị táo bón cấp và mạn tính, táo bón ở phụ nữ mang thai và sau sinh, phòng ngừa và điều trị bệnh não gan.',
 'Người lớn trị táo bón: 15-45ml/ngày chia 1-2 lần. Điều trị bệnh não gan: 30-50ml x 3 lần/ngày. Uống vào buổi sáng khi bụng đói.',
 'Mỗi 15ml chứa: Lactulose 10g. Thành phần khác: nước tinh khiết.',
 'Không dùng cho bệnh nhân galactosemia, tắc ruột cơ học. Thận trọng với người tiểu đường (chứa galactose và lactose). Sử dụng kéo dài có thể gây mất cân bằng điện giải. Nên uống đủ nước trong thời gian dùng thuốc.',
 FALSE, TRUE, 'Fresenius Kabi'),

-- ============ DỊ ỨNG ============
('Cetirizine 10mg', 'Cetirizine dihydrochloride', '10mg', 'Viên nén', 'Dị ứng', 18000, '/images/cetirizine.png',
 'Thuốc kháng histamin H1 thế hệ 2 không gây buồn ngủ đáng kể. Điều trị viêm mũi dị ứng theo mùa và quanh năm, mày đay mạn tính, ngứa da do dị ứng.',
 'Người lớn và trẻ > 12 tuổi: 10mg/ngày (1 viên), uống 1 lần vào buổi tối.\nTrẻ 6-12 tuổi: 5mg x 2 lần/ngày hoặc 10mg x 1 lần/ngày.',
 'Mỗi viên chứa: Cetirizine dihydrochloride 10mg. Tá dược: cellulose vi tinh thể, lactose monohydrate, magnesi stearat, lớp bao HPMC.',
 'Có thể gây buồn ngủ ở một số bệnh nhân. Thận trọng khi lái xe hoặc vận hành máy móc. Giảm liều với người suy thận. Không dùng cho trẻ dưới 2 tuổi.',
 FALSE, TRUE, 'US Pharma'),

('Loratadine 10mg', 'Loratadine', '10mg', 'Viên nén', 'Dị ứng', 15000, '/images/loratadine.png',
 'Kháng histamin H1 thế hệ 2 không gây buồn ngủ. Điều trị viêm mũi dị ứng theo mùa, mày đay mạn tính tự phát, ngứa và các triệu chứng dị ứng khác.',
 'Người lớn và trẻ > 12 tuổi: 10mg/ngày (1 viên), uống 1 lần vào buổi sáng khi bụng đói.\nTrẻ 2-12 tuổi (< 30kg): 5mg/ngày; (≥ 30kg): 10mg/ngày.',
 'Mỗi viên chứa: Loratadine 10mg. Tá dược: lactose monohydrate, tinh bột ngô, magnesi stearat.',
 'Hiếm khi gây buồn ngủ (ít hơn cetirizine). Giảm liều ở người suy gan hoặc suy thận nặng. Thận trọng khi dùng cùng với thuốc ức chế CYP3A4. Không dùng cho trẻ dưới 2 tuổi.',
 FALSE, TRUE, 'Schering-Plough'),

-- ============ TIỂU ĐƯỜNG ============
('Metformin 850mg', 'Metformin hydrochloride', '850mg', 'Viên nén', 'Tiểu đường', 32000, '/images/metformin.png',
 'Thuốc điều trị đái tháo đường type 2 nhóm biguanide. Giảm glucose huyết bằng cách ức chế tổng hợp glucose tại gan, tăng nhạy cảm insulin.',
 'Khởi đầu 500mg hoặc 850mg/ngày, tăng dần mỗi 1-2 tuần. Liều tối đa 2550mg/ngày, chia 3 lần. Uống trong hoặc ngay sau bữa ăn để giảm tác dụng phụ tiêu hóa.',
 'Mỗi viên chứa: Metformin hydrochloride 850mg. Tá dược: cellulose vi tinh thể, povidon K30, magnesi stearat.',
 'Cần kê đơn. Chống chỉ định tuyệt đối với suy thận nặng (eGFR < 30), nhiễm toan lactic, suy gan, nghiện rượu. Ngừng thuốc 48 giờ trước khi chụp cản quang có iod. Có thể gây thiếu vitamin B12 khi dùng dài hạn.',
 TRUE, TRUE, 'Stella'),

-- ============ TIM MẠCH ============
('Losartan 50mg', 'Losartan kali', '50mg', 'Viên nén', 'Tim mạch', 42000, '/images/losartan.png',
 'Thuốc chẹn thụ thể angiotensin II (ARB), điều trị tăng huyết áp, suy tim, bảo vệ thận ở bệnh nhân đái tháo đường type 2 có protein niệu.',
 'Khởi đầu 50mg/ngày, có thể tăng lên 100mg/ngày sau 3-6 tuần nếu cần. Uống 1 lần/ngày, không phụ thuộc bữa ăn.',
 'Mỗi viên chứa: Losartan kali 50mg. Tá dược: cellulose vi tinh thể, lactose monohydrate, magnesi stearat, hydroxypropylcellulose.',
 'Cần kê đơn. Chống chỉ định tuyệt đối với phụ nữ có thai (gây dị tật và tử vong thai nhi). Thận trọng khi dùng đồng thời với thuốc lợi tiểu tiết kiệm kali hoặc kali bổ sung. Theo dõi chức năng thận và kali máu định kỳ.',
 TRUE, TRUE, 'Sanofi'),

('Atorvastatin 20mg', 'Atorvastatin calcium', '20mg', 'Viên nén bao phim', 'Tim mạch', 78000, '/images/atorvastatin.png',
 'Thuốc hạ lipid máu nhóm statin, ức chế enzyme HMG-CoA reductase. Điều trị tăng cholesterol máu, phòng ngừa biến cố tim mạch ở bệnh nhân có nguy cơ cao.',
 'Người lớn: Khởi đầu 10-20mg/ngày, uống 1 lần vào buổi tối. Có thể tăng lên tối đa 80mg/ngày tùy đáp ứng. Kiểm tra lipid máu sau 4-8 tuần điều trị.',
 'Mỗi viên chứa: Atorvastatin calcium tương đương Atorvastatin 20mg. Tá dược: canxi carbonat, cellulose vi tinh thể, lactose, magnesi stearat, lớp bao phim.',
 'Cần kê đơn. Chống chỉ định với phụ nữ có thai hoặc đang cho con bú. Theo dõi men gan và triệu chứng bệnh cơ (đau cơ, yếu cơ). Tránh uống nước bưởi khi dùng thuốc. Tương tác với nhiều thuốc khác.',
 TRUE, TRUE, 'Pfizer'),

('Amlodipine 5mg', 'Amlodipine besylate', '5mg', 'Viên nén', 'Tim mạch', 35000, '/images/amlodipine.png',
 'Thuốc chẹn kênh canxi dihydropyridine tác dụng kéo dài. Điều trị tăng huyết áp và cơn đau thắt ngực (angina ổn định và co thắt mạch vành).',
 'Tăng huyết áp/Đau thắt ngực: Khởi đầu 5mg/ngày, có thể tăng lên 10mg/ngày sau 1-2 tuần. Uống 1 lần/ngày, không phụ thuộc bữa ăn.',
 'Mỗi viên chứa: Amlodipine besylate tương đương Amlodipine 5mg. Tá dược: cellulose vi tinh thể, canxi photphat dibasic, natri tinh bột glycolat, magnesi stearat.',
 'Cần kê đơn. Thận trọng với bệnh nhân suy tim nặng, hẹp van động mạch chủ nặng. Có thể gây phù mắt cá chân, đỏ mặt, nhức đầu. Không ngừng thuốc đột ngột. Tránh uống nước bưởi.',
 TRUE, TRUE, 'Pfizer'),

('Bisoprolol 5mg', 'Bisoprolol fumarate', '5mg', 'Viên nén bao phim', 'Tim mạch', 48000, '/images/bisoprolol.png',
 'Thuốc chẹn beta chọn lọc tim, điều trị tăng huyết áp, đau thắt ngực ổn định, suy tim mạn tính ổn định, rối loạn nhịp tim (rung nhĩ).',
 'Tăng huyết áp/Đau thắt ngực: Khởi đầu 5mg/ngày, tăng dần tối đa 20mg/ngày. Suy tim: Khởi đầu 1.25mg/ngày, tăng chậm. Uống 1 lần vào buổi sáng, nuốt nguyên viên.',
 'Mỗi viên chứa: Bisoprolol fumarate 5mg. Tá dược: cellulose vi tinh thể, canxi hydrophosphat, tinh bột ngô, silica keo khan, magnesi stearat.',
 'Cần kê đơn. Không ngừng thuốc đột ngột (nguy cơ nhồi máu cơ tim, tăng huyết áp phản hồi). Chống chỉ định với hen suyễn, nhịp chậm xoang, block tim độ II-III. Che khuất triệu chứng hạ đường huyết ở người tiểu đường.',
 TRUE, TRUE, 'Merck'),

-- ============ VITAMIN & KHOÁNG CHẤT ============
('Vitamin C 1000mg', 'Acid ascorbic', '1000mg', 'Viên sủi', 'Vitamin & Khoáng chất', 55000, '/images/vitamin_c.png',
 'Bổ sung vitamin C liều cao, tăng cường sức đề kháng, chống oxy hóa, hỗ trợ tổng hợp collagen, hệ miễn dịch và hấp thu sắt.',
 'Hòa tan 1 viên sủi trong 200ml nước, uống 1 lần/ngày sau bữa ăn. Không uống trực tiếp viên sủi chưa hòa tan.',
 'Mỗi viên sủi chứa: Acid ascorbic 1000mg, hương cam tự nhiên, natri bicarbonate 800mg, acid citric 500mg, đường sorbitol.',
 'Không dùng quá liều khuyến cáo. Thận trọng với người có tiền sử sỏi thận oxalat. Có thể gây rối loạn tiêu hóa (tiêu chảy, buồn nôn) ở liều cao. Giảm liều ở người suy thận. Người tiểu đường cần lưu ý vì có đường sorbitol.',
 FALSE, TRUE, 'Bayer'),

('Vitamin D3 1000IU', 'Cholecalciferol', '1000IU', 'Viên nang mềm', 'Vitamin & Khoáng chất', 65000, '/images/vitamin_d3.png',
 'Bổ sung Vitamin D3 (Cholecalciferol), hỗ trợ hấp thu canxi và phospho, duy trì sức khỏe xương và răng, tăng cường hệ miễn dịch, phòng ngừa còi xương và loãng xương.',
 'Người lớn: 1-2 viên/ngày sau bữa ăn có chất béo (để tăng hấp thu). Trẻ em: theo chỉ định của bác sĩ. Bổ sung định kỳ theo mùa đông hoặc khi thiếu tiếp xúc ánh nắng.',
 'Mỗi viên nang mềm chứa: Cholecalciferol (Vitamin D3) 1000IU (25mcg). Tá dược: dầu đậu nành, gelatin, glycerol, nước tinh khiết.',
 'Không tự ý tăng liều vì vitamin D tan trong dầu, tích lũy gây ngộ độc. Triệu chứng ngộ độc: buồn nôn, chán ăn, tăng canxi máu. Kiểm tra nồng độ 25(OH)D3 trong máu trước khi bổ sung dài hạn. Thận trọng ở người sarcoidosis.',
 FALSE, TRUE, 'DHG Pharma'),

('Vitamin B Complex', 'Vitamin B1, B2, B3, B5, B6, B9, B12', 'Đủ liều hàng ngày', 'Viên nén bao phim', 'Vitamin & Khoáng chất', 38000, '/images/vitamin_b.png',
 'Tổ hợp vitamin nhóm B đầy đủ, hỗ trợ chuyển hóa năng lượng, chức năng thần kinh, tạo hồng cầu, sức khỏe da và tóc. Phù hợp cho người căng thẳng, mệt mỏi, thiếu dinh dưỡng.',
 'Người lớn: 1 viên/ngày sau bữa ăn sáng. Nên uống liên tục ít nhất 1 tháng để thấy hiệu quả rõ ràng.',
 'Mỗi viên chứa: Vitamin B1 (Thiamine) 10mg, B2 (Riboflavin) 10mg, B3 (Niacin) 50mg, B5 (Pantothenic acid) 10mg, B6 (Pyridoxine) 10mg, B9 (Folic acid) 400mcg, B12 (Cyanocobalamin) 250mcg.',
 'An toàn ở liều khuyến cáo. Nước tiểu có thể có màu vàng đậm do riboflavin (bình thường). Thận trọng với liều cao vitamin B6 kéo dài (gây bệnh thần kinh ngoại vi). Folic acid liều cao có thể che khuất thiếu B12.',
 FALSE, TRUE, 'Mekophar'),

('Sắt Fumarate 200mg', 'Ferrous fumarate', '200mg', 'Viên nén bao phim', 'Vitamin & Khoáng chất', 28000, '/images/iron.png',
 'Bổ sung sắt dạng fumarate (hấp thu tốt nhất), điều trị và phòng ngừa thiếu máu do thiếu sắt. Dành cho phụ nữ mang thai, sau sinh, kinh nguyệt nhiều, người ăn chay.',
 'Điều trị thiếu máu: 1-2 viên/ngày uống lúc đói (1 giờ trước hoặc 2 giờ sau ăn) với nước cam để tăng hấp thu.\nDự phòng: 1 viên/ngày.',
 'Mỗi viên chứa: Ferrous fumarate tương đương 65mg sắt nguyên tố. Tá dược: cellulose vi tinh thể, PVP, magnesi stearat, lớp bao phim màu nâu đỏ.',
 'Không uống cùng sữa, antacid, tetracycline, fluoroquinolon (giảm hấp thu). Uống cùng vitamin C tăng hấp thu. Có thể gây táo bón, phân đen (bình thường), buồn nôn. Bảo quản tránh xa tầm tay trẻ em (ngộ độc sắt nguy hiểm).',
 FALSE, TRUE, 'Pymepharco'),

-- ============ HÔ HẤP ============
('Salbutamol 4mg', 'Salbutamol sulfate', '4mg', 'Viên nén', 'Hô hấp', 22000, '/images/salbutamol.png',
 'Thuốc giãn phế quản nhóm beta2-agonist tác dụng ngắn (SABA). Điều trị và dự phòng co thắt phế quản trong hen phế quản, COPD và viêm phế quản co thắt.',
 'Người lớn: 2-4mg x 3-4 lần/ngày. Dạng uống tác dụng chậm hơn dạng hít. Nếu cơn hen cấp, ưu tiên dạng hít (MDI). Dùng theo chỉ định của bác sĩ.',
 'Mỗi viên chứa: Salbutamol sulfate tương đương Salbutamol 4mg. Tá dược: lactose, tinh bột ngô, magnesi stearat.',
 'Cần kê đơn. Có thể gây run tay, hồi hộp, nhịp tim nhanh. Không lạm dụng (chỉ điều trị khi cần). Thận trọng với bệnh tim mạch, tăng huyết áp, cường giáp, tiểu đường. Không dùng thường xuyên hàng ngày vì có thể làm tăng nhạy cảm phế quản.',
 TRUE, TRUE, 'GSK'),

('Montelukast 10mg', 'Montelukast sodium', '10mg', 'Viên nén bao phim', 'Hô hấp', 85000, '/images/montelukast.png',
 'Thuốc đối kháng thụ thể leukotriene, điều trị dự phòng hen phế quản mạn tính, viêm mũi dị ứng theo mùa và quanh năm ở người lớn và trẻ em từ 6 tuổi.',
 'Hen phế quản/Viêm mũi dị ứng: 10mg/ngày uống vào buổi tối (với hen) hoặc bất kỳ lúc nào trong ngày (với viêm mũi).',
 'Mỗi viên chứa: Montelukast sodium tương đương Montelukast 10mg. Tá dược: cellulose vi tinh thể, lactose monohydrate, hydroxypropylcellulose, magnesi stearat.',
 'Cần kê đơn. Không dùng để cắt cơn hen cấp. FDA cảnh báo về tác dụng tâm thần kinh (thay đổi hành vi, suy nghĩ tự tử hiếm gặp). Theo dõi sức khỏe tâm thần khi dùng. Tương tác với rifampicin, phenobarbital.',
 TRUE, TRUE, 'MSD'),

('N-acetylcysteine 600mg', 'N-acetylcysteine', '600mg', 'Gói bột sủi bọt', 'Hô hấp', 32000, '/images/nac.png',
 'Thuốc tiêu đờm và bảo vệ tế bào gan. Điều trị các bệnh đường hô hấp có đờm đặc quánh như viêm phế quản mạn, COPD, viêm xoang. Giải độc paracetamol.',
 'Người lớn: 600mg x 1-2 lần/ngày. Pha bột vào 100-200ml nước, uống ngay sau khi pha. Nên uống sau bữa ăn để giảm kích ứng dạ dày.',
 'Mỗi gói chứa: N-acetylcysteine 600mg. Tá dược: đường saccharose, natri bicarbonate, acid citric, hương chanh tự nhiên.',
 'Thận trọng với người dị ứng N-acetylcysteine hoặc tiền sử loét dạ dày. Có thể gây buồn nôn, nôn, tiêu chảy. Mùi trứng thối (do lưu huỳnh) là bình thường. Không pha cùng thuốc kháng sinh (giảm hoạt tính).',
 FALSE, TRUE, 'Zambon'),

-- ============ XƯƠNG KHỚP ============
('Diclofenac 50mg', 'Diclofenac sodium', '50mg', 'Viên nén bao tan trong ruột', 'Xương khớp', 25000, '/images/diclofenac.png',
 'Thuốc NSAID mạnh nhóm acetic acid, điều trị đau và viêm trong viêm khớp dạng thấp, thoái hóa khớp, cơn đau thắt lưng cấp, đau sau phẫu thuật, đau bụng kinh.',
 'Người lớn: 50mg x 2-3 lần/ngày hoặc 75mg x 2 lần/ngày. Uống nguyên viên sau bữa ăn. Liều tối đa 150mg/ngày. Dùng liều thấp nhất có hiệu quả trong thời gian ngắn nhất.',
 'Mỗi viên chứa: Diclofenac sodium 50mg bao tan trong ruột. Tá dược: cellulose vi tinh thể, crospovidon, magnesi stearat, lớp bao tan trong ruột.',
 'Tăng nguy cơ biến cố tim mạch và tiêu hóa khi dùng kéo dài. Chống chỉ định với tiền sử loét dạ dày, bệnh tim mạch nặng, suy thận/gan nặng. Không dùng trong thai kỳ (đặc biệt tam cá nguyệt 3). Không dùng cùng NSAID khác hoặc aspirin.',
 FALSE, TRUE, 'Novartis'),

('Meloxicam 15mg', 'Meloxicam', '15mg', 'Viên nén', 'Xương khớp', 38000, '/images/meloxicam.png',
 'NSAID ức chế chọn lọc COX-2, ít tác dụng phụ trên dạ dày hơn NSAID cổ điển. Điều trị thoái hóa khớp, viêm khớp dạng thấp, viêm cột sống dính khớp.',
 'Thoái hóa khớp: 7.5mg/ngày, tăng lên 15mg/ngày nếu cần. Viêm khớp dạng thấp: 15mg/ngày. Uống 1 lần/ngày trong bữa ăn.',
 'Mỗi viên chứa: Meloxicam 15mg. Tá dược: natri citrat, lactose monohydrate, povidon, cellulose vi tinh thể, magnesi stearat.',
 'Cần kê đơn. Vẫn có nguy cơ tiêu hóa và tim mạch (thấp hơn NSAID không chọn lọc). Chống chỉ định: suy tim nặng, tiền sử loét dạ dày, suy thận/gan nặng, thai kỳ cuối. Không dùng cùng anticoagulant mà không theo dõi chặt chẽ.',
 TRUE, TRUE, 'Boehringer Ingelheim'),

('Glucosamine 500mg', 'Glucosamine sulfate', '500mg', 'Viên nang', 'Xương khớp', 95000, '/images/glucosamine.png',
 'Thực phẩm bổ sung hỗ trợ tái tạo sụn khớp và giảm triệu chứng thoái hóa khớp gối. Phù hợp cho người trung niên và cao tuổi có đau khớp do thoái hóa.',
 'Người lớn: 1500mg/ngày (3 viên x 500mg hoặc 1 viên 1500mg), chia 1-3 lần. Uống trong bữa ăn. Cần dùng liên tục ít nhất 3 tháng để đánh giá hiệu quả.',
 'Mỗi viên nang chứa: Glucosamine sulfate 500mg (từ vỏ giáp xác). Tá dược: magnesi stearat, silicon dioxide, tinh bột ngô.',
 'Không phải thuốc, không thay thế điều trị y tế. Người dị ứng hải sản cần thận trọng (nguồn gốc từ vỏ tôm/cua). Có thể tương tác với warfarin (tăng INR). Ít bằng chứng khoa học mạnh về hiệu quả. Đường huyết có thể tăng nhẹ ở người tiểu đường.',
 FALSE, TRUE, 'Blackmores'),

-- ============ DA LIỄU ============
('Clotrimazole cream 1%', 'Clotrimazole', '1%', 'Kem bôi ngoài da', 'Da liễu', 35000, '/images/clotrimazole.png',
 'Thuốc kháng nấm nhóm imidazole dùng ngoài da. Điều trị các bệnh nấm da: hắc lào, lang ben, nấm bẹn, nấm chân (bàn chân vận động viên), nấm miệng (tưa miệng).',
 'Bôi một lượng kem vừa đủ lên vùng da bị nấm và vùng lân cận, ngày 2-3 lần. Tiếp tục dùng thêm 2-4 tuần sau khi các triệu chứng biến mất để ngăn tái phát.',
 'Mỗi 1g kem chứa: Clotrimazole 10mg (1%). Tá dược: cetostearyl alcohol, cetomacrogol 1000, dầu khoáng, propylen glycol, benzyl alcohol, nước tinh khiết.',
 'Chỉ dùng ngoài da, không bôi gần mắt, miệng, âm đạo. Nếu kích ứng da xảy ra, ngừng thuốc. Phụ nữ có thai dùng trong 3 tháng đầu cần thận trọng. Không bịt kín vùng da bôi thuốc. Rửa tay sau khi bôi.',
 FALSE, TRUE, 'Bayer'),

('Hydrocortisone cream 1%', 'Hydrocortisone acetate', '1%', 'Kem bôi ngoài da', 'Da liễu', 28000, '/images/hydrocortisone.png',
 'Corticosteroid tác dụng nhẹ dùng ngoài da. Điều trị các tình trạng viêm da nhẹ đến vừa: viêm da tiếp xúc, chàm (eczema), ngứa da, phát ban dị ứng nhẹ.',
 'Bôi một lớp mỏng lên vùng da bị tổn thương, ngày 1-2 lần. Thoa nhẹ nhàng cho đến khi thuốc thấm vào da. Không dùng quá 7 ngày liên tục nếu không có chỉ định của bác sĩ.',
 'Mỗi 1g kem chứa: Hydrocortisone acetate tương đương Hydrocortisone 10mg (1%). Tá dược: cetyl alcohol, white soft paraffin, dầu khoáng, natri lauryl sulfate.',
 'Không dùng trên mặt kéo dài, quanh mắt, niêm mạc, da bị nhiễm trùng. Không bịt kín (tăng hấp thu). Dùng kéo dài có thể gây mỏng da, rạn da, giãn mạch. Tránh tiếp xúc mắt. Phụ nữ có thai và cho con bú dùng thận trọng.',
 FALSE, TRUE, 'GSK'),

-- ============ MẮT ============
('Natri Hyaluronate 0.1% nhỏ mắt', 'Sodium hyaluronate', '0.1%', 'Dung dịch nhỏ mắt', 'Nhãn khoa', 85000, '/images/eye_drops.png',
 'Nước mắt nhân tạo có chứa hyaluronic acid tự nhiên, điều trị hội chứng khô mắt (dry eye syndrome). Bôi trơn và bảo vệ bề mặt nhãn cầu, phù hợp dùng khi đeo kính áp tròng.',
 'Nhỏ 1-2 giọt vào mắt cần điều trị, 3-4 lần/ngày hoặc khi cần thiết. Có thể dùng khi đang đeo kính áp tròng (loại không có chất bảo quản). Tháo kính áp tròng nếu dùng loại có chất bảo quản.',
 'Mỗi ml chứa: Sodium hyaluronate 1mg (0.1%). Tá dược: natri chloride, đệm phosphat, nước tinh khiết để tiêm (loại không bảo quản), hoặc benzalkonium chloride (loại có bảo quản).',
 'Không dùng nếu dị ứng với bất kỳ thành phần nào. Nếu đeo kính áp tròng, ưu tiên loại không chất bảo quản. Khi nhỏ mắt, tránh để đầu lọ chạm vào mắt hoặc tay. Nếu dùng nhiều loại thuốc mắt, cách nhau ít nhất 5 phút.',
 FALSE, TRUE, 'Théa Pharma');

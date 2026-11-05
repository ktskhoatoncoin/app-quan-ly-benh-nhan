import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const TOP_100_DRUGS = [
  // ============================================================================
  // I. DA LIỄU & THUỐC BÔI NGOÀI DA (25 LOẠI - ĐẶC THÙ PHÒNG KHÁM BSCK1 TÔN THẤT HÀO)
  // ============================================================================
  { name: 'Nizoral 2% Cream 5g (Ketoconazole)', unit: 'Tuýp', price: 42000, defaultNote: 'Bôi vùng da nấm 2 lần/ngày sau khi vệ sinh', m: 1, n: 0, a: 0, e: 1 },
  { name: 'Gentrisone Cream 10g (Betamethason/Clotrimazol/Gentamicin)', unit: 'Tuýp', price: 25000, defaultNote: 'Thoa mỏng vùng da viêm dị ứng nhiễm khuẩn 2 lần/ngày', m: 1, n: 0, a: 0, e: 1 },
  { name: 'Acyclovir 5% Cream 5g (Kháng virus Herpes/Zona)', unit: 'Tuýp', price: 22000, defaultNote: 'Thoa tổn thương mụn nước Herpes/Zona 4-5 lần/ngày', m: 1, n: 1, a: 1, e: 1 },
  { name: 'Bepanthen Ointment 5% 30g (Dexpanthenol)', unit: 'Tuýp', price: 85000, defaultNote: 'Thoa dưỡng ẩm, dịu da, phục hồi tổn thương 2-3 lần/ngày', m: 1, n: 0, a: 0, e: 1 },
  { name: 'Contractubex Gel 10g (Trị sẹo lồi, sẹo thâm)', unit: 'Tuýp', price: 165000, defaultNote: 'Thoa nhẹ lên mô sẹo 2-3 lần/ngày', m: 1, n: 0, a: 0, e: 1 },
  { name: 'Dermovate Cream 15g (Clobetasol propionate 0.05%)', unit: 'Tuýp', price: 95000, defaultNote: 'Thoa mỏng vùng chàm mạn, vảy nến buổi tối (tránh thoa mặt)', m: 0, n: 0, a: 0, e: 1 },
  { name: 'Fucidin 2% Cream 15g (Acid Fusidic)', unit: 'Tuýp', price: 110000, defaultNote: 'Thoa nhiễm trùng da, viêm nang lông, chốc lở 2 lần/ngày', m: 1, n: 0, a: 0, e: 1 },
  { name: 'Fucicort Cream 15g (Acid Fusidic + Betamethason)', unit: 'Tuýp', price: 125000, defaultNote: 'Thoa chàm nhiễm khuẩn 2 lần/ngày trong 7-10 ngày', m: 1, n: 0, a: 0, e: 1 },
  { name: 'Klenzit MS 15g (Adapalene 0.1% - Trị mụn ẩn, mụn viêm)', unit: 'Tuýp', price: 135000, defaultNote: 'Thoa mỏng toàn mặt vào buổi tối trước khi ngủ', m: 0, n: 0, a: 0, e: 1 },
  { name: 'Kem Ery nghệ 10g (Erythromycin + Nghệ trị mụn)', unit: 'Tuýp', price: 28000, defaultNote: 'Chấm mụn bọc, mụn viêm buổi tối', m: 0, n: 0, a: 0, e: 1 },
  { name: 'Sastid 100ml (Sữa tắm trị mụn lưng, nấm da, gàu ngứa)', unit: 'Chai', price: 185000, defaultNote: 'Tắm xoa đều vùng da bệnh, lưu 3 phút rồi xả sạch', m: 0, n: 0, a: 0, e: 1 },
  { name: 'Cồn chống nấm Antimycose 18ml', unit: 'Chai', price: 15000, defaultNote: 'Chấm rửa vùng da nấm kẽ chân, lang ben ngày 2 lần', m: 1, n: 0, a: 0, e: 1 },
  { name: 'Povidine 10% 20ml (Dung dịch sát trùng da)', unit: 'Chai', price: 12000, defaultNote: 'Sát khuẩn vết thương ngoài da bằng tăm bông sạch', m: 1, n: 0, a: 0, e: 1 },
  { name: 'Flucinar Ointment 15g (Fluocinolone acetonide)', unit: 'Tuýp', price: 45000, defaultNote: 'Thoa mỏng vùng viêm da dị ứng ngày 1-2 lần', m: 1, n: 0, a: 0, e: 1 },
  { name: 'Silkron Cream 10g (Clotrimazole, Betamethasone, Gentamicin)', unit: 'Tuýp', price: 28000, defaultNote: 'Thoa vùng nấm da kèm nhiễm khuẩn ngày 2 lần', m: 1, n: 0, a: 0, e: 1 },
  { name: 'Eumovate Cream 15g (Clobetasone butyrate 0.05%)', unit: 'Tuýp', price: 78000, defaultNote: 'Thoa chàm sữa, viêm da cơ địa trẻ em và người lớn 2 lần/ngày', m: 1, n: 0, a: 0, e: 1 },
  { name: 'Dung dịch Milian 20ml (Xanh Methylen + Tím Gentian)', unit: 'Chai', price: 8000, defaultNote: 'Chấm tổn thương chốc lở, mụn nước zona ngày 2-3 lần', m: 1, n: 0, a: 0, e: 1 },
  { name: 'Erythromycin dung dịch 4% 30ml (Trị mụn trứng cá)', unit: 'Chai', price: 45000, defaultNote: 'Thoa vùng da mụn 2 lần/ngày', m: 1, n: 0, a: 0, e: 1 },
  { name: 'Canesten 1% Cream 20g (Clotrimazole)', unit: 'Tuýp', price: 62000, defaultNote: 'Thoa vùng nấm da, hắc lào, nấm bẹn 2 lần/ngày', m: 1, n: 0, a: 0, e: 1 },
  { name: 'Diprosalic Ointment 15g (Betamethasone + Acid Salicylic)', unit: 'Tuýp', price: 95000, defaultNote: 'Thoa vùng vảy nến, dày sừng lòng bàn tay chân ngày 2 lần', m: 1, n: 0, a: 0, e: 1 },
  { name: 'Daivobet Ointment 15g (Calcipotriol + Betamethasone)', unit: 'Tuýp', price: 320000, defaultNote: 'Thoa mỏng mảng vảy nến 1 lần/ngày vào buổi tối', m: 0, n: 0, a: 0, e: 1 },
  { name: 'Differin 0.1% Gel 30g (Adapalene)', unit: 'Tuýp', price: 295000, defaultNote: 'Thoa mỏng vùng mụn mặt buổi tối sau khi rửa sạch', m: 0, n: 0, a: 0, e: 1 },
  { name: 'Hiruscar Gel 20g (Trị sẹo thâm, mụn)', unit: 'Tuýp', price: 210000, defaultNote: 'Xoa nhẹ nhàng lên sẹo mụn 2-3 lần/ngày', m: 1, n: 0, a: 0, e: 1 },
  { name: 'Thuốc mỡ Kẽm Oxyd 10% 15g', unit: 'Tuýp', price: 15000, defaultNote: 'Bôi làm dịu da bỏng nhẹ, hăm tã, viêm da ngày 2 lần', m: 1, n: 0, a: 0, e: 1 },
  { name: 'Cồn 70 độ 60ml (Sát khuẩn y tế)', unit: 'Chai', price: 6000, defaultNote: 'Sát khuẩn da trước khi thao tác', m: 1, n: 0, a: 0, e: 0 },

  // ============================================================================
  // II. KHÁNG HISTAMIN & CHỐNG DỊ ỨNG, MỀ ĐAY, NGỨA (15 LOẠI)
  // ============================================================================
  { name: 'Telfast 180mg (Fexofenadine)', unit: 'Viên', price: 6500, defaultNote: 'Uống sau ăn sáng', m: 1, n: 0, a: 0, e: 0 },
  { name: 'Telfast 60mg (Fexofenadine)', unit: 'Viên', price: 4500, defaultNote: 'Uống sau ăn sáng - tối', m: 1, n: 0, a: 0, e: 1 },
  { name: 'Aerius 5mg (Desloratadine)', unit: 'Viên', price: 8000, defaultNote: 'Uống sau ăn sáng', m: 1, n: 0, a: 0, e: 0 },
  { name: 'Zyrtec 10mg (Cetirizine)', unit: 'Viên', price: 7500, defaultNote: 'Uống tối sau ăn', m: 0, n: 0, a: 0, e: 1 },
  { name: 'Clarityne 10mg (Loratadine)', unit: 'Viên', price: 9000, defaultNote: 'Uống sáng sau ăn', m: 1, n: 0, a: 0, e: 0 },
  { name: 'Xyzal 5mg (Levocetirizine)', unit: 'Viên', price: 9500, defaultNote: 'Uống tối sau ăn', m: 0, n: 0, a: 0, e: 1 },
  { name: 'Atarax 25mg (Hydroxyzine - Chống ngứa mề đay đêm)', unit: 'Viên', price: 4500, defaultNote: 'Uống 1 viên trước khi ngủ', m: 0, n: 0, a: 0, e: 1 },
  { name: 'Phenergan 25mg (Promethazine)', unit: 'Viên', price: 1500, defaultNote: 'Uống tối chống ngứa dị ứng', m: 0, n: 0, a: 0, e: 1 },
  { name: 'Clorpheniramin 4mg', unit: 'Viên', price: 500, defaultNote: 'Uống khi dị ứng, ngứa, hắt hơi', m: 1, n: 0, a: 0, e: 1 },
  { name: 'Cinnarizin 25mg (Stugeron)', unit: 'Viên', price: 1500, defaultNote: 'Uống sau ăn sáng - tối', m: 1, n: 0, a: 0, e: 1 },
  { name: 'Betaserc 16mg (Betahistine)', unit: 'Viên', price: 5500, defaultNote: 'Uống sau ăn no', m: 1, n: 0, a: 0, e: 1 },
  { name: 'Betaserc 24mg (Betahistine)', unit: 'Viên', price: 8000, defaultNote: 'Uống sau ăn no', m: 1, n: 0, a: 0, e: 1 },
  { name: 'Dimenhydrinat 50mg (Chống say xe, chóng mặt)', unit: 'Viên', price: 1000, defaultNote: 'Uống trước khi đi tàu xe 30 phút', m: 1, n: 0, a: 0, e: 0 },
  { name: 'Loratadin 10mg', unit: 'Viên', price: 1800, defaultNote: 'Uống sáng sau ăn', m: 1, n: 0, a: 0, e: 0 },
  { name: 'Fexofenadin 120mg', unit: 'Viên', price: 4000, defaultNote: 'Uống sáng sau ăn', m: 1, n: 0, a: 0, e: 0 },

  // ============================================================================
  // III. KHÁNG SINH & KHÁNG NẤM TOÀN THÂN (15 LOẠI)
  // ============================================================================
  { name: 'Curam 1000mg (Amoxicillin + Clavulanate)', unit: 'Viên', price: 18000, defaultNote: 'Uống ngay đầu bữa ăn no', m: 1, n: 0, a: 0, e: 1 },
  { name: 'Curam 625mg (Amoxicillin + Clavulanate)', unit: 'Viên', price: 12000, defaultNote: 'Uống ngay đầu bữa ăn no', m: 1, n: 0, a: 0, e: 1 },
  { name: 'Augmentin 1g (Amoxicillin/Acid Clavulanic)', unit: 'Viên', price: 18500, defaultNote: 'Uống đầu bữa ăn sáng - tối', m: 1, n: 0, a: 0, e: 1 },
  { name: 'Cefixim 200mg', unit: 'Viên', price: 8000, defaultNote: 'Uống sau ăn sáng - tối', m: 1, n: 0, a: 0, e: 1 },
  { name: 'Zinnat 500mg (Cefuroxime axetil)', unit: 'Viên', price: 19000, defaultNote: 'Uống sau ăn no sáng - tối', m: 1, n: 0, a: 0, e: 1 },
  { name: 'Doxycycline 100mg (Kháng sinh trị mụn, nhiễm khuẩn da)', unit: 'Viên', price: 3500, defaultNote: 'Uống nhiều nước sau ăn no, không nằm ngay sau uống', m: 1, n: 0, a: 0, e: 1 },
  { name: 'Ciprofloxacin 500mg', unit: 'Viên', price: 6500, defaultNote: 'Uống xa bữa ăn 2 giờ', m: 1, n: 0, a: 0, e: 1 },
  { name: 'Klacid 500mg (Clarithromycin)', unit: 'Viên', price: 21000, defaultNote: 'Uống sau ăn sáng - tối', m: 1, n: 0, a: 0, e: 1 },
  { name: 'Azithromycin 500mg (Zithromax)', unit: 'Viên', price: 17000, defaultNote: 'Uống 1 giờ trước hoặc 2 giờ sau ăn', m: 1, n: 0, a: 0, e: 0 },
  { name: 'Metronidazol 250mg', unit: 'Viên', price: 1200, defaultNote: 'Uống trong hoặc sau bữa ăn', m: 1, n: 0, a: 0, e: 1 },
  { name: 'Itraconazole 100mg (Sporal - Kháng nấm toàn thân)', unit: 'Viên', price: 18000, defaultNote: 'Uống ngay sau bữa ăn trưa nhiều dầu mỡ', m: 0, n: 1, a: 0, e: 0 },
  { name: 'Fluconazole 150mg (Diflucan - Trị nấm Candida)', unit: 'Viên', price: 25000, defaultNote: 'Uống 1 liều duy nhất hoặc theo lịch hẹn', m: 1, n: 0, a: 0, e: 0 },
  { name: 'Terbinafine 250mg (Lamisil - Trị nấm móng, nấm tóc)', unit: 'Viên', price: 28000, defaultNote: 'Uống 1 viên sau ăn mỗi ngày', m: 1, n: 0, a: 0, e: 0 },
  { name: 'Clindamycin 300mg (Trị mụn viêm nặng)', unit: 'Viên', price: 7000, defaultNote: 'Uống sau ăn với nhiều nước', m: 1, n: 0, a: 0, e: 1 },
  { name: 'Levofloxacin 500mg (Cravit)', unit: 'Viên', price: 16000, defaultNote: 'Uống cách xa bữa ăn', m: 1, n: 0, a: 0, e: 0 },

  // ============================================================================
  // IV. KHÁNG VIÊM CORTICOID & GIẢM PHÙ NỀ (8 LOẠI)
  // ============================================================================
  { name: 'Medrol 4mg (Methylprednisolon)', unit: 'Viên', price: 2500, defaultNote: 'Uống sau ăn sáng thật no', m: 1, n: 0, a: 0, e: 0 },
  { name: 'Medrol 16mg (Methylprednisolon)', unit: 'Viên', price: 6000, defaultNote: 'Uống sau ăn sáng thật no', m: 1, n: 0, a: 0, e: 0 },
  { name: 'Prednisolon 5mg', unit: 'Viên', price: 1000, defaultNote: 'Uống sáng sau ăn no', m: 1, n: 0, a: 0, e: 0 },
  { name: 'Dexamethason 0.5mg', unit: 'Viên', price: 800, defaultNote: 'Uống sau ăn sáng', m: 1, n: 0, a: 0, e: 0 },
  { name: 'Alphachymotrypsine Choay (Kháng viêm, tan phù nề)', unit: 'Viên', price: 2800, defaultNote: 'Ngậm dưới lưỡi hoặc uống sau ăn', m: 2, n: 0, a: 0, e: 2 },
  { name: 'Danzen 10mg (Serratiopeptidase - Giảm sưng nề)', unit: 'Viên', price: 3200, defaultNote: 'Uống sau ăn 3 lần/ngày', m: 1, n: 1, a: 0, e: 1 },
  { name: 'Medo Alpha 21 (Chymotrypsin)', unit: 'Viên', price: 2500, defaultNote: 'Ngậm dưới lưỡi 2 viên/lần', m: 2, n: 0, a: 0, e: 2 },
  { name: 'Methylprednisolon 16mg', unit: 'Viên', price: 4500, defaultNote: 'Uống sau ăn sáng no', m: 1, n: 0, a: 0, e: 0 },

  // ============================================================================
  // V. GIẢM ĐAU, HẠ SỐT & KHÁNG VIÊM XƯƠNG KHỚP NSAID (12 LOẠI)
  // ============================================================================
  { name: 'Hapacol 650mg (Paracetamol)', unit: 'Viên', price: 2000, defaultNote: 'Uống khi sốt > 38.5°C hoặc đau nhức (cách 4-6h)', m: 1, n: 0, a: 0, e: 1 },
  { name: 'Paracetamol 500mg', unit: 'Viên', price: 1500, defaultNote: 'Uống sau ăn khi đau/sốt', m: 1, n: 0, a: 0, e: 1 },
  { name: 'Efferalgan 500mg (Viên sủi hạ sốt)', unit: 'Viên', price: 4500, defaultNote: 'Hòa tan vào 1 cốc nước uống khi sốt', m: 1, n: 0, a: 0, e: 1 },
  { name: 'Celebrex 200mg (Celecoxib)', unit: 'Viên', price: 8000, defaultNote: 'Uống sau ăn no', m: 1, n: 0, a: 0, e: 0 },
  { name: 'Arcoxia 60mg (Etoricoxib)', unit: 'Viên', price: 16000, defaultNote: 'Uống sau ăn sáng', m: 1, n: 0, a: 0, e: 0 },
  { name: 'Arcoxia 90mg (Etoricoxib)', unit: 'Viên', price: 19000, defaultNote: 'Uống sau ăn sáng', m: 1, n: 0, a: 0, e: 0 },
  { name: 'Mobic 7.5mg (Meloxicam)', unit: 'Viên', price: 9000, defaultNote: 'Uống sau ăn no', m: 1, n: 0, a: 0, e: 0 },
  { name: 'Voltaren 50mg (Diclofenac)', unit: 'Viên', price: 5500, defaultNote: 'Uống ngay sau ăn no', m: 1, n: 0, a: 0, e: 1 },
  { name: 'Voltaren 75mg/3ml (Ống tiêm bắp giảm đau cấp)', unit: 'Ống', price: 35000, defaultNote: 'Tiêm bắp sâu theo chỉ định', m: 1, n: 0, a: 0, e: 0 },
  { name: 'Tilcotil 20mg (Tenoxicam)', unit: 'Viên', price: 11000, defaultNote: 'Uống sau ăn trưa hoặc tối', m: 0, n: 1, a: 0, e: 0 },
  { name: 'Glucosamin Sulfate 1500mg', unit: 'Gói', price: 9000, defaultNote: 'Pha nước uống sau ăn sáng', m: 1, n: 0, a: 0, e: 0 },
  { name: 'Mydocalm 150mg (Tolperisone - Giãn cơ giảm co cứng)', unit: 'Viên', price: 4500, defaultNote: 'Uống sau ăn 2 lần/ngày', m: 1, n: 0, a: 0, e: 1 },

  // ============================================================================
  // VI. TIÊU HÓA, DẠ DÀY, GAN MẬT (10 LOẠI)
  // ============================================================================
  { name: 'Nexium 40mg (Esomeprazol)', unit: 'Viên', price: 12000, defaultNote: 'Uống trước ăn sáng 30-60 phút', m: 1, n: 0, a: 0, e: 0 },
  { name: 'Nexium 20mg (Esomeprazol)', unit: 'Viên', price: 9000, defaultNote: 'Uống trước ăn sáng 30 phút', m: 1, n: 0, a: 0, e: 0 },
  { name: 'Pariet 20mg (Rabeprazol)', unit: 'Viên', price: 14000, defaultNote: 'Uống trước ăn sáng 30 phút', m: 1, n: 0, a: 0, e: 0 },
  { name: 'Phosphalugel (Gel dạ dày chữ P)', unit: 'Gói', price: 6500, defaultNote: 'Uống sau ăn 1-2 giờ hoặc khi đau rát dạ dày', m: 0, n: 1, a: 0, e: 1 },
  { name: 'Gaviscon Dual Action (Gói trị trào ngược dạ dày)', unit: 'Gói', price: 9500, defaultNote: 'Uống sau 3 bữa ăn chính và trước khi ngủ', m: 1, n: 1, a: 0, e: 1 },
  { name: 'Motilium 10mg (Domperidon - Chống nôn, đầy bụng)', unit: 'Viên', price: 2500, defaultNote: 'Uống trước ăn 15-30 phút', m: 1, n: 1, a: 0, e: 1 },
  { name: 'Debridat 100mg (Trimebutin - Điều hòa co bóp ruột)', unit: 'Viên', price: 3800, defaultNote: 'Uống trước bữa ăn', m: 1, n: 0, a: 0, e: 1 },
  { name: 'Silymarin 140mg (Bổ gan, hạ men gan)', unit: 'Viên', price: 4500, defaultNote: 'Uống sau ăn sáng - tối', m: 1, n: 0, a: 0, e: 1 },
  { name: 'Boganic (Bổ gan thảo dược)', unit: 'Viên', price: 2000, defaultNote: 'Uống sau ăn 2 lần/ngày', m: 2, n: 0, a: 0, e: 2 },
  { name: 'Enterogermina (Men vi sinh dạng ống 5ml)', unit: 'Ống', price: 11000, defaultNote: 'Uống cách kháng sinh 2 giờ', m: 1, n: 0, a: 0, e: 1 },

  // ============================================================================
  // VII. TIM MẠCH, HUYẾT ÁP & MỠ MÁU (10 LOẠI)
  // ============================================================================
  { name: 'Amlor 5mg (Amlodipin)', unit: 'Viên', price: 8500, defaultNote: 'Uống sau ăn sáng', m: 1, n: 0, a: 0, e: 0 },
  { name: 'Micardis 40mg (Telmisartan)', unit: 'Viên', price: 9500, defaultNote: 'Uống sau ăn sáng', m: 1, n: 0, a: 0, e: 0 },
  { name: 'Micardis Plus (Telmisartan 40mg + HCTZ 12.5mg)', unit: 'Viên', price: 11500, defaultNote: 'Uống sáng sau ăn', m: 1, n: 0, a: 0, e: 0 },
  { name: 'Coversyl 5mg (Perindopril)', unit: 'Viên', price: 8000, defaultNote: 'Uống trước ăn sáng', m: 1, n: 0, a: 0, e: 0 },
  { name: 'Concor 2.5mg (Bisoprolol)', unit: 'Viên', price: 5000, defaultNote: 'Uống sáng sau ăn', m: 1, n: 0, a: 0, e: 0 },
  { name: 'Concor 5mg (Bisoprolol)', unit: 'Viên', price: 6500, defaultNote: 'Uống sáng sau ăn', m: 1, n: 0, a: 0, e: 0 },
  { name: 'Lipitor 20mg (Atorvastatin - Hạ mỡ máu)', unit: 'Viên', price: 14000, defaultNote: 'Uống sau ăn tối', m: 0, n: 0, a: 0, e: 1 },
  { name: 'Crestor 10mg (Rosuvastatin - Hạ mỡ máu)', unit: 'Viên', price: 16000, defaultNote: 'Uống sau ăn tối', m: 0, n: 0, a: 0, e: 1 },
  { name: 'Plavix 75mg (Clopidogrel - Chống đông máu)', unit: 'Viên', price: 17500, defaultNote: 'Uống sau ăn sáng', m: 1, n: 0, a: 0, e: 0 },
  { name: 'Aspirin pH8 81mg (Chống huyết khối)', unit: 'Viên', price: 1000, defaultNote: 'Uống sau ăn no', m: 1, n: 0, a: 0, e: 0 },

  // ============================================================================
  // VIII. VITAMIN, KHOÁNG CHẤT, DƯỠNG DA & THẦN KINH (5 LOẠI)
  // ============================================================================
  { name: 'Cevit 500mg (Vitamin C - Tăng sức đề kháng, sáng da)', unit: 'Viên', price: 2000, defaultNote: 'Uống sau ăn sáng', m: 1, n: 0, a: 0, e: 0 },
  { name: 'Berocca Effervescent (Viên sủi Multivitamin khoáng chất)', unit: 'Viên', price: 9500, defaultNote: 'Hòa tan 1 viên vào 200ml nước uống sáng', m: 1, n: 0, a: 0, e: 0 },
  { name: 'Enat 400 (Vitamin E thiên nhiên - Chống oxy hóa da)', unit: 'Viên', price: 5000, defaultNote: 'Uống sau ăn chính', m: 1, n: 0, a: 0, e: 0 },
  { name: 'Magne B6 (Magnesi lactat + Pyridoxin)', unit: 'Viên', price: 2500, defaultNote: 'Uống sau ăn sáng - trưa', m: 1, n: 1, a: 0, e: 0 },
  { name: 'Tanakan 120mg (Ginkgo Biloba - Tuần hoàn não, chóng mặt)', unit: 'Viên', price: 6500, defaultNote: 'Uống sau ăn sáng - tối', m: 1, n: 0, a: 0, e: 1 }
];

console.log('✅ Generated TOP_100_DRUGS with length:', TOP_100_DRUGS.length);
if (TOP_100_DRUGS.length === 100) {
  console.log('🎉 EXACTLY 100 DRUGS VALIDATED!');
} else {
  console.error('❌ Mismatch length:', TOP_100_DRUGS.length);
}


import React, { useState, useMemo } from 'react';
import {
  Users,
  UserCheck,
  Search,
  Plus,
  Calendar,
  Phone,
  MapPin,
  Briefcase,
  Activity,
  AlertTriangle,
  FileText,
  Pill,
  Stethoscope,
  CreditCard,
  Printer,
  CheckCircle2,
  Clock,
  ChevronRight,
  Trash2,
  Save,
  Database,
  RefreshCw,
  FileSpreadsheet,
  HeartPulse,
  Scale,
  Ruler,
  Eye,
  X,
  ClipboardList,
  FlaskConical,
  Image as ImageIcon,
  Copy,
  Check
} from 'lucide-react';

// --- DỮ LIỆU MẪU BAN ĐẦU ---
const INITIAL_PATIENTS = [
  {
    id: 'BN0001',
    name: 'Nguyễn Văn An',
    dob: '1978-05-14',
    gender: 'Nam',
    phone: '0903123456',
    occupation: 'Kỹ sư xây dựng',
    address: '124 Nguyễn Thị Minh Khai, Quận 3, TP.HCM',
    medicalHistory: 'Tăng huyết áp vô căn (phát hiện 3 năm), Rối loạn lipid máu',
    allergies: 'Dị ứng kháng sinh nhóm Penicillin',
    createdAt: '2026-08-10'
  },
  {
    id: 'BN0002',
    name: 'Trần Thị Bích Ngọc',
    dob: '1992-11-22',
    gender: 'Nữ',
    phone: '0918765432',
    occupation: 'Giáo viên tiểu học',
    address: '45 Lê Văn Sỹ, Quận Phú Nhuận, TP.HCM',
    medicalHistory: 'Viêm dạ dày tá tràng mạn tính, Trào ngược dạ dày thực quản (GERD)',
    allergies: 'Không ghi nhận dị ứng',
    createdAt: '2026-09-05'
  },
  {
    id: 'BN0003',
    name: 'Lê Hoàng Minh',
    dob: '1965-02-18',
    gender: 'Nam',
    phone: '0989112233',
    occupation: 'Hưu trí',
    address: '88 Phan Xích Long, Quận Bình Thạnh, TP.HCM',
    medicalHistory: 'Đái tháo đường tuýp 2, Thoái hóa khớp gối 2 bên',
    allergies: 'Dị ứng Ibuprofen (nổi mề đay)',
    createdAt: '2026-09-12'
  },
  {
    id: 'BN0004',
    name: 'Phạm Mai Phương',
    dob: '2001-07-30',
    gender: 'Nữ',
    phone: '0934556677',
    occupation: 'Nhân viên thiết kế',
    address: '19 Nguyễn Hữu Cảnh, Quận Bình Thạnh, TP.HCM',
    medicalHistory: 'Viêm mũi dị ứng thời tiết',
    allergies: 'Hải sản, Phấn hoa',
    createdAt: '2026-10-18'
  },
  {
    id: 'BN0005',
    name: 'Võ Quốc Tuấn',
    dob: '1984-04-09',
    gender: 'Nam',
    phone: '0977889900',
    occupation: 'Kinh doanh tự do',
    address: '312 Cộng Hòa, Quận Tân Bình, TP.HCM',
    medicalHistory: 'Gan nhiễm mỡ độ 1, Tăng acid uric máu',
    allergies: 'Không ghi nhận dị ứng',
    createdAt: '2026-10-20'
  }
];

const INITIAL_VISITS = [
  {
    visitId: 'LK261025-01',
    patientId: 'BN0001',
    visitDate: '2026-10-25',
    height: 168,
    weight: 72,
    bp: '145/90',
    pulse: 82,
    symptoms: 'Đau đầu vùng chẩm buổi sáng, chóng mặt nhẹ khi thay đổi tư thế',
    diagnosis: 'Tăng huyết áp độ 1 - Rối loạn tiền đình ngoại biên',
    diseaseCategory: 'Tim mạch - Huyết áp',
    followUpDate: '2026-11-08',
    doctorNotes: 'Hạn chế ăn mặn, tập đi bộ nhẹ 30 phút/ngày, đo huyết áp tại nhà sáng/tối',
    consultationFee: 150000,
    paymentStatus: 'Đã thu',
    prescriptions: [
      { id: 'T1', drugName: 'Amlodipin 5mg', unit: 'Viên', morning: 1, noon: 0, afternoon: 0, evening: 0, days: 14, price: 3500, note: 'Uống sau ăn sáng' },
      { id: 'T2', drugName: 'Betahistin 16mg', unit: 'Viên', morning: 1, noon: 0, afternoon: 0, evening: 1, days: 14, price: 4200, note: 'Uống sau ăn sáng - tối' },
      { id: 'T3', drugName: 'Ginkgo Biloba 120mg', unit: 'Viên', morning: 1, noon: 0, afternoon: 1, evening: 0, days: 14, price: 5000, note: 'Uống sau ăn' }
    ],
    labs: [
      { id: 'XN1', type: 'Thử máu', name: 'Xét nghiệm mỡ máu (Cholesterol, Triglyceride, HDL, LDL)', result: 'Cholesterol toàn phần: 5.8 mmol/L (tăng nhẹ), Triglyceride: 2.3 mmol/L', cost: 220000, status: 'Đã có KQ', attachment: 'KQ_MoMau_BN0001.pdf' },
      { id: 'XN2', type: 'Điện tim', name: 'Điện tâm đồ (ECG) 12 chuyển đạo', result: 'Nhịp xoang đều 82 lần/phút, trục trung gian', cost: 100000, status: 'Đã có KQ', attachment: 'ECG_BN0001.png' }
    ]
  },
  {
    visitId: 'LK260920-01',
    patientId: 'BN0001',
    visitDate: '2026-09-20',
    height: 168,
    weight: 73,
    bp: '150/95',
    pulse: 84,
    symptoms: 'Mệt mỏi, nặng đầu về chiều',
    diagnosis: 'Tăng huyết áp vô căn',
    diseaseCategory: 'Tim mạch - Huyết áp',
    followUpDate: '2026-10-25',
    doctorNotes: 'Theo dõi đáp ứng thuốc hạ áp tuần đầu',
    consultationFee: 150000,
    paymentStatus: 'Đã thu',
    prescriptions: [
      { id: 'T4', drugName: 'Amlodipin 5mg', unit: 'Viên', morning: 1, noon: 0, afternoon: 0, evening: 0, days: 30, price: 3500, note: 'Uống sau ăn sáng' }
    ],
    labs: []
  },
  {
    visitId: 'LK261025-02',
    patientId: 'BN0002',
    visitDate: '2026-10-25',
    height: 158,
    weight: 51,
    bp: '110/70',
    pulse: 76,
    symptoms: 'Đau âm ỉ vùng thượng vị, ợ chua nhiều về đêm, đầy bụng khó tiêu',
    diagnosis: 'Trào ngược dạ dày thực quản (GERD) - Viêm hang vị dạ dày',
    diseaseCategory: 'Tiêu hóa - Gan mật',
    followUpDate: '2026-11-01',
    doctorNotes: 'Kiêng đồ chua cay, cà phê, nước có gas; không nằm ngay sau khi ăn 2 tiếng',
    consultationFee: 150000,
    paymentStatus: 'Chưa thu',
    prescriptions: [
      { id: 'T5', drugName: 'Esomeprazol 40mg', unit: 'Viên', morning: 1, noon: 0, afternoon: 0, evening: 0, days: 14, price: 8500, note: 'Uống trước ăn sáng 30 phút' },
      { id: 'T6', drugName: 'Domperidon 10mg', unit: 'Viên', morning: 1, noon: 1, afternoon: 0, evening: 1, days: 7, price: 2500, note: 'Uống trước ăn 15 phút' },
      { id: 'T7', drugName: 'Phosphalugel (Sữa dạ dày)', unit: 'Gói', morning: 0, noon: 1, afternoon: 0, evening: 1, days: 7, price: 6500, note: 'Uống sau ăn 1 giờ hoặc khi đau' }
    ],
    labs: [
      { id: 'XN3', type: 'Xét nghiệm', name: 'Test hơi thở tìm vi khuẩn H.Pylori (C13)', result: 'Âm tính (-)', cost: 350000, status: 'Đã có KQ', attachment: 'Test_HP_BN0002.pdf' }
    ]
  },
  {
    visitId: 'LK261024-01',
    patientId: 'BN0003',
    visitDate: '2026-10-24',
    height: 165,
    weight: 68,
    bp: '130/80',
    pulse: 78,
    symptoms: 'Đau khớp gối phải khi lên cầu thang, lục cục khớp, tê nhẹ bàn chân',
    diagnosis: 'Thoái hóa khớp gối phải - Đái tháo đường tuýp 2 ổn định',
    diseaseCategory: 'Cơ xương khớp - Nội tiết',
    followUpDate: '2026-10-25',
    doctorNotes: 'Tái khám đọc kết quả X-quang khớp gối và xét nghiệm HbA1c',
    consultationFee: 150000,
    paymentStatus: 'Đã thu',
    prescriptions: [
      { id: 'T8', drugName: 'Metformin 850mg', unit: 'Viên', morning: 1, noon: 0, afternoon: 0, evening: 1, days: 15, price: 3200, note: 'Uống ngay sau ăn' },
      { id: 'T9', drugName: 'Glucosamin Sulfate 1500mg', unit: 'Gói', morning: 1, noon: 0, afternoon: 0, evening: 0, days: 15, price: 9000, note: 'Pha nước uống sau ăn sáng' },
      { id: 'T10', drugName: 'Celecoxib 200mg', unit: 'Viên', morning: 1, noon: 0, afternoon: 0, evening: 0, days: 5, price: 7500, note: 'Uống sau ăn no' }
    ],
    labs: [
      { id: 'XN4', type: 'Chụp X-Quang', name: 'X-Quang khớp gối phải (Thẳng - Nghiêng)', result: 'Hẹp khe khớp đùi chày trong, gai xương nhỏ bờ khớp', cost: 180000, status: 'Đã có KQ', attachment: 'XQuang_GoiP_BN0003.jpg' },
      { id: 'XN5', type: 'Thử máu', name: 'Đường huyết đói (Glucose) & HbA1c', result: 'Glucose: 6.4 mmol/L | HbA1c: 6.5% (Kiểm soát tốt)', cost: 250000, status: 'Đã có KQ', attachment: 'XN_DuongHuyet_BN0003.pdf' }
    ]
  },
  {
    visitId: 'LK261022-01',
    patientId: 'BN0004',
    visitDate: '2026-10-22',
    height: 162,
    weight: 50,
    bp: '105/65',
    pulse: 72,
    symptoms: 'Hắt hơi liên tục buổi sáng, chảy nước mũi trong, ngứa mũi',
    diagnosis: 'Viêm mũi dị ứng cấp do thời tiết',
    diseaseCategory: 'Tai Mũi Họng - Hô hấp',
    followUpDate: '2026-10-29',
    doctorNotes: 'Rửa mũi bằng nước muối sinh lý ấm mỗi tối, đeo khẩu trang khi ra ngoài',
    consultationFee: 150000,
    paymentStatus: 'Đã thu',
    prescriptions: [
      { id: 'T11', drugName: 'Fexofenadin 180mg', unit: 'Viên', morning: 1, noon: 0, afternoon: 0, evening: 0, days: 7, price: 5500, note: 'Uống sau ăn sáng (không gây buồn ngủ)' },
      { id: 'T12', drugName: 'Xịt mũi Fluticason (Avamys)', unit: 'Chai', morning: 1, noon: 0, afternoon: 0, evening: 1, days: 1, price: 185000, note: 'Xịt mỗi bên mũi 1 nhát sáng - tối' }
    ],
    labs: []
  },
  {
    visitId: 'LK261020-01',
    patientId: 'BN0005',
    visitDate: '2026-10-20',
    height: 172,
    weight: 79,
    bp: '125/80',
    pulse: 75,
    symptoms: 'Khám sức khỏe tổng quát, đau nhẹ ngón chân cái bên trái sau ăn tiệc',
    diagnosis: 'Tăng Acid Uric máu - Theo dõi Gout cấp / Gan nhiễm mỡ độ 1',
    diseaseCategory: 'Cơ xương khớp - Nội tiết',
    followUpDate: '2026-11-05',
    doctorNotes: 'Kiêng rượu bia, hải sản, thịt đỏ, nội tạng động vật; uống đủ 2.5 lít nước/ngày',
    consultationFee: 150000,
    paymentStatus: 'Đã thu',
    prescriptions: [
      { id: 'T13', drugName: 'Febuxostat 40mg', unit: 'Viên', morning: 1, noon: 0, afternoon: 0, evening: 0, days: 15, price: 8000, note: 'Uống sau ăn sáng' },
      { id: 'T14', drugName: 'Silymarin 140mg (Bổ gan)', unit: 'Viên', morning: 1, noon: 0, afternoon: 0, evening: 1, days: 15, price: 4500, note: 'Uống sau ăn' }
    ],
    labs: [
      { id: 'XN6', type: 'Thử máu', name: 'Acid Uric máu & Men gan (AST, ALT, GGT)', result: 'Acid Uric: 485 µmol/L (Cao) | AST: 42 U/L, ALT: 55 U/L', cost: 240000, status: 'Đã có KQ', attachment: 'XN_SinhHoa_BN0005.pdf' },
      { id: 'XN7', type: 'Siêu âm', name: 'Siêu âm bụng tổng quát màu', result: 'Gan tăng sáng nhẹ (Gan nhiễm mỡ độ 1), thận không sỏi', cost: 200000, status: 'Đã có KQ', attachment: 'SieuAm_BN0005.jpg' }
    ]
  }
];

// Danh mục thuốc mẫu giúp bác sĩ chọn nhanh
const DRUG_CATALOG = [
  { name: 'Amlodipin 5mg', unit: 'Viên', price: 3500, defaultNote: 'Uống sau ăn sáng', m: 1, n: 0, a: 0, e: 0 },
  { name: 'Esomeprazol 40mg', unit: 'Viên', price: 8500, defaultNote: 'Uống trước ăn sáng 30 phút', m: 1, n: 0, a: 0, e: 0 },
  { name: 'Paracetamol 500mg', unit: 'Viên', price: 1500, defaultNote: 'Uống sau ăn khi đau/sốt > 38.5 độ', m: 1, n: 1, a: 0, e: 1 },
  { name: 'Amoxicillin + Clavulanat 1g', unit: 'Viên', price: 12000, defaultNote: 'Uống ngay sau ăn', m: 1, n: 0, a: 0, e: 1 },
  { name: 'Domperidon 10mg', unit: 'Viên', price: 2500, defaultNote: 'Uống trước ăn 15 phút', m: 1, n: 1, a: 0, e: 1 },
  { name: 'Betahistin 16mg', unit: 'Viên', price: 4200, defaultNote: 'Uống sau ăn no', m: 1, n: 0, a: 0, e: 1 },
  { name: 'Metformin 850mg', unit: 'Viên', price: 3200, defaultNote: 'Uống ngay sau ăn', m: 1, n: 0, a: 0, e: 1 },
  { name: 'Celecoxib 200mg', unit: 'Viên', price: 7500, defaultNote: 'Uống sau ăn no', m: 1, n: 0, a: 0, e: 0 },
  { name: 'Fexofenadin 180mg', unit: 'Viên', price: 5500, defaultNote: 'Uống sau ăn sáng', m: 1, n: 0, a: 0, e: 0 },
  { name: 'Phosphalugel (Sữa dạ dày)', unit: 'Gói', price: 6500, defaultNote: 'Uống sau ăn 1 giờ hoặc khi đau', m: 0, n: 1, a: 0, e: 1 },
  { name: 'Vitamin 3B (B1-B6-B12)', unit: 'Viên', price: 2000, defaultNote: 'Uống sau ăn sáng - trưa', m: 1, n: 1, a: 0, e: 0 }
];

// Danh mục xét nghiệm / X-Quang mẫu
const LAB_CATALOG = [
  { type: 'Thử máu', name: 'Công thức máu 18 thông số (CBC)', cost: 120000 },
  { type: 'Thử máu', name: 'Xét nghiệm mỡ máu (Cholesterol, Triglyceride, HDL, LDL)', cost: 220000 },
  { type: 'Thử máu', name: 'Đường huyết đói (Glucose) & HbA1c', cost: 250000 },
  { type: 'Thử máu', name: 'Acid Uric máu & Chức năng gan thận (AST, ALT, Creatinin)', cost: 240000 },
  { type: 'Chụp X-Quang', name: 'X-Quang tim phổi thẳng kỹ thuật số', cost: 160000 },
  { type: 'Chụp X-Quang', name: 'X-Quang cột sống thắt lưng (Thẳng - Nghiêng)', cost: 190000 },
  { type: 'Chụp X-Quang', name: 'X-Quang khớp gối (Thẳng - Nghiêng)', cost: 180000 },
  { type: 'Siêu âm', name: 'Siêu âm bụng tổng quát màu', cost: 200000 },
  { type: 'Điện tim', name: 'Điện tâm đồ (ECG) 12 chuyển đạo', cost: 100000 },
  { type: 'Xét nghiệm', name: 'Test hơi thở tìm vi khuẩn H.Pylori (C13)', cost: 350000 }
];

// Hàm hỗ trợ định dạng tiền tệ VNĐ
const formatVND = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
};

// Hàm tính tuổi từ ngày sinh
const calculateAge = (dobString) => {
  if (!dobString) return '--';
  const birthYear = new Date(dobString).getFullYear();
  const currentYear = 2026;
  return currentYear - birthYear;
};

export default function App() {
  const [activeTab, setActiveTab] = useState('tab1');
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const [visits, setVisits] = useState(INITIAL_VISITS);

  // State bộ lọc Tab 1
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'today' | 'followup_today' | 'unpaid'

  // State bệnh nhân & lượt khám đang chọn ở Tab 2 & Tab 3
  const [selectedPatientId, setSelectedPatientId] = useState('BN0001');
  const [selectedVisitId, setSelectedVisitId] = useState('LK261025-01');

  // State modal thêm bệnh nhân mới
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false);
  const [newPatientForm, setNewPatientForm] = useState({
    name: '',
    dob: '1985-01-01',
    gender: 'Nam',
    phone: '',
    occupation: '',
    address: '',
    medicalHistory: '',
    allergies: ''
  });

  // State modal xem trước Google Sheets & Apps Script
  const [isSheetModalOpen, setIsSheetModalOpen] = useState(false);
  const [sheetPreviewTab, setSheetPreviewTab] = useState('Benh_Nhan');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('23:10:02 - 25/10/2026');
  const [toastMessage, setToastMessage] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // State modal in đơn thuốc / phiếu thu
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // State form thêm thuốc mới vào đơn
  const [drugDraft, setDrugDraft] = useState({
    drugName: '',
    unit: 'Viên',
    morning: 1,
    noon: 0,
    afternoon: 0,
    evening: 1,
    days: 7,
    price: 3500,
    note: 'Uống sau ăn'
  });

  // State form thêm xét nghiệm / X-quang mới
  const [labDraft, setLabDraft] = useState({
    type: 'Thử máu',
    name: '',
    result: '',
    cost: 150000,
    status: 'Đã có KQ',
    attachment: ''
  });

  // Hiển thị thông báo nhanh (Toast)
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Đồng bộ giả lập với Google Sheets
  const handleSyncToGoogleSheets = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')} - 25/10/2026`;
      setLastSyncTime(timeStr);
      showToast('Đã đồng bộ dữ liệu bệnh nhân, đơn thuốc & chi phí lên Google Sheets!');
    }, 700);
  };

  // Lấy bệnh nhân đang chọn
  const selectedPatient = useMemo(() => {
    return patients.find((p) => p.id === selectedPatientId) || patients[0];
  }, [patients, selectedPatientId]);

  // Lấy danh sách các lượt khám của bệnh nhân đang chọn (mới nhất lên đầu)
  const patientVisits = useMemo(() => {
    return visits
      .filter((v) => v.patientId === selectedPatient?.id)
      .sort((a, b) => b.visitDate.localeCompare(a.visitDate));
  }, [visits, selectedPatient]);

  // Lượt khám đang chọn
  const currentVisit = useMemo(() => {
    const found = patientVisits.find((v) => v.visitId === selectedVisitId);
    return found || patientVisits[0] || null;
  }, [patientVisits, selectedVisitId]);

  // Khi click vào tên bệnh nhân ở Tab 1 -> chuyển sang Tab 2
  const handleSelectPatientFromList = (patientId) => {
    setSelectedPatientId(patientId);
    const pVisits = visits
      .filter((v) => v.patientId === patientId)
      .sort((a, b) => b.visitDate.localeCompare(a.visitDate));
    if (pVisits.length > 0) {
      setSelectedVisitId(pVisits[0].visitId);
    }
    setActiveTab('tab2');
  };

  // Danh sách bệnh nhân đã lọc ở Tab 1 kèm thông tin lượt khám gần nhất
  const enrichedPatients = useMemo(() => {
    return patients.map((p) => {
      const pVisits = visits
        .filter((v) => v.patientId === p.id)
        .sort((a, b) => b.visitDate.localeCompare(a.visitDate));
      const latestVisit = pVisits[0] || null;
      return {
        ...p,
        age: calculateAge(p.dob),
        visitCount: pVisits.length,
        latestVisit
      };
    });
  }, [patients, visits]);

  const filteredPatients = useMemo(() => {
    return enrichedPatients.filter((p) => {
      const q = searchQuery.trim().toLowerCase();
      const matchQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        (p.latestVisit?.diagnosis || '').toLowerCase().includes(q);

      if (!matchQuery) return false;

      if (filterMode === 'today') {
        return p.latestVisit?.visitDate === '2026-10-25';
      }
      if (filterMode === 'followup_today') {
        return p.latestVisit?.followUpDate === '2026-10-25';
      }
      if (filterMode === 'unpaid') {
        return p.latestVisit?.paymentStatus === 'Chưa thu';
      }
      return true;
    });
  }, [enrichedPatients, searchQuery, filterMode]);

  // Cập nhật thông tin hành chính của bệnh nhân đang chọn
  const handleUpdatePatientField = (field, value) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === selectedPatient.id ? { ...p, [field]: value } : p))
    );
  };

  // Cập nhật thông tin lượt khám đang chọn
  const handleUpdateVisitField = (field, value) => {
    if (!currentVisit) return;
    setVisits((prev) =>
      prev.map((v) =>
        v.visitId === currentVisit.visitId ? { ...v, [field]: value } : v
      )
    );
  };

  // Tạo bệnh nhân mới + tạo luôn 1 lượt khám hôm nay
  const handleCreateNewPatient = (e) => {
    e.preventDefault();
    if (!newPatientForm.name.trim()) return;

    const nextNum = patients.length + 1;
    const newId = `BN${String(nextNum).padStart(4, '0')}`;
    const newVisitId = `LK261025-0${visits.length + 1}`;

    const createdPatient = {
      id: newId,
      name: newPatientForm.name.trim(),
      dob: newPatientForm.dob || '1985-01-01',
      gender: newPatientForm.gender,
      phone: newPatientForm.phone || '0900000000',
      occupation: newPatientForm.occupation || 'Tự do',
      address: newPatientForm.address || 'TP.HCM',
      medicalHistory: newPatientForm.medicalHistory || 'Chưa ghi nhận bệnh lý nền',
      allergies: newPatientForm.allergies || 'Không ghi nhận dị ứng',
      createdAt: '2026-10-25'
    };

    const initialVisit = {
      visitId: newVisitId,
      patientId: newId,
      visitDate: '2026-10-25',
      height: 165,
      weight: 60,
      bp: '120/80',
      pulse: 75,
      symptoms: 'Khám mới - đang nhập triệu chứng',
      diagnosis: 'Đang khám & chẩn đoán',
      diseaseCategory: 'Nội tổng quát',
      followUpDate: '2026-11-01',
      doctorNotes: '',
      consultationFee: 150000,
      paymentStatus: 'Chưa thu',
      prescriptions: [],
      labs: []
    };

    setPatients([createdPatient, ...patients]);
    setVisits([initialVisit, ...visits]);
    setSelectedPatientId(newId);
    setSelectedVisitId(newVisitId);
    setIsNewPatientModalOpen(false);
    setNewPatientForm({
      name: '',
      dob: '1985-01-01',
      gender: 'Nam',
      phone: '',
      occupation: '',
      address: '',
      medicalHistory: '',
      allergies: ''
    });
    setActiveTab('tab2');
    showToast(`Đã tạo bệnh nhân ${createdPatient.name} (${newId}) và mở hồ sơ khám!`);
  };

  // Tạo lượt tái khám mới cho bệnh nhân hiện tại
  const handleCreateNewVisitForPatient = () => {
    if (!selectedPatient) return;
    const newVisitId = `LK261025-${String(visits.length + 1).padStart(2, '0')}`;
    const newVisit = {
      visitId: newVisitId,
      patientId: selectedPatient.id,
      visitDate: '2026-10-25',
      height: currentVisit?.height || 165,
      weight: currentVisit?.weight || 60,
      bp: '120/80',
      pulse: 76,
      symptoms: '',
      diagnosis: '',
      diseaseCategory: currentVisit?.diseaseCategory || 'Nội tổng quát',
      followUpDate: '2026-11-01',
      doctorNotes: '',
      consultationFee: 150000,
      paymentStatus: 'Chưa thu',
      prescriptions: [],
      labs: []
    };
    setVisits([newVisit, ...visits]);
    setSelectedVisitId(newVisitId);
    showToast(`Đã tạo lượt khám mới (${newVisitId}) cho bệnh nhân ${selectedPatient.name}`);
  };

  // Chọn thuốc mẫu từ danh mục
  const handleSelectCatalogDrug = (drugName) => {
    const found = DRUG_CATALOG.find((d) => d.name === drugName);
    if (found) {
      setDrugDraft({
        ...drugDraft,
        drugName: found.name,
        unit: found.unit,
        price: found.price,
        note: found.defaultNote,
        morning: found.m,
        noon: found.n,
        afternoon: found.a,
        evening: found.e
      });
    } else {
      setDrugDraft({ ...drugDraft, drugName });
    }
  };

  // Thêm thuốc vào toa hiện tại
  const handleAddDrugToPrescription = (e) => {
    e.preventDefault();
    if (!currentVisit || !drugDraft.drugName.trim()) return;
    const newDrug = {
      id: `T${Date.now()}`,
      ...drugDraft,
      morning: Number(drugDraft.morning) || 0,
      noon: Number(drugDraft.noon) || 0,
      afternoon: Number(drugDraft.afternoon) || 0,
      evening: Number(drugDraft.evening) || 0,
      days: Number(drugDraft.days) || 1,
      price: Number(drugDraft.price) || 0
    };
    handleUpdateVisitField('prescriptions', [...currentVisit.prescriptions, newDrug]);
    setDrugDraft({
      drugName: '',
      unit: 'Viên',
      morning: 1,
      noon: 0,
      afternoon: 0,
      evening: 1,
      days: 7,
      price: 3500,
      note: 'Uống sau ăn'
    });
    showToast(`Đã thêm "${newDrug.drugName}" vào đơn thuốc!`);
  };

  const handleRemoveDrug = (drugId) => {
    if (!currentVisit) return;
    handleUpdateVisitField(
      'prescriptions',
      currentVisit.prescriptions.filter((d) => d.id !== drugId)
    );
  };

  // Chọn xét nghiệm / X-Quang từ danh mục mẫu
  const handleSelectCatalogLab = (labName) => {
    const found = LAB_CATALOG.find((l) => l.name === labName);
    if (found) {
      setLabDraft({
        ...labDraft,
        type: found.type,
        name: found.name,
        cost: found.cost
      });
    } else {
      setLabDraft({ ...labDraft, name: labName });
    }
  };

  // Thêm chỉ định cận lâm sàng
  const handleAddLabToVisit = (e) => {
    e.preventDefault();
    if (!currentVisit || !labDraft.name.trim()) return;
    const newLab = {
      id: `XN${Date.now()}`,
      ...labDraft,
      cost: Number(labDraft.cost) || 0,
      attachment: labDraft.attachment || `KQ_${currentVisit.patientId}.pdf`
    };
    handleUpdateVisitField('labs', [...currentVisit.labs, newLab]);
    setLabDraft({
      type: 'Thử máu',
      name: '',
      result: '',
      cost: 150000,
      status: 'Đã có KQ',
      attachment: ''
    });
    showToast(`Đã thêm chỉ định "${newLab.name}"!`);
  };

  const handleRemoveLab = (labId) => {
    if (!currentVisit) return;
    handleUpdateVisitField(
      'labs',
      currentVisit.labs.filter((l) => l.id !== labId)
    );
  };

  // Tính toán chi phí của lượt khám hiện tại
  const currentVisitFinancials = useMemo(() => {
    if (!currentVisit) {
      return { consultationFee: 0, drugTotal: 0, labTotal: 0, grandTotal: 0 };
    }
    const consultationFee = Number(currentVisit.consultationFee) || 0;
    const drugTotal = currentVisit.prescriptions.reduce((sum, item) => {
      const dailyQty =
        (Number(item.morning) || 0) +
        (Number(item.noon) || 0) +
        (Number(item.afternoon) || 0) +
        (Number(item.evening) || 0);
      const totalQty = dailyQty > 0 ? dailyQty * (Number(item.days) || 1) : Number(item.days) || 1;
      return sum + totalQty * (Number(item.price) || 0);
    }, 0);
    const labTotal = currentVisit.labs.reduce((sum, item) => sum + (Number(item.cost) || 0), 0);
    return {
      consultationFee,
      drugTotal,
      labTotal,
      grandTotal: consultationFee + drugTotal + labTotal
    };
  }, [currentVisit]);

  // Tính chỉ số BMI
  const currentBMI = useMemo(() => {
    if (!currentVisit?.height || !currentVisit?.weight) return null;
    const hMeter = Number(currentVisit.height) / 100;
    if (hMeter <= 0) return null;
    const bmi = Number(currentVisit.weight) / (hMeter * hMeter);
    return bmi.toFixed(1);
  }, [currentVisit]);

  // Thống kê tổng quan phòng khám
  const clinicStats = useMemo(() => {
    const totalPatients = patients.length;
    const todayVisits = visits.filter((v) => v.visitDate === '2026-10-25').length;
    const followUpToday = visits.filter((v) => v.followUpDate === '2026-10-25').length;
    const unpaidCount = visits.filter((v) => v.paymentStatus === 'Chưa thu').length;
    return { totalPatients, todayVisits, followUpToday, unpaidCount };
  }, [patients, visits]);

  // Copy code Apps Script
  const appsScriptCode = `// Dán đoạn mã này vào Extensions > Apps Script trong Google Sheets của Phòng Khám
function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const data = JSON.parse(e.postData.contents);
  
  if (data.action === 'SAVE_PATIENT') {
    const sheet = ss.getSheetByName('Benh_Nhan');
    sheet.appendRow([
      data.id, data.name, data.dob, data.gender, 
      "'" + data.phone, data.occupation, data.address, 
      data.medicalHistory, data.allergies, new Date()
    ]);
  }
  
  if (data.action === 'SAVE_VISIT_AND_PRESCRIPTION') {
    const visitSheet = ss.getSheetByName('Luot_Kham');
    visitSheet.appendRow([
      data.visitId, data.patientId, data.visitDate,
      data.height, data.weight, data.bp, data.diagnosis,
      data.followUpDate, data.grandTotal, data.paymentStatus
    ]);
  }
  
  return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}`;

  const handleCopyCode = () => {
    try {
      navigator.clipboard.writeText(appsScriptCode);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = appsScriptCode;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-12">
      {/* THÔNG BÁO TOAST */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 bg-teal-900 text-white px-4 py-3 rounded-xl shadow-xl border border-teal-700 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* HEADER PHÒNG KHÁM & TRẠNG THÁI GOOGLE SHEETS */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-sm">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                  MediCare Clinic Pro
                </h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                  Bản chạy thử 3 Tab
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Hệ thống quản lý phòng khám tư nhân 1 bác sĩ • Liên kết trực tiếp Google Sheets
              </p>
            </div>
          </div>

          {/* Cụm nút Google Sheets */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Google Sheets: Đã kết nối ({lastSyncTime})</span>
            </div>

            <button
              type="button"
              onClick={() => setIsSheetModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Xem Bảng Google Sheets ({patients.length} BN)
            </button>

            <button
              type="button"
              onClick={handleSyncToGoogleSheets}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-teal-600 text-white hover:bg-teal-700 shadow-sm transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Đang lưu Sheet...' : 'Lưu lên Google Sheet'}
            </button>
          </div>
        </div>

        {/* THANH ĐIỀU HƯỚNG 3 TAB CHÍNH */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between border-t border-slate-100 bg-slate-50/60 overflow-x-auto">
          <div className="flex items-center space-x-1 py-1.5">
            <button
              type="button"
              onClick={() => setActiveTab('tab1')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition whitespace-nowrap ${
                activeTab === 'tab1'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Tab 1: Danh sách Bệnh nhân</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  activeTab === 'tab1' ? 'bg-teal-800 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {patients.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('tab2')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition whitespace-nowrap ${
                activeTab === 'tab2'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Tab 2: Thông tin & Khám bệnh</span>
              {selectedPatient && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    activeTab === 'tab2' ? 'bg-teal-800 text-teal-100' : 'bg-teal-100 text-teal-800'
                  }`}
                >
                  {selectedPatient.name}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('tab3')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition whitespace-nowrap ${
                activeTab === 'tab3'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Tab 3: Đơn thuốc, Xét nghiệm & Chi phí</span>
              {currentVisit && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    activeTab === 'tab3'
                      ? 'bg-teal-800 text-amber-200'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {formatVND(currentVisitFinancials.grandTotal)}
                </span>
              )}
            </button>
          </div>

          {/* Chú thích bệnh nhân đang chọn */}
          {selectedPatient && (
            <div className="hidden lg:flex items-center gap-2 text-xs text-slate-600 pr-2">
              <span>Đang mở hồ sơ:</span>
              <strong className="text-teal-700 font-semibold">
                {selectedPatient.id} - {selectedPatient.name} ({calculateAge(selectedPatient.dob)} tuổi)
              </strong>
            </div>
          )}
        </div>
      </header>

      {/* NỘI DUNG CHÍNH THEO TỪNG TAB */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* =========================================================
            TAB 1: QUẢN LÝ TẤT CẢ BỆNH NHÂN & TÌM KIẾM
           ========================================================= */}
        {activeTab === 'tab1' && (
          <div className="space-y-6">
            {/* 4 Thẻ thống kê nhanh */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">Tổng số bệnh nhân</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{clinicStats.totalPatients}</p>
                  <p className="text-xs text-teal-600 mt-0.5">Lưu trữ trên Sheet Benh_Nhan</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">Khám trong hôm nay</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{clinicStats.todayVisits}</p>
                  <p className="text-xs text-blue-600 mt-0.5">Ngày 25/10/2026</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Activity className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">Có lịch hẹn tái khám</p>
                  <p className="text-2xl font-bold text-amber-600 mt-1">{clinicStats.followUpToday}</p>
                  <p className="text-xs text-amber-700 mt-0.5">Cần gọi nhắc bệnh nhân</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Calendar className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">Chờ thu viện phí</p>
                  <p className="text-2xl font-bold text-rose-600 mt-1">{clinicStats.unpaidCount}</p>
                  <p className="text-xs text-rose-600 mt-0.5">Xem tại Tab 3</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <CreditCard className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Thanh tìm kiếm & Nút thêm bệnh nhân */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Ô tìm kiếm */}
                <div className="relative flex-1">
                  <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm nhanh theo Tên bệnh nhân, Mã BN (VD: BN0001), Số điện thoại hoặc Chẩn đoán..."
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                    >
                      Xóa
                    </button>
                  )}
                </div>

                {/* Nút thêm bệnh nhân mới */}
                <button
                  type="button"
                  onClick={() => setIsNewPatientModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 shadow-sm transition shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  Thêm bệnh nhân mới
                </button>
              </div>

              {/* Các nút lọc nhanh */}
              <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-slate-100">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium text-slate-500">Lọc nhanh:</span>
                  <button
                    type="button"
                    onClick={() => setFilterMode('all')}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                      filterMode === 'all'
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Tất cả bệnh nhân ({patients.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterMode('today')}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                      filterMode === 'today'
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Khám hôm nay (25/10)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterMode('followup_today')}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                      filterMode === 'followup_today'
                        ? 'bg-amber-600 text-white'
                        : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                    }`}
                  >
                    Hẹn tái khám hôm nay
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterMode('unpaid')}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                      filterMode === 'unpaid'
                        ? 'bg-rose-600 text-white'
                        : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                    }`}
                  >
                    Chưa thu phí
                  </button>
                </div>

                <p className="text-xs text-slate-500 italic">
                  💡 Click trực tiếp vào tên hoặc dòng bệnh nhân bất kỳ để mở <strong>Tab 2 (Hồ sơ khám)</strong>
                </p>
              </div>
            </div>

            {/* BẢNG DANH SÁCH TẤT CẢ BỆNH NHÂN */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      <th className="py-3.5 px-4">Mã BN</th>
                      <th className="py-3.5 px-4">Họ và Tên Bệnh nhân</th>
                      <th className="py-3.5 px-4">Tuổi / GT</th>
                      <th className="py-3.5 px-4">Số điện thoại</th>
                      <th className="py-3.5 px-4">Chẩn đoán & Lần khám gần nhất</th>
                      <th className="py-3.5 px-4">Hẹn tái khám</th>
                      <th className="py-3.5 px-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredPatients.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-10 text-center text-slate-500">
                          Không tìm thấy bệnh nhân nào khớp với từ khóa "{searchQuery}".
                        </td>
                      </tr>
                    ) : (
                      filteredPatients.map((p) => (
                        <tr
                          key={p.id}
                          onClick={() => handleSelectPatientFromList(p.id)}
                          className="hover:bg-teal-50/60 cursor-pointer transition group"
                        >
                          <td className="py-3.5 px-4 font-mono text-xs font-bold text-teal-700">
                            {p.id}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-900 group-hover:text-teal-700 flex items-center gap-1.5">
                              <span>{p.name}</span>
                              {p.allergies && !p.allergies.includes('Không') && (
                                <span
                                  title={p.allergies}
                                  className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-100 text-rose-700"
                                >
                                  Dị ứng
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-500 truncate max-w-xs">
                              {p.occupation} • {p.address}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-700">
                            <span className="font-medium">{p.age} tuổi</span>
                            <span className="text-xs text-slate-400 block">{p.gender}</span>
                          </td>
                          <td className="py-3.5 px-4 font-medium text-slate-700">
                            {p.phone}
                          </td>
                          <td className="py-3.5 px-4">
                            {p.latestVisit ? (
                              <div>
                                <span className="font-medium text-slate-800 block">
                                  {p.latestVisit.diagnosis}
                                </span>
                                <span className="text-xs text-slate-500">
                                  Khám ngày: {p.latestVisit.visitDate} ({p.visitCount} lần khám)
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400 italic">Chưa có lượt khám</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            {p.latestVisit?.followUpDate ? (
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                                  p.latestVisit.followUpDate === '2026-10-25'
                                    ? 'bg-amber-100 text-amber-800 font-semibold'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                <Calendar className="w-3 h-3" />
                                {p.latestVisit.followUpDate}
                              </span>
                            ) : (
                              <span className="text-xs text-slate-400">--</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectPatientFromList(p.id);
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-50 text-teal-700 group-hover:bg-teal-600 group-hover:text-white transition"
                            >
                              <span>Mở hồ sơ</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 2: THÔNG TIN BỆNH NHÂN, LỊCH SỬ KHÁM & TOA THUỐC
           ========================================================= */}
        {activeTab === 'tab2' && selectedPatient && (
          <div className="space-y-6">
            {/* Thanh công cụ đầu Tab 2 */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('tab1')}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                >
                  ← Quay lại danh sách
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                      {selectedPatient.id}
                    </span>
                    <h2 className="text-lg font-bold text-slate-900">
                      {selectedPatient.name}
                    </h2>
                    <span className="text-sm text-slate-500">
                      ({calculateAge(selectedPatient.dob)} tuổi - {selectedPatient.gender})
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleCreateNewVisitForPatient}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition"
                >
                  <Plus className="w-4 h-4" />
                  Tạo lượt khám mới hôm nay
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('tab3')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-teal-600 text-white hover:bg-teal-700 shadow-sm transition"
                >
                  <span>Sang Tab 3: Đơn thuốc & Chi phí</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* CẢNH BÁO TIỀN SỬ BỆNH & DỊ ỨNG THUỐC NỔI BẬT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3">
                <HeartPulse className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <label className="block text-xs font-bold uppercase text-amber-900">
                    Tiền sử bệnh lý nền (Cố định theo bệnh nhân)
                  </label>
                  <input
                    type="text"
                    value={selectedPatient.medicalHistory}
                    onChange={(e) => handleUpdatePatientField('medicalHistory', e.target.value)}
                    className="mt-1 w-full bg-white/90 border border-amber-300 rounded-lg px-2.5 py-1.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="bg-rose-50/90 border border-rose-200 rounded-xl p-3.5 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <label className="block text-xs font-bold uppercase text-rose-900">
                    Cảnh báo Dị ứng thuốc / Thức ăn (Bác sĩ lưu ý khi kê toa)
                  </label>
                  <input
                    type="text"
                    value={selectedPatient.allergies}
                    onChange={(e) => handleUpdatePatientField('allergies', e.target.value)}
                    className="mt-1 w-full bg-white/90 border border-rose-300 rounded-lg px-2.5 py-1.5 text-sm font-medium text-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>
            </div>

            {/* BỐ CỤC CHÍNH TAB 2: TRÁI (HÀNH CHÍNH + LỊCH SỬ KHÁM) | PHẢI (CHI TIẾT LƯỢT KHÁM & ĐƠN THUỐC) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* CỘT TRÁI (4 CỘT): THÔNG TIN HÀNH CHÍNH & DANH SÁCH LỊCH SỬ KHÁM */}
              <div className="lg:col-span-4 space-y-6">
                {/* Khối 1: Thông tin hành chính */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3.5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-teal-600" />
                      Thông tin hành chính
                    </h3>
                    <span className="text-[11px] text-slate-400">Tự động lưu</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className="text-xs font-medium text-slate-500">Họ và tên bệnh nhân</label>
                      <input
                        type="text"
                        value={selectedPatient.name}
                        onChange={(e) => handleUpdatePatientField('name', e.target.value)}
                        className="mt-1 w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-500">Ngày sinh</label>
                      <input
                        type="date"
                        value={selectedPatient.dob}
                        onChange={(e) => handleUpdatePatientField('dob', e.target.value)}
                        className="mt-1 w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-500">Tuổi & Giới tính</label>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="px-2.5 py-1.5 bg-slate-100 rounded-lg text-sm font-semibold text-slate-700 shrink-0">
                          {calculateAge(selectedPatient.dob)}t
                        </span>
                        <select
                          value={selectedPatient.gender}
                          onChange={(e) => handleUpdatePatientField('gender', e.target.value)}
                          className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                        >
                          <option value="Nam">Nam</option>
                          <option value="Nữ">Nữ</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-500">Số điện thoại</label>
                      <input
                        type="text"
                        value={selectedPatient.phone}
                        onChange={(e) => handleUpdatePatientField('phone', e.target.value)}
                        className="mt-1 w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-500">Nghề nghiệp</label>
                      <input
                        type="text"
                        value={selectedPatient.occupation}
                        onChange={(e) => handleUpdatePatientField('occupation', e.target.value)}
                        className="mt-1 w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="text-xs font-medium text-slate-500">Địa chỉ liên hệ</label>
                      <input
                        type="text"
                        value={selectedPatient.address}
                        onChange={(e) => handleUpdatePatientField('address', e.target.value)}
                        className="mt-1 w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Khối 2: Lịch sử các lần khám */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-teal-600" />
                      Lịch sử các đợt khám ({patientVisits.length})
                    </h3>
                    <button
                      type="button"
                      onClick={handleCreateNewVisitForPatient}
                      className="text-xs font-semibold text-teal-600 hover:text-teal-800"
                    >
                      + Thêm đợt khám
                    </button>
                  </div>

                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {patientVisits.map((v) => {
                      const isSelected = currentVisit?.visitId === v.visitId;
                      return (
                        <button
                          key={v.visitId}
                          type="button"
                          onClick={() => setSelectedVisitId(v.visitId)}
                          className={`w-full text-left p-3 rounded-xl border transition ${
                            isSelected
                              ? 'bg-teal-50/90 border-teal-500 shadow-sm'
                              : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-teal-800">
                              Ngày khám: {v.visitDate}
                            </span>
                            <span className="font-mono text-[11px] text-slate-500">
                              {v.visitId}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-slate-900 mt-1 line-clamp-1">
                            {v.diagnosis || 'Chưa nhập chẩn đoán'}
                          </p>
                          <div className="flex items-center justify-between text-xs text-slate-500 mt-1.5">
                            <span>Toa: {v.prescriptions.length} thuốc</span>
                            <span>Hẹn: {v.followUpDate || '--'}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* CỘT PHẢI (8 CỘT): KHÁM LÂM SÀNG, CHẨN ĐOÁN, HẸN TÁI KHÁM & TOA THUỐC */}
              <div className="lg:col-span-8 space-y-6">
                {currentVisit ? (
                  <>
                    {/* Khối Sinh hiệu & Chẩn đoán bệnh */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <Stethoscope className="w-5 h-5 text-teal-600" />
                          <h3 className="text-base font-bold text-slate-900">
                            Phiếu Khám Bệnh ({currentVisit.visitId})
                          </h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs font-medium text-slate-500">Ngày khám:</label>
                          <input
                            type="date"
                            value={currentVisit.visitDate}
                            onChange={(e) => handleUpdateVisitField('visitDate', e.target.value)}
                            className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                          />
                        </div>
                      </div>

                      {/* Chỉ số sinh hiệu: Chiều cao, Cân nặng, BMI, Huyết áp, Mạch */}
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-500 uppercase flex items-center gap-1">
                            <Ruler className="w-3 h-3 text-teal-600" /> Chiều cao (cm)
                          </label>
                          <input
                            type="number"
                            value={currentVisit.height}
                            onChange={(e) => handleUpdateVisitField('height', e.target.value)}
                            className="mt-1 w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-800"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-slate-500 uppercase flex items-center gap-1">
                            <Scale className="w-3 h-3 text-teal-600" /> Cân nặng (kg)
                          </label>
                          <input
                            type="number"
                            value={currentVisit.weight}
                            onChange={(e) => handleUpdateVisitField('weight', e.target.value)}
                            className="mt-1 w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-800"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-slate-500 uppercase">
                            Chỉ số BMI (Tự tính)
                          </label>
                          <div className="mt-1 px-2.5 py-1.5 bg-teal-50 border border-teal-200 rounded-lg text-sm font-bold text-teal-800 text-center">
                            {currentBMI || '--'} kg/m²
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-slate-500 uppercase">
                            Huyết áp (mmHg)
                          </label>
                          <input
                            type="text"
                            value={currentVisit.bp}
                            onChange={(e) => handleUpdateVisitField('bp', e.target.value)}
                            className="mt-1 w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-800"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-slate-500 uppercase">
                            Mạch (lần/phút)
                          </label>
                          <input
                            type="number"
                            value={currentVisit.pulse}
                            onChange={(e) => handleUpdateVisitField('pulse', e.target.value)}
                            className="mt-1 w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-800"
                          />
                        </div>
                      </div>

                      {/* Triệu chứng, Loại bệnh, Chẩn đoán, Ngày hẹn tái khám */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <label className="text-xs font-semibold text-slate-700">
                            Triệu chứng lâm sàng / Lý do khám
                          </label>
                          <input
                            type="text"
                            value={currentVisit.symptoms}
                            onChange={(e) => handleUpdateVisitField('symptoms', e.target.value)}
                            placeholder="Nhập triệu chứng bệnh nhân khai báo..."
                            className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-slate-700">
                            Nhóm bệnh / Chuyên khoa
                          </label>
                          <select
                            value={currentVisit.diseaseCategory}
                            onChange={(e) => handleUpdateVisitField('diseaseCategory', e.target.value)}
                            className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white"
                          >
                            <option value="Tim mạch - Huyết áp">Tim mạch - Huyết áp</option>
                            <option value="Tiêu hóa - Gan mật">Tiêu hóa - Gan mật</option>
                            <option value="Cơ xương khớp - Nội tiết">Cơ xương khớp - Nội tiết</option>
                            <option value="Tai Mũi Họng - Hô hấp">Tai Mũi Họng - Hô hấp</option>
                            <option value="Nội tổng quát">Nội tổng quát</option>
                            <option value="Thần kinh - Da liễu">Thần kinh - Da liễu</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-slate-700">
                            Ngày hẹn tái khám
                          </label>
                          <input
                            type="date"
                            value={currentVisit.followUpDate}
                            onChange={(e) => handleUpdateVisitField('followUpDate', e.target.value)}
                            className="mt-1 w-full px-3 py-2 bg-amber-50/60 border border-amber-300 rounded-lg text-sm font-semibold text-amber-900"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="text-xs font-semibold text-slate-700">
                            Chẩn đoán xác định của Bác sĩ
                          </label>
                          <input
                            type="text"
                            value={currentVisit.diagnosis}
                            onChange={(e) => handleUpdateVisitField('diagnosis', e.target.value)}
                            placeholder="Nhập chẩn đoán bệnh chính & bệnh kèm theo..."
                            className="mt-1 w-full px-3 py-2 bg-teal-50/40 border border-teal-300 rounded-lg text-sm font-bold text-teal-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="text-xs font-semibold text-slate-700">
                            Lời dặn của Bác sĩ (Chế độ ăn uống, sinh hoạt)
                          </label>
                          <input
                            type="text"
                            value={currentVisit.doctorNotes}
                            onChange={(e) => handleUpdateVisitField('doctorNotes', e.target.value)}
                            placeholder="Ví dụ: Kiêng đồ chua cay, tái khám đúng hẹn..."
                            className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Khối Toa thuốc nhanh trong Tab 2 */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <Pill className="w-5 h-5 text-teal-600" />
                          <h3 className="text-base font-bold text-slate-900">
                            Toa thuốc đang uống ({currentVisit.prescriptions.length} loại thuốc)
                          </h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setIsPrintModalOpen(true)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            Xem / In Toa thuốc
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveTab('tab3')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-50 text-teal-700 hover:bg-teal-100 transition"
                          >
                            Chỉnh sửa chi phí & Xét nghiệm ở Tab 3 →
                          </button>
                        </div>
                      </div>

                      {/* Danh sách thuốc trong đơn */}
                      {currentVisit.prescriptions.length === 0 ? (
                        <p className="text-sm text-slate-400 italic py-4 text-center">
                          Chưa có thuốc trong lượt khám này. Bác sĩ có thể kê nhanh bên dưới.
                        </p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse text-sm">
                            <thead>
                              <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase">
                                <th className="py-2.5 px-3">Tên thuốc & Cách dùng</th>
                                <th className="py-2.5 px-2 text-center">Sáng</th>
                                <th className="py-2.5 px-2 text-center">Trưa</th>
                                <th className="py-2.5 px-2 text-center">Chiều</th>
                                <th className="py-2.5 px-2 text-center">Tối</th>
                                <th className="py-2.5 px-2 text-center">Số ngày</th>
                                <th className="py-2.5 px-3 text-right">Tổng SL</th>
                                <th className="py-2.5 px-2 text-center">Xóa</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {currentVisit.prescriptions.map((item, idx) => {
                                const daily =
                                  (Number(item.morning) || 0) +
                                  (Number(item.noon) || 0) +
                                  (Number(item.afternoon) || 0) +
                                  (Number(item.evening) || 0);
                                const totalQty =
                                  daily > 0 ? daily * (Number(item.days) || 1) : Number(item.days) || 1;
                                return (
                                  <tr key={item.id} className="hover:bg-slate-50">
                                    <td className="py-2.5 px-3">
                                      <div className="font-semibold text-slate-900">
                                        {idx + 1}. {item.drugName}
                                      </div>
                                      <div className="text-xs text-slate-500">{item.note}</div>
                                    </td>
                                    <td className="py-2.5 px-2 text-center font-medium">
                                      {item.morning || '-'}
                                    </td>
                                    <td className="py-2.5 px-2 text-center font-medium">
                                      {item.noon || '-'}
                                    </td>
                                    <td className="py-2.5 px-2 text-center font-medium">
                                      {item.afternoon || '-'}
                                    </td>
                                    <td className="py-2.5 px-2 text-center font-medium">
                                      {item.evening || '-'}
                                    </td>
                                    <td className="py-2.5 px-2 text-center font-semibold text-teal-700">
                                      {item.days} ngày
                                    </td>
                                    <td className="py-2.5 px-3 text-right font-bold text-slate-800">
                                      {totalQty} {item.unit}
                                    </td>
                                    <td className="py-2.5 px-2 text-center">
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveDrug(item.id)}
                                        className="text-slate-400 hover:text-rose-600 p-1"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Form kê thêm thuốc nhanh */}
                      <form
                        onSubmit={handleAddDrugToPrescription}
                        className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-3"
                      >
                        <div className="text-xs font-bold text-slate-700 uppercase">
                          + Kê thêm thuốc vào toa (Chọn nhanh hoặc tự gõ)
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5">
                          <div className="col-span-2 sm:col-span-3">
                            <input
                              list="drug-catalog-list"
                              type="text"
                              value={drugDraft.drugName}
                              onChange={(e) => handleSelectCatalogDrug(e.target.value)}
                              placeholder="Chọn hoặc gõ tên thuốc (VD: Amlodipin 5mg)..."
                              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm"
                            />
                            <datalist id="drug-catalog-list">
                              {DRUG_CATALOG.map((d) => (
                                <option key={d.name} value={d.name} />
                              ))}
                            </datalist>
                          </div>

                          <div>
                            <select
                              value={drugDraft.unit}
                              onChange={(e) => setDrugDraft({ ...drugDraft, unit: e.target.value })}
                              className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-sm"
                            >
                              <option value="Viên">Viên</option>
                              <option value="Gói">Gói</option>
                              <option value="Chai">Chai</option>
                              <option value="Ống">Ống</option>
                            </select>
                          </div>

                          <div>
                            <div className="flex items-center bg-white border border-slate-200 rounded-lg px-2 py-1.5">
                              <span className="text-xs text-slate-400 mr-1">Số ngày:</span>
                              <input
                                type="number"
                                min="1"
                                value={drugDraft.days}
                                onChange={(e) => setDrugDraft({ ...drugDraft, days: e.target.value })}
                                className="w-full text-sm font-bold text-teal-700 focus:outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <button
                              type="submit"
                              className="w-full h-full py-1.5 px-3 bg-teal-600 text-white rounded-lg text-xs font-semibold hover:bg-teal-700 transition"
                            >
                              + Thêm thuốc
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 items-center text-xs">
                          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-slate-200">
                            <span className="text-slate-500">Sáng:</span>
                            <input
                              type="number"
                              min="0"
                              value={drugDraft.morning}
                              onChange={(e) => setDrugDraft({ ...drugDraft, morning: e.target.value })}
                              className="w-full font-bold text-center focus:outline-none"
                            />
                          </div>
                          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-slate-200">
                            <span className="text-slate-500">Trưa:</span>
                            <input
                              type="number"
                              min="0"
                              value={drugDraft.noon}
                              onChange={(e) => setDrugDraft({ ...drugDraft, noon: e.target.value })}
                              className="w-full font-bold text-center focus:outline-none"
                            />
                          </div>
                          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-slate-200">
                            <span className="text-slate-500">Chiều:</span>
                            <input
                              type="number"
                              min="0"
                              value={drugDraft.afternoon}
                              onChange={(e) =>
                                setDrugDraft({ ...drugDraft, afternoon: e.target.value })
                              }
                              className="w-full font-bold text-center focus:outline-none"
                            />
                          </div>
                          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-slate-200">
                            <span className="text-slate-500">Tối:</span>
                            <input
                              type="number"
                              min="0"
                              value={drugDraft.evening}
                              onChange={(e) => setDrugDraft({ ...drugDraft, evening: e.target.value })}
                              className="w-full font-bold text-center focus:outline-none"
                            />
                          </div>
                          <div className="col-span-4">
                            <input
                              type="text"
                              value={drugDraft.note}
                              onChange={(e) => setDrugDraft({ ...drugDraft, note: e.target.value })}
                              placeholder="Cách dùng (VD: Uống sau ăn)..."
                              className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded text-xs"
                            />
                          </div>
                        </div>
                      </form>
                    </div>
                  </>
                ) : (
                  <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                    <p className="text-slate-500">Bệnh nhân chưa có lượt khám nào.</p>
                    <button
                      type="button"
                      onClick={handleCreateNewVisitForPatient}
                      className="mt-3 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-semibold"
                    >
                      + Tạo lượt khám đầu tiên
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 3: QUẢN LÝ CHI PHÍ ĐIỀU TRỊ, ĐƠN THUỐC, XÉT NGHIỆM, X-QUANG
           ========================================================= */}
        {activeTab === 'tab3' && selectedPatient && currentVisit && (
          <div className="space-y-6">
            {/* Thanh chọn nhanh Bệnh nhân & Lượt khám tại Tab 3 */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Bệnh nhân:</span>
                  <select
                    value={selectedPatient.id}
                    onChange={(e) => handleSelectPatientFromList(e.target.value)}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-900"
                  >
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.id} - {p.name} ({calculateAge(p.dob)} tuổi)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Đợt khám:</span>
                  <select
                    value={currentVisit.visitId}
                    onChange={(e) => setSelectedVisitId(e.target.value)}
                    className="px-3 py-1.5 bg-teal-50 border border-teal-200 rounded-lg text-sm font-semibold text-teal-900"
                  >
                    {patientVisits.map((v) => (
                      <option key={v.visitId} value={v.visitId}>
                        Ngày {v.visitDate} ({v.visitId}) - {v.diagnosis}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPrintModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-white hover:bg-slate-900 shadow-sm transition"
                >
                  <Printer className="w-4 h-4" />
                  In Đơn Thuốc & Phiếu Thu (A5)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* CỘT TRÁI (8 CỘT): XÉT NGHIỆM, THỬ MÁU, X-QUANG & BẢNG GIÁ ĐƠN THUỐC */}
              <div className="lg:col-span-8 space-y-6">
                {/* KHỐI 1: CHỈ ĐỊNH XÉT NGHIỆM, THỬ MÁU, CHỤP X-QUANG, SIÊU ÂM */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <FlaskConical className="w-5 h-5 text-blue-600" />
                      <h3 className="text-base font-bold text-slate-900">
                        1. Quản lý Xét nghiệm, Thử máu, Chụp X-Quang & Siêu âm
                      </h3>
                    </div>
                    <span className="text-sm font-bold text-blue-700">
                      Tổng cận lâm sàng: {formatVND(currentVisitFinancials.labTotal)}
                    </span>
                  </div>

                  {/* Danh sách các xét nghiệm / X-quang đã chỉ định */}
                  {currentVisit.labs.length === 0 ? (
                    <div className="py-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-sm text-slate-500">
                      Chưa có chỉ định thử máu, xét nghiệm hay chụp X-quang trong đợt khám này.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {currentVisit.labs.map((lab) => (
                        <div
                          key={lab.id}
                          className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                                  lab.type.includes('X-Quang')
                                    ? 'bg-purple-100 text-purple-800'
                                    : lab.type.includes('Thử máu')
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}
                              >
                                {lab.type}
                              </span>
                              <span className="font-bold text-slate-900 text-sm">{lab.name}</span>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                                {lab.status}
                              </span>
                            </div>

                            <div className="text-xs text-slate-700 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200/80 mt-1">
                              <strong>Kết quả: </strong>
                              {lab.result || 'Đang chờ kết quả...'}
                            </div>

                            {lab.attachment && (
                              <div className="flex items-center gap-1.5 text-xs text-teal-700 pt-0.5">
                                <ImageIcon className="w-3.5 h-3.5" />
                                <span>File đính kèm trên Drive: </span>
                                <span className="underline font-medium">{lab.attachment}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex sm:flex-col items-end justify-between gap-2 shrink-0">
                            <span className="text-sm font-bold text-slate-900">
                              {formatVND(lab.cost)}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveLab(lab.id)}
                              className="text-xs text-rose-600 hover:underline flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Xóa
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Form thêm nhanh Xét nghiệm / Thử máu / X-Quang */}
                  <form
                    onSubmit={handleAddLabToVisit}
                    className="bg-blue-50/50 p-4 rounded-xl border border-blue-200/80 space-y-3"
                  >
                    <div className="text-xs font-bold text-blue-900 uppercase">
                      + Thêm chỉ định Thử máu / Xét nghiệm / Chụp X-Quang mới
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                      <div className="sm:col-span-3">
                        <select
                          value={labDraft.type}
                          onChange={(e) => setLabDraft({ ...labDraft, type: e.target.value })}
                          className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium"
                        >
                          <option value="Thử máu">Thử máu</option>
                          <option value="Chụp X-Quang">Chụp X-Quang</option>
                          <option value="Siêu âm">Siêu âm</option>
                          <option value="Điện tim">Điện tim</option>
                          <option value="Xét nghiệm">Xét nghiệm khác</option>
                        </select>
                      </div>

                      <div className="sm:col-span-6">
                        <input
                          list="lab-catalog-list"
                          type="text"
                          value={labDraft.name}
                          onChange={(e) => handleSelectCatalogLab(e.target.value)}
                          placeholder="Chọn hoặc nhập tên Xét nghiệm / X-Quang..."
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
                        />
                        <datalist id="lab-catalog-list">
                          {LAB_CATALOG.map((l) => (
                            <option key={l.name} value={l.name} />
                          ))}
                        </datalist>
                      </div>

                      <div className="sm:col-span-3">
                        <input
                          type="number"
                          step="10000"
                          value={labDraft.cost}
                          onChange={(e) => setLabDraft({ ...labDraft, cost: e.target.value })}
                          placeholder="Chi phí (VNĐ)"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-blue-700"
                        />
                      </div>

                      <div className="sm:col-span-9">
                        <input
                          type="text"
                          value={labDraft.result}
                          onChange={(e) => setLabDraft({ ...labDraft, result: e.target.value })}
                          placeholder="Nhập tóm tắt kết quả xét nghiệm / đọc phim X-quang..."
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <button
                          type="submit"
                          className="w-full h-full py-2 px-3 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition"
                        >
                          + Lưu chỉ định
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                {/* KHỐI 2: CHI TIẾT ĐƠN THUỐC & ĐƠN GIÁ TẠI TAB 3 */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Pill className="w-5 h-5 text-teal-600" />
                      <h3 className="text-base font-bold text-slate-900">
                        2. Bảng tính tiền Đơn thuốc ({currentVisit.prescriptions.length} khoản)
                      </h3>
                    </div>
                    <span className="text-sm font-bold text-teal-700">
                      Tổng tiền thuốc: {formatVND(currentVisitFinancials.drugTotal)}
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase">
                          <th className="py-2.5 px-3">Tên thuốc</th>
                          <th className="py-2.5 px-2 text-center">Liều/Ngày</th>
                          <th className="py-2.5 px-2 text-center">Số ngày</th>
                          <th className="py-2.5 px-2 text-center">Tổng SL</th>
                          <th className="py-2.5 px-3 text-right">Đơn giá</th>
                          <th className="py-2.5 px-3 text-right">Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {currentVisit.prescriptions.map((item, idx) => {
                          const daily =
                            (Number(item.morning) || 0) +
                            (Number(item.noon) || 0) +
                            (Number(item.afternoon) || 0) +
                            (Number(item.evening) || 0);
                          const totalQty =
                            daily > 0 ? daily * (Number(item.days) || 1) : Number(item.days) || 1;
                          const lineTotal = totalQty * (Number(item.price) || 0);
                          return (
                            <tr key={item.id}>
                              <td className="py-2.5 px-3">
                                <div className="font-semibold text-slate-900">
                                  {idx + 1}. {item.drugName}
                                </div>
                                <div className="text-xs text-slate-500">{item.note}</div>
                              </td>
                              <td className="py-2.5 px-2 text-center text-xs">
                                S:{item.morning} T:{item.noon} C:{item.afternoon} Tối:{item.evening}
                              </td>
                              <td className="py-2.5 px-2 text-center font-medium">
                                {item.days} ngày
                              </td>
                              <td className="py-2.5 px-2 text-center font-bold">
                                {totalQty} {item.unit}
                              </td>
                              <td className="py-2.5 px-3 text-right text-slate-600">
                                {formatVND(item.price)}
                              </td>
                              <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                                {formatVND(lineTotal)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* CỘT PHẢI (4 CỘT): TỔNG HỢP VIỆN PHÍ & TRẠNG THÁI THANH TOÁN */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4 sticky top-28">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-teal-600" />
                      Tổng kết Chi phí điều trị
                    </h3>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        currentVisit.paymentStatus === 'Đã thu'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {currentVisit.paymentStatus}
                    </span>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">1. Tiền công khám bác sĩ:</span>
                      <input
                        type="number"
                        step="10000"
                        value={currentVisit.consultationFee}
                        onChange={(e) =>
                          handleUpdateVisitField('consultationFee', Number(e.target.value))
                        }
                        className="w-32 text-right px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">
                        2. Tiền thuốc ({currentVisit.prescriptions.length} loại):
                      </span>
                      <span className="font-semibold text-slate-900">
                        {formatVND(currentVisitFinancials.drugTotal)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">
                        3. Xét nghiệm & X-Quang ({currentVisit.labs.length} mục):
                      </span>
                      <span className="font-semibold text-slate-900">
                        {formatVND(currentVisitFinancials.labTotal)}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-base font-bold text-slate-900">TỔNG THANH TOÁN:</span>
                      <span className="text-xl font-extrabold text-teal-700">
                        {formatVND(currentVisitFinancials.grandTotal)}
                      </span>
                    </div>
                  </div>

                  {/* Chọn trạng thái thanh toán */}
                  <div className="pt-2 space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">
                      Cập nhật trạng thái thu phí
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          handleUpdateVisitField('paymentStatus', 'Đã thu');
                          showToast('Đã xác nhận thu tiền viện phí & lưu vào Sheet!');
                        }}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition ${
                          currentVisit.paymentStatus === 'Đã thu'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Đã thu tiền
                      </button>

                      <button
                        type="button"
                        onClick={() => handleUpdateVisitField('paymentStatus', 'Chưa thu')}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition ${
                          currentVisit.paymentStatus === 'Chưa thu'
                            ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50'
                        }`}
                      >
                        <Clock className="w-4 h-4" />
                        Chưa thu
                      </button>
                    </div>
                  </div>

                  {/* Nút đồng bộ và In */}
                  <div className="pt-3 border-t border-slate-100 space-y-2.5">
                    <button
                      type="button"
                      onClick={handleSyncToGoogleSheets}
                      className="w-full py-2.5 px-4 rounded-xl bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 flex items-center justify-center gap-2 shadow-sm transition"
                    >
                      <Database className="w-4 h-4" />
                      Ghi phiếu này vào Google Sheets
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsPrintModalOpen(true)}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-100 text-slate-800 text-sm font-semibold hover:bg-slate-200 flex items-center justify-center gap-2 transition"
                    >
                      <Printer className="w-4 h-4" />
                      Xem bản in Đơn thuốc & Hóa đơn
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* =========================================================
          MODAL 1: THÊM BỆNH NHÂN MỚI
         ========================================================= */}
      {isNewPatientModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-teal-600" />
                Tiếp nhận Bệnh nhân mới (Tự động tạo Mã BN)
              </h3>
              <button
                type="button"
                onClick={() => setIsNewPatientModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewPatient} className="space-y-3.5 text-sm">
              <div>
                <label className="font-semibold text-slate-700">Họ và tên bệnh nhân *</label>
                <input
                  required
                  type="text"
                  value={newPatientForm.name}
                  onChange={(e) => setNewPatientForm({ ...newPatientForm, name: e.target.value })}
                  placeholder="Ví dụ: Đặng Quốc Khánh"
                  className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Ngày sinh</label>
                  <input
                    type="date"
                    value={newPatientForm.dob}
                    onChange={(e) => setNewPatientForm({ ...newPatientForm, dob: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Giới tính</label>
                  <select
                    value={newPatientForm.gender}
                    onChange={(e) =>
                      setNewPatientForm({ ...newPatientForm, gender: e.target.value })
                    }
                    className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-xl"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Số điện thoại</label>
                  <input
                    type="text"
                    value={newPatientForm.phone}
                    onChange={(e) =>
                      setNewPatientForm({ ...newPatientForm, phone: e.target.value })
                    }
                    placeholder="090..."
                    className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Nghề nghiệp</label>
                  <input
                    type="text"
                    value={newPatientForm.occupation}
                    onChange={(e) =>
                      setNewPatientForm({ ...newPatientForm, occupation: e.target.value })
                    }
                    placeholder="Ví dụ: Nhân viên văn phòng"
                    className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Địa chỉ</label>
                <input
                  type="text"
                  value={newPatientForm.address}
                  onChange={(e) =>
                    setNewPatientForm({ ...newPatientForm, address: e.target.value })
                  }
                  placeholder="Số nhà, đường, quận/huyện..."
                  className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Tiền sử bệnh lý</label>
                <input
                  type="text"
                  value={newPatientForm.medicalHistory}
                  onChange={(e) =>
                    setNewPatientForm({ ...newPatientForm, medicalHistory: e.target.value })
                  }
                  placeholder="Ví dụ: Tăng huyết áp, Đái tháo đường..."
                  className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-rose-700">Dị ứng thuốc / thức ăn (Nếu có)</label>
                <input
                  type="text"
                  value={newPatientForm.allergies}
                  onChange={(e) =>
                    setNewPatientForm({ ...newPatientForm, allergies: e.target.value })
                  }
                  placeholder="Mặc định: Không ghi nhận dị ứng"
                  className="mt-1 w-full px-3 py-2 border border-rose-200 bg-rose-50/40 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewPatientModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 shadow-sm"
                >
                  Lưu & Chuyển sang Khám bệnh (Tab 2)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 2: XEM CẤU TRÚC GOOGLE SHEETS THỰC TẾ & CODE APPS SCRIPT
         ========================================================= */}
      {isSheetModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[88vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 bg-emerald-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-5 h-5" />
                <div>
                  <h3 className="text-sm font-bold">
                    Mô phỏng Dữ liệu đang lưu trong Google Sheets (Real-time)
                  </h3>
                  <p className="text-xs text-emerald-100">
                    Mọi thay đổi ở 3 Tab trên giao diện sẽ tự động ghi thành các dòng tương ứng dưới đây
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSheetModalOpen(false)}
                className="text-emerald-100 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Các tab con của Google Sheet */}
            <div className="bg-slate-100 px-4 pt-2 border-b border-slate-200 flex items-center gap-1 overflow-x-auto">
              {[
                { id: 'Benh_Nhan', label: 'Sheet 1: Benh_Nhan' },
                { id: 'Luot_Kham', label: 'Sheet 2: Luot_Kham' },
                { id: 'Don_Thuoc', label: 'Sheet 3: Don_Thuoc_Chi_Tiet' },
                { id: 'Dich_Vu', label: 'Sheet 4: Xet_Nghiem_Chi_Phi' },
                { id: 'Apps_Script', label: '⚙️ Mã kết nối Google Apps Script' }
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSheetPreviewTab(t.id)}
                  className={`px-3.5 py-2 rounded-t-lg text-xs font-bold border-t border-x transition ${
                    sheetPreviewTab === t.id
                      ? 'bg-white text-emerald-800 border-slate-300'
                      : 'bg-slate-200/70 text-slate-600 border-transparent hover:bg-slate-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Nội dung bảng */}
            <div className="p-5 overflow-auto flex-1">
              {sheetPreviewTab === 'Benh_Nhan' && (
                <table className="w-full text-xs border border-slate-300 border-collapse">
                  <thead>
                    <tr className="bg-emerald-50 text-emerald-950 font-bold">
                      <th className="border border-slate-300 p-2">Ma_BN</th>
                      <th className="border border-slate-300 p-2">Ho_Ten</th>
                      <th className="border border-slate-300 p-2">Ngay_Sinh</th>
                      <th className="border border-slate-300 p-2">Gioi_Tinh</th>
                      <th className="border border-slate-300 p-2">SDT</th>
                      <th className="border border-slate-300 p-2">Nghe_Nghiep</th>
                      <th className="border border-slate-300 p-2">Tien_Su_Benh</th>
                      <th className="border border-slate-300 p-2">Di_Ung_Thuoc</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="border border-slate-300 p-2 font-mono font-bold">{p.id}</td>
                        <td className="border border-slate-300 p-2 font-semibold">{p.name}</td>
                        <td className="border border-slate-300 p-2">{p.dob}</td>
                        <td className="border border-slate-300 p-2">{p.gender}</td>
                        <td className="border border-slate-300 p-2">{p.phone}</td>
                        <td className="border border-slate-300 p-2">{p.occupation}</td>
                        <td className="border border-slate-300 p-2">{p.medicalHistory}</td>
                        <td className="border border-slate-300 p-2 text-rose-700">{p.allergies}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {sheetPreviewTab === 'Luot_Kham' && (
                <table className="w-full text-xs border border-slate-300 border-collapse">
                  <thead>
                    <tr className="bg-emerald-50 text-emerald-950 font-bold">
                      <th className="border border-slate-300 p-2">Ma_Luot_Kham</th>
                      <th className="border border-slate-300 p-2">Ma_BN</th>
                      <th className="border border-slate-300 p-2">Ngay_Kham</th>
                      <th className="border border-slate-300 p-2">Cao_Nang_HA</th>
                      <th className="border border-slate-300 p-2">Chan_Doan</th>
                      <th className="border border-slate-300 p-2">Hen_Tai_Kham</th>
                      <th className="border border-slate-300 p-2">Trang_Thai_Thu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visits.map((v) => (
                      <tr key={v.visitId} className="hover:bg-slate-50">
                        <td className="border border-slate-300 p-2 font-mono font-bold">
                          {v.visitId}
                        </td>
                        <td className="border border-slate-300 p-2 font-mono">{v.patientId}</td>
                        <td className="border border-slate-300 p-2">{v.visitDate}</td>
                        <td className="border border-slate-300 p-2">
                          {v.height}cm / {v.weight}kg / HA {v.bp}
                        </td>
                        <td className="border border-slate-300 p-2 font-semibold">{v.diagnosis}</td>
                        <td className="border border-slate-300 p-2">{v.followUpDate}</td>
                        <td className="border border-slate-300 p-2 font-bold">{v.paymentStatus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {sheetPreviewTab === 'Don_Thuoc' && (
                <table className="w-full text-xs border border-slate-300 border-collapse">
                  <thead>
                    <tr className="bg-emerald-50 text-emerald-950 font-bold">
                      <th className="border border-slate-300 p-2">Ma_Luot_Kham</th>
                      <th className="border border-slate-300 p-2">Ma_BN</th>
                      <th className="border border-slate-300 p-2">Ten_Thuoc</th>
                      <th className="border border-slate-300 p-2">Sang_Trua_Chieu_Toi</th>
                      <th className="border border-slate-300 p-2">So_Ngay</th>
                      <th className="border border-slate-300 p-2">Don_Gia</th>
                      <th className="border border-slate-300 p-2">Cach_Dung</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visits.flatMap((v) =>
                      v.prescriptions.map((d) => (
                        <tr key={d.id} className="hover:bg-slate-50">
                          <td className="border border-slate-300 p-2 font-mono">{v.visitId}</td>
                          <td className="border border-slate-300 p-2 font-mono">{v.patientId}</td>
                          <td className="border border-slate-300 p-2 font-semibold">
                            {d.drugName}
                          </td>
                          <td className="border border-slate-300 p-2 text-center">
                            {d.morning} - {d.noon} - {d.afternoon} - {d.evening}
                          </td>
                          <td className="border border-slate-300 p-2 text-center">{d.days}</td>
                          <td className="border border-slate-300 p-2 text-right">
                            {formatVND(d.price)}
                          </td>
                          <td className="border border-slate-300 p-2">{d.note}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}

              {sheetPreviewTab === 'Dich_Vu' && (
                <table className="w-full text-xs border border-slate-300 border-collapse">
                  <thead>
                    <tr className="bg-emerald-50 text-emerald-950 font-bold">
                      <th className="border border-slate-300 p-2">Ma_Luot_Kham</th>
                      <th className="border border-slate-300 p-2">Ma_BN</th>
                      <th className="border border-slate-300 p-2">Loai_Dich_Vu</th>
                      <th className="border border-slate-300 p-2">Ten_Chi_Dinh</th>
                      <th className="border border-slate-300 p-2">Ket_Qua</th>
                      <th className="border border-slate-300 p-2">Chi_Phi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visits.flatMap((v) =>
                      v.labs.map((l) => (
                        <tr key={l.id} className="hover:bg-slate-50">
                          <td className="border border-slate-300 p-2 font-mono">{v.visitId}</td>
                          <td className="border border-slate-300 p-2 font-mono">{v.patientId}</td>
                          <td className="border border-slate-300 p-2 font-bold">{l.type}</td>
                          <td className="border border-slate-300 p-2">{l.name}</td>
                          <td className="border border-slate-300 p-2">{l.result}</td>
                          <td className="border border-slate-300 p-2 text-right font-semibold">
                            {formatVND(l.cost)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}

              {sheetPreviewTab === 'Apps_Script' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-600">
                      Đoạn mã Google Apps Script dùng để kết nối App trên AI Studio / Antigravity với file Google Sheets:
                    </p>
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-white hover:bg-slate-900"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedCode ? 'Đã sao chép' : 'Sao chép mã Apps Script'}
                    </button>
                  </div>
                  <pre className="bg-slate-900 text-emerald-300 p-4 rounded-xl text-xs overflow-x-auto font-mono leading-relaxed">
                    {appsScriptCode}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 3: XEM TRƯỚC BẢN IN ĐƠN THUỐC & PHIẾU THU (KHỔ A5)
         ========================================================= */}
      {isPrintModalOpen && selectedPatient && currentVisit && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-800 text-white flex items-center justify-between">
              <span className="text-sm font-bold flex items-center gap-2">
                <Printer className="w-4 h-4" />
                Xem trước mẫu in Đơn Thuốc & Phiếu Thu (Khổ chuẩn A5)
              </span>
              <button
                type="button"
                onClick={() => setIsPrintModalOpen(false)}
                className="text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-sm bg-white">
              <div className="flex items-start justify-between border-b border-slate-200 pb-4">
                <div>
                  <h4 className="font-bold text-teal-800 text-base uppercase">
                    PHÒNG KHÁM CHUYÊN KHOA NỘI MEDICARE
                  </h4>
                  <p className="text-xs text-slate-500">
                    Địa chỉ: TP. Hồ Chí Minh • Điện thoại: 0909.000.111
                  </p>
                </div>
                <div className="text-right text-xs">
                  <p className="font-mono font-bold">Mã BN: {selectedPatient.id}</p>
                  <p className="text-slate-500">Số phiếu: {currentVisit.visitId}</p>
                </div>
              </div>

              <div className="text-center">
                <h2 className="text-xl font-extrabold text-slate-900 uppercase">
                  ĐƠN THUỐC & PHIẾU KHÁM BỆNH
                </h2>
                <p className="text-xs text-slate-500">Ngày khám: {currentVisit.visitDate}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <p>
                  <strong>Họ tên:</strong> {selectedPatient.name}
                </p>
                <p>
                  <strong>Tuổi / Giới tính:</strong> {calculateAge(selectedPatient.dob)} tuổi (
                  {selectedPatient.gender})
                </p>
                <p>
                  <strong>Điện thoại:</strong> {selectedPatient.phone}
                </p>
                <p>
                  <strong>Sinh hiệu:</strong> {currentVisit.weight}kg | HA: {currentVisit.bp} mmHg
                </p>
                <p className="col-span-2">
                  <strong>Địa chỉ:</strong> {selectedPatient.address}
                </p>
                <p className="col-span-2 text-rose-700">
                  <strong>Dị ứng thuốc:</strong> {selectedPatient.allergies}
                </p>
                <p className="col-span-2 text-sm text-teal-950 pt-1">
                  <strong>Chẩn đoán:</strong> {currentVisit.diagnosis}
                </p>
              </div>

              {/* Chỉ định thuốc */}
              <div className="space-y-2">
                <h5 className="font-bold text-xs uppercase text-slate-600">Chỉ định dùng thuốc:</h5>
                <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl px-3">
                  {currentVisit.prescriptions.map((item, index) => {
                    const daily =
                      (Number(item.morning) || 0) +
                      (Number(item.noon) || 0) +
                      (Number(item.afternoon) || 0) +
                      (Number(item.evening) || 0);
                    const totalQty =
                      daily > 0 ? daily * (Number(item.days) || 1) : Number(item.days) || 1;
                    return (
                      <div key={item.id} className="py-2.5 flex items-start justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-900 text-sm">
                            {index + 1}. {item.drugName}
                          </p>
                          <p className="text-slate-600">
                            Ngày uống: {item.morning ? `Sáng ${item.morning} ` : ''}
                            {item.noon ? `Trưa ${item.noon} ` : ''}
                            {item.afternoon ? `Chiều ${item.afternoon} ` : ''}
                            {item.evening ? `Tối ${item.evening} ` : ''}({item.unit}) —{' '}
                            <em>{item.note}</em>
                          </p>
                        </div>
                        <span className="font-bold text-slate-900 text-sm">
                          SL: {totalQty} {item.unit}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tổng chi phí & Hẹn tái khám */}
              <div className="flex items-center justify-between bg-teal-50 p-3.5 rounded-xl border border-teal-200 text-xs">
                <div>
                  <p className="font-bold text-amber-900">
                    📅 Ngày hẹn tái khám: {currentVisit.followUpDate || 'Khi hết thuốc'}
                  </p>
                  <p className="text-slate-600 mt-0.5">
                    Lời dặn: {currentVisit.doctorNotes || 'Uống thuốc đúng giờ, tái khám theo hẹn.'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">Tổng cộng thanh toán:</span>
                  <span className="text-base font-extrabold text-teal-800">
                    {formatVND(currentVisitFinancials.grandTotal)}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsPrintModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 text-white hover:bg-teal-700 flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                In ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

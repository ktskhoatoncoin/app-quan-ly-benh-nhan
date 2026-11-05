import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DRIVE_FOLDER_ID = '18BJKFc3Xoqtoiwx_5f5GTJbfjPT_U1T4';

// 21 Verified patients that have test result folders in Google Drive
const VERIFIED_DRIVE_MAPPING = [
  { matchId: 'BN0101', folderName: 'Khổng Thị Hồng Anh' },
  { matchId: 'BN0102', folderName: 'Khổng Thị Hồng Hoa' },
  { matchId: 'BN0103', folderName: 'Khổng Thị Hồng Nhung' },
  { matchId: 'BN0244', folderName: 'Nguyễn Thị Bích Phượng' },
  { matchId: 'BN0289', folderName: 'Nguyễn Thị Thu nha be' },
  { matchId: 'BN0294', folderName: 'Nguyễn Thị Thúy' },
  { matchId: 'BN0313', folderName: 'Lê Tấn Bỉ' },
  { matchId: 'BN0314', folderName: 'Nguyễn Mạnh Hùng' },
  { matchId: 'BN0329', folderName: 'Nguyễn Văn Thuân' },
  { matchId: 'BN0350', folderName: 'Phan Chánh Luân' },
  { matchId: 'BN0487', folderName: 'Đinh Thị Thúy Hằng' },
  { matchId: 'BN0489', folderName: 'Đoàn Hồng Dũng' },
  { matchId: 'BN0067', folderName: 'Huỳnh Văn Hòa' },
  // Extra patients with real test data in ket qua XN benh nhan
  {
    newPatient: {
      id: 'BN0523',
      name: 'Dương Hoài Tâm',
      dob: '1980',
      gender: 'Nam',
      phone: '',
      relativePhone: '',
      initialWeight: 65,
      occupation: '',
      address: 'TP.HCM',
      medicalHistory: 'Theo dõi da liễu / dị ứng',
      allergies: 'Chưa ghi nhận',
      pastParaclinical: 'Xét nghiệm máu & hình ảnh',
      pastMedications: '',
      isArchived: false,
      createdAt: '2026-10-25'
    },
    folderName: 'Dương Hoài Tâm',
    initialVisit: {
      visitId: 'LK002322',
      patientId: 'BN0523',
      visitDate: '2026-05-15',
      diseaseCategory: 'Thần kinh - Da liễu',
      symptoms: 'Ngứa da, phát ban rải rác',
      diagnosis: 'Viêm da cơ địa dị ứng',
      doctorNotes: 'Giữ vệ sinh da, bôi dưỡng ẩm',
      followUpDate: '2026-06-15',
      paymentStatus: 'Đã thu',
      consultationFee: 150000,
      prescriptions: [
        { drugName: 'Fexofenadine 180mg', unit: 'Viên', morning: 1, noon: 0, afternoon: 0, evening: 0, days: 10, price: 6000, note: 'Uống sáng sau ăn' },
        { drugName: 'Kem dưỡng ẩm dịu da Dermagor', unit: 'Tuýp', morning: 1, noon: 0, afternoon: 0, evening: 1, days: 30, price: 220000, note: 'Bôi ngoài da ngày 2 lần' }
      ],
      labs: []
    }
  },
  {
    newPatient: {
      id: 'BN0524',
      name: 'Huỳnh Kim Hiếu',
      dob: '1975',
      gender: 'Nam',
      phone: '',
      relativePhone: '',
      initialWeight: 68,
      occupation: '',
      address: 'TP.HCM',
      medicalHistory: 'Theo dõi sắc tố da',
      allergies: 'Chưa ghi nhận',
      pastParaclinical: 'Kết quả XN ngày 13-04-2026',
      pastMedications: '',
      isArchived: false,
      createdAt: '2026-10-25'
    },
    folderName: 'Huỳnh Kim Hiếu',
    initialVisit: {
      visitId: 'LK002323',
      patientId: 'BN0524',
      visitDate: '2026-04-13',
      diseaseCategory: 'Thần kinh - Da liễu',
      symptoms: 'Tăng sắc tố sau viêm',
      diagnosis: 'Sạm da sau viêm / Rám má',
      doctorNotes: 'Tránh nắng kỹ, bôi KCN phổ rộng',
      followUpDate: '2026-05-13',
      paymentStatus: 'Đã thu',
      consultationFee: 150000,
      prescriptions: [
        { drugName: 'Serum Vitamin C 15%', unit: 'Lọ', morning: 1, noon: 0, afternoon: 0, evening: 0, days: 30, price: 350000, note: 'Thoa sáng trước kem chống nắng' }
      ],
      labs: []
    }
  },
  {
    newPatient: {
      id: 'BN0525',
      name: 'Nguyễn thị Duyên Duyên',
      dob: '1992',
      gender: 'Nữ',
      phone: '',
      relativePhone: '',
      initialWeight: 52,
      occupation: '',
      address: 'TP.HCM',
      medicalHistory: 'Viêm da tiếp xúc',
      allergies: 'Dị ứng mỹ phẩm lạ',
      pastParaclinical: 'Kết quả XN 24-08-2025',
      pastMedications: '',
      isArchived: false,
      createdAt: '2026-10-25'
    },
    folderName: 'Nguyễn thị Duyên Duyên',
    initialVisit: {
      visitId: 'LK002324',
      patientId: 'BN0525',
      visitDate: '2025-08-24',
      diseaseCategory: 'Thần kinh - Da liễu',
      symptoms: 'Đỏ ngứa châm chích vùng mặt sau dùng kem',
      diagnosis: 'Viêm da tiếp xúc dị ứng do mỹ phẩm',
      doctorNotes: 'Ngưng toàn bộ mỹ phẩm đang dùng',
      followUpDate: '2025-09-07',
      paymentStatus: 'Đã thu',
      consultationFee: 150000,
      prescriptions: [
        { drugName: 'Desloratadine 5mg', unit: 'Viên', morning: 0, noon: 0, afternoon: 0, evening: 1, days: 7, price: 5000, note: 'Uống tối' },
        { drugName: 'Xịt khoáng phục hồi Avene', unit: 'Chai', morning: 2, noon: 2, afternoon: 2, evening: 2, days: 14, price: 280000, note: 'Xịt làm dịu khi ngứa rát' }
      ],
      labs: []
    }
  },
  {
    newPatient: {
      id: 'BN0526',
      name: 'Phạm Đắc Hậu',
      dob: '1985',
      gender: 'Nam',
      phone: '',
      relativePhone: '',
      initialWeight: 72,
      occupation: '',
      address: 'TP.HCM',
      medicalHistory: 'Theo dõi nang lông',
      allergies: 'Chưa ghi nhận',
      pastParaclinical: 'Kết quả XN 24-08-2025',
      pastMedications: '',
      isArchived: false,
      createdAt: '2026-10-25'
    },
    folderName: 'Phạm Đắc Hậu',
    initialVisit: {
      visitId: 'LK002325',
      patientId: 'BN0526',
      visitDate: '2025-08-24',
      diseaseCategory: 'Thần kinh - Da liễu',
      symptoms: 'Sẩn mụn mủ nang lông vùng lưng',
      diagnosis: 'Viêm nang lông do tụ cầu',
      doctorNotes: 'Mặc đồ thoáng mát, tắm xà phòng kháng khuẩn',
      followUpDate: '2025-09-07',
      paymentStatus: 'Đã thu',
      consultationFee: 150000,
      prescriptions: [
        { drugName: 'Doxycycline 100mg', unit: 'Viên', morning: 1, noon: 0, afternoon: 0, evening: 1, days: 14, price: 4000, note: 'Uống sau ăn no' },
        { drugName: 'Sữa tắm Sastid', unit: 'Chai', morning: 0, noon: 0, afternoon: 0, evening: 1, days: 30, price: 180000, note: 'Tắm xoa đều vùng lưng' }
      ],
      labs: []
    }
  },
  {
    newPatient: {
      id: 'BN0527',
      name: 'Tôn Nữ Thị Hà',
      dob: '1960',
      gender: 'Nữ',
      phone: '',
      relativePhone: '',
      initialWeight: 56,
      occupation: 'Hưu trí',
      address: 'TP.HCM',
      medicalHistory: 'Loãng xương, tim mạch nhẹ',
      allergies: 'Chưa ghi nhận',
      pastParaclinical: 'DXA Xương, ECG, Xét nghiệm máu',
      pastMedications: '',
      isArchived: false,
      createdAt: '2026-10-25'
    },
    folderName: 'Tôn Nữ Thị Hà',
    initialVisit: {
      visitId: 'LK002326',
      patientId: 'BN0527',
      visitDate: '2026-05-10',
      diseaseCategory: 'Cơ xương khớp - Nội tiết',
      symptoms: 'Đau mỏi cột sống thắt lưng, khô da người già',
      diagnosis: 'Thiểu xương - Viêm da khô người cao tuổi',
      doctorNotes: 'Bổ sung Calci, bôi dưỡng ẩm toàn thân',
      followUpDate: '2026-06-10',
      paymentStatus: 'Đã thu',
      consultationFee: 150000,
      prescriptions: [
        { drugName: 'Calci D3 500mg', unit: 'Viên', morning: 1, noon: 0, afternoon: 0, evening: 0, days: 30, price: 4500, note: 'Uống sáng sau ăn' },
        { drugName: 'Sữa dưỡng ẩm Urea 10%', unit: 'Chai', morning: 1, noon: 0, afternoon: 0, evening: 1, days: 30, price: 210000, note: 'Bôi toàn thân sau tắm' }
      ],
      labs: []
    }
  },
  {
    newPatient: {
      id: 'BN0528',
      name: 'Tôn Nữ Thị Lan',
      dob: '1965',
      gender: 'Nữ',
      phone: '',
      relativePhone: '',
      initialWeight: 58,
      occupation: '',
      address: 'TP.HCM',
      medicalHistory: 'Theo dõi khám da liễu & thẩm mỹ da',
      allergies: 'Chưa ghi nhận',
      pastParaclinical: 'Kết quả hình ảnh 13-05-2026',
      pastMedications: '',
      isArchived: false,
      createdAt: '2026-10-25'
    },
    folderName: 'Tôn Nữ Thị Lan',
    initialVisit: {
      visitId: 'LK002327',
      patientId: 'BN0528',
      visitDate: '2026-05-13',
      diseaseCategory: 'Thần kinh - Da liễu',
      symptoms: 'Lão hóa da vùng mặt, nếp nhăn đuôi mắt',
      diagnosis: 'Lão hóa da độ 2 - Thẩm mỹ da',
      doctorNotes: 'Liệu trình trẻ hóa da, bôi kem chống lão hóa',
      followUpDate: '2026-06-13',
      paymentStatus: 'Đã thu',
      consultationFee: 150000,
      prescriptions: [
        { drugName: 'Retinol 0.5% Cream', unit: 'Tuýp', morning: 0, noon: 0, afternoon: 0, evening: 1, days: 30, price: 420000, note: 'Thoa mỏng buổi tối 2-3 lần/tuần' }
      ],
      labs: []
    }
  },
  {
    newPatient: {
      id: 'BN0529',
      name: 'Tôn Nữ Thị Thương',
      dob: '1962',
      gender: 'Nữ',
      phone: '',
      relativePhone: '',
      initialWeight: 55,
      occupation: '',
      address: 'TP.HCM',
      medicalHistory: 'Theo dõi loãng xương & da liễu',
      allergies: 'Chưa ghi nhận',
      pastParaclinical: 'DXA Xương, ECG, XN Máu',
      pastMedications: '',
      isArchived: false,
      createdAt: '2026-10-25'
    },
    folderName: 'Tôn Nữ Thị Thương',
    initialVisit: {
      visitId: 'LK002328',
      patientId: 'BN0529',
      visitDate: '2026-05-10',
      diseaseCategory: 'Cơ xương khớp - Nội tiết',
      symptoms: 'Đau mỏi cơ xương khớp, sạm da phân bố 2 gò má',
      diagnosis: 'Nám má mảng (Melasma) - Giảm mật độ xương',
      doctorNotes: 'Tránh nắng, bôi KCN SPF 50+',
      followUpDate: '2026-06-10',
      paymentStatus: 'Đã thu',
      consultationFee: 150000,
      prescriptions: [
        { drugName: 'Tranexamic Acid 250mg', unit: 'Viên', morning: 1, noon: 0, afternoon: 0, evening: 1, days: 30, price: 6000, note: 'Uống sau ăn' },
        { drugName: 'Kem chống nắng La Roche-Posay Anthelios', unit: 'Tuýp', morning: 1, noon: 1, afternoon: 0, evening: 0, days: 45, price: 450000, note: 'Thoa trước khi ra ngoài 20p' }
      ],
      labs: []
    }
  },
  {
    newPatient: {
      id: 'BN0530',
      name: 'BSCK1 Tôn Thất Hào',
      dob: '1960',
      gender: 'Nam',
      phone: '0908297118',
      relativePhone: '',
      initialWeight: 70,
      occupation: 'Bác sĩ CK1 Da liễu & Thẩm mỹ Da',
      address: 'Phòng khám Da liễu BSCK1 Tôn Thất Hào',
      medicalHistory: 'Kiểm tra sức khỏe định kỳ & dữ liệu phòng khám',
      allergies: 'Không dị ứng thuốc',
      pastParaclinical: 'Kết quả xét nghiệm & hình ảnh chuyên khoa 21-09-2026',
      pastMedications: '',
      isArchived: false,
      createdAt: '2026-10-25'
    },
    folderName: 'Tôn Thất Hào',
    initialVisit: {
      visitId: 'LK002329',
      patientId: 'BN0530',
      visitDate: '2026-09-21',
      diseaseCategory: 'Nội tổng quát',
      symptoms: 'Khám sức khỏe tổng quát định kỳ',
      diagnosis: 'Sức khỏe tổng quát tốt - Chỉ số sinh hiệu ổn định',
      doctorNotes: 'Duy trì tập thể dục và chế độ ăn uống khoa học',
      followUpDate: '2027-03-21',
      paymentStatus: 'Đã thu',
      consultationFee: 0,
      prescriptions: [],
      labs: []
    }
  }
];

async function updateClinicData() {
  const clinicDataPath = path.resolve(__dirname, '../src/clinicData.js');
  const mod = await import(pathToFileURL(clinicDataPath).href);
  let patients = [...mod.INITIAL_PATIENTS];
  let visits = [...mod.INITIAL_VISITS];

  console.log(`Initial patients: ${patients.length}, visits: ${visits.length}`);

  // Create a map for quick folder url assignment
  const verifiedFolderMap = new Map();
  VERIFIED_DRIVE_MAPPING.forEach(item => {
    if (item.matchId) {
      const driveUrl = `https://drive.google.com/drive/u/0/search?q=parent:${ROOT_DRIVE_FOLDER_ID}%20"${encodeURIComponent(item.folderName)}"`;
      verifiedFolderMap.set(item.matchId, driveUrl);
    }
  });

  // Step 1: Clear imageFolderUrl for all existing patients, ONLY set for verified IDs
  patients = patients.map(p => {
    const verifiedUrl = verifiedFolderMap.get(p.id);
    return {
      ...p,
      imageFolderUrl: verifiedUrl || ''
    };
  });

  // Step 2: Add any extra verified patients that are not yet in the list
  VERIFIED_DRIVE_MAPPING.forEach(item => {
    if (item.newPatient) {
      const existing = patients.find(p => p.id === item.newPatient.id || p.name === item.newPatient.name);
      if (!existing) {
        const driveUrl = `https://drive.google.com/drive/u/0/search?q=parent:${ROOT_DRIVE_FOLDER_ID}%20"${encodeURIComponent(item.folderName)}"`;
        patients.push({
          ...item.newPatient,
          imageFolderUrl: driveUrl
        });
        if (item.initialVisit) {
          visits.push(item.initialVisit);
        }
      }
    }
  });

  const withImages = patients.filter(p => p.imageFolderUrl && p.imageFolderUrl.length > 0);
  const withoutImages = patients.filter(p => !p.imageFolderUrl || p.imageFolderUrl.length === 0);

  console.log(`✅ Total patients: ${patients.length}`);
  console.log(`📸 Patients WITH Drive image link: ${withImages.length}`);
  console.log(`🚫 Patients WITHOUT Drive link: ${withoutImages.length}`);
  console.log(`📝 Total visits: ${visits.length}`);

  console.log('\nDanh sách các bệnh nhân CÓ liên kết ảnh Google Drive:');
  withImages.forEach((p, idx) => {
    console.log(`  ${idx + 1}. [${p.id}] ${p.name} -> ${p.imageFolderUrl}`);
  });

  // Export to src/clinicData.js
  const jsContent =
    '// Cơ sở dữ liệu phòng khám MediCare Clinic Pro (#ktskhoa365)\n' +
    '// Chuyên khoa Da liễu & Thẩm mỹ Da - BSCK1 Tôn Thất Hào\n' +
    '// Tổng cộng: ' + patients.length + ' bệnh nhân & ' + visits.length + ' lượt khám\n' +
    '// Chỉ ' + withImages.length + ' bệnh nhân có hồ sơ ảnh thực tế trên Google Drive được cấp nút xem ảnh.\n\n' +
    'export const INITIAL_PATIENTS = ' + JSON.stringify(patients, null, 2) + ';\n\n' +
    'export const INITIAL_VISITS = ' + JSON.stringify(visits, null, 2) + ';\n';

  fs.writeFileSync(clinicDataPath, jsContent, 'utf8');
  console.log('\n🎉 Đã cập nhật thành công src/clinicData.js!');
}

updateClinicData().catch(console.error);

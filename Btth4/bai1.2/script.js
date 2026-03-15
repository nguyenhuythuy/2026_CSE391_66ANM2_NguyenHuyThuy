let danhSachSinhVien = [];
let kieuSapXep = ''; // Lưu trạng thái sắp xếp: '' (chưa xếp), 'asc' (tăng), 'desc' (giảm)

const inputHoTen = document.getElementById('hoTen');
const inputDiem = document.getElementById('diem');
const btnThem = document.getElementById('btnThem');
const tbodySinhVien = document.getElementById('bangSinhVien');
const divThongKe = document.getElementById('thongKe');

// Các element cho bộ lọc mới
const inputTimKiem = document.getElementById('timKiem');
const selectLocXepLoai = document.getElementById('locXepLoai');
const thDiem = document.getElementById('thDiem');
const iconSort = document.getElementById('iconSort');

// Hàm phụ trợ: Lấy xếp loại dựa trên điểm
function layXepLoai(diem) {
    if (diem >= 8.5) return 'Giỏi';
    if (diem >= 7.0) return 'Khá';
    if (diem >= 5.0) return 'Trung bình';
    return 'Yếu';
}

// Hàm cốt lõi: Kết hợp Tìm kiếm + Lọc + Sắp xếp
function applyFilters() {
    const tuKhoa = inputTimKiem.value.toLowerCase().trim();
    const xepLoaiCanLoc = selectLocXepLoai.value;

    // 1. Dùng array.filter() để lọc dữ liệu
    let danhSachDaLoc = danhSachSinhVien.filter(sv => {
        const xepLoaiCuaSv = layXepLoai(sv.diem);
        
        // Kiểm tra tên có chứa từ khóa không
        const khopTen = sv.hoTen.toLowerCase().includes(tuKhoa);
        // Kiểm tra xếp loại có khớp không (hoặc đang chọn "Tất cả")
        const khopXepLoai = (xepLoaiCanLoc === 'Tất cả') || (xepLoaiCuaSv === xepLoaiCanLoc);

        return khopTen && khopXepLoai;
    });

    // 2. Dùng array.sort() để sắp xếp nếu có yêu cầu
    if (kieuSapXep === 'asc') {
        danhSachDaLoc.sort((a, b) => a.diem - b.diem);
    } else if (kieuSapXep === 'desc') {
        danhSachDaLoc.sort((a, b) => b.diem - a.diem);
    }

    // 3. Vẽ bảng dựa trên mảng ĐÃ LỌC
    renderTable(danhSachDaLoc);
    capNhatIconSapXep();
}

// Hàm vẽ bảng, nhận vào một mảng truyền vào
function renderTable(mangHienThi) {
    tbodySinhVien.innerHTML = '';

    // Nếu mảng rỗng sau khi lọc
    if (mangHienThi.length === 0) {
        tbodySinhVien.innerHTML = `<tr><td colspan="5" class="empty-msg">Không có kết quả</td></tr>`;
    } else {
        mangHienThi.forEach((sv, index) => {
            const xepLoai = layXepLoai(sv.diem);
            const rowClass = sv.diem < 5.0 ? 'row-yeu' : '';

            const tr = `
                <tr class="${rowClass}">
                    <td>${index + 1}</td>
                    <td>${sv.hoTen}</td>
                    <td>${sv.diem.toFixed(1)}</td>
                    <td>${xepLoai}</td>
                    <td><button class="btn-delete" data-id="${sv.id}">Xóa</button></td>
                </tr>
            `;
            tbodySinhVien.innerHTML += tr;
        });
    }

    // Thống kê dựa trên toàn bộ lớp (mảng gốc)
    const tongSo = danhSachSinhVien.length;
    let tongDiemCuaLop = 0;
    danhSachSinhVien.forEach(sv => tongDiemCuaLop += sv.diem);
    
    const diemTB = tongSo > 0 ? (tongDiemCuaLop / tongSo).toFixed(2) : '0.00';
    divThongKe.innerHTML = `Tổng số sinh viên cả lớp: ${tongSo} | Điểm trung bình: ${diemTB}`;
}

// Hàm thêm sinh viên
function themSinhVien() {
    const hoTen = inputHoTen.value.trim();
    const diem = parseFloat(inputDiem.value);

    if (hoTen === '' || isNaN(diem) || diem < 0 || diem > 10) {
        alert('Vui lòng nhập họ tên và điểm hợp lệ (0-10)!');
        return;
    }

    // Dùng Date.now() tạo ID độc nhất cho mỗi người
    danhSachSinhVien.push({ id: Date.now(), hoTen: hoTen, diem: diem });
    
    // Gọi applyFilters thay vì renderTable để giữ nguyên trạng thái đang lọc (nếu có)
    applyFilters();

    inputHoTen.value = '';
    inputDiem.value = '';
    inputHoTen.focus();
}

function capNhatIconSapXep() {
    if (kieuSapXep === 'asc') iconSort.textContent = '▲';
    else if (kieuSapXep === 'desc') iconSort.textContent = '▼';
    else iconSort.textContent = '';
}

// --- GÁN CÁC SỰ KIỆN LẮNG NGHE (EVENT LISTENERS) ---

btnThem.addEventListener('click', themSinhVien);

inputDiem.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') themSinhVien();
});

// Sự kiện: Gõ vào ô tìm kiếm (Thời gian thực)
inputTimKiem.addEventListener('input', applyFilters);

// Sự kiện: Chọn bộ lọc xếp loại
selectLocXepLoai.addEventListener('change', applyFilters);

// Sự kiện: Click vào tiêu đề "Điểm" để sắp xếp
thDiem.addEventListener('click', function() {
    if (kieuSapXep === '' || kieuSapXep === 'desc') {
        kieuSapXep = 'asc'; // Tăng dần
    } else {
        kieuSapXep = 'desc'; // Giảm dần
    }
    applyFilters();
});

// Sự kiện: Xóa sinh viên
tbodySinhVien.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-delete')) {
        // Lấy ID độc nhất từ thuộc tính data-id
        const idCanXoa = parseInt(e.target.getAttribute('data-id'));
        
        // Lọc bỏ phần tử có ID đó ra khỏi mảng gốc
        danhSachSinhVien = danhSachSinhVien.filter(sv => sv.id !== idCanXoa);
        
        applyFilters();
    }
});
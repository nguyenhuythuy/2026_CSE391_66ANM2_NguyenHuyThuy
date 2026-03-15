// Dùng mảng để lưu danh sách sinh viên
let danhSachSinhVien = [];

// Lấy các element cần thiết từ DOM
const inputHoTen = document.getElementById('hoTen');
const inputDiem = document.getElementById('diem');
const btnThem = document.getElementById('btnThem');
const tbodySinhVien = document.getElementById('bangSinhVien');
const divThongKe = document.getElementById('thongKe');

// Hàm vẽ lại bảng và cập nhật thống kê
function renderTable() {
    // Xóa nội dung cũ
    tbodySinhVien.innerHTML = '';
    
    let tongDiem = 0;

    danhSachSinhVien.forEach((sv, index) => {
        // Tính xếp loại
        let xepLoai = '';
        if (sv.diem >= 8.5) xepLoai = 'Giỏi';
        else if (sv.diem >= 7.0) xepLoai = 'Khá';
        else if (sv.diem >= 5.0) xepLoai = 'Trung bình';
        else xepLoai = 'Yếu';

        // Xác định class tô màu nền nếu điểm < 5.0
        let rowClass = sv.diem < 5.0 ? 'row-yeu' : '';

        tongDiem += sv.diem;

        // Tạo chuỗi HTML cho một hàng
        const tr = `
            <tr class="${rowClass}">
                <td>${index + 1}</td>
                <td>${sv.hoTen}</td>
                <td>${sv.diem.toFixed(1)}</td>
                <td>${xepLoai}</td>
                <td><button class="btn-delete" data-index="${index}">Xóa</button></td>
            </tr>
        `;
        tbodySinhVien.innerHTML += tr;
    });

    // Cập nhật dòng thống kê
    const tongSo = danhSachSinhVien.length;
    const diemTB = tongSo > 0 ? (tongDiem / tongSo).toFixed(2) : '0.00';
    divThongKe.innerHTML = `Tổng số sinh viên: ${tongSo} | Điểm trung bình: ${diemTB}`;
}

// Hàm xử lý thêm sinh viên
function themSinhVien() {
    const hoTen = inputHoTen.value.trim();
    const diem = parseFloat(inputDiem.value);

    // Kiểm tra tính hợp lệ
    if (hoTen === '' || isNaN(diem) || diem < 0 || diem > 10) {
        alert('Vui lòng nhập họ tên không được để trống và điểm phải là số từ 0 đến 10!');
        return;
    }

    // Thêm vào mảng và vẽ lại bảng
    danhSachSinhVien.push({ hoTen: hoTen, diem: diem });
    renderTable();

    // Xóa trắng ô nhập và đưa con trỏ về ô họ tên
    inputHoTen.value = '';
    inputDiem.value = '';
    inputHoTen.focus();
}

// Sự kiện click nút Thêm
btnThem.addEventListener('click', themSinhVien);

// Sự kiện nhấn Enter ở ô Điểm
inputDiem.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        themSinhVien();
    }
});

// Event Delegation trên <tbody> để xử lý xóa
tbodySinhVien.addEventListener('click', function(e) {
    // Kiểm tra xem phần tử bị click có phải là nút xóa không
    if (e.target.classList.contains('btn-delete')) {
        // Lấy vị trí index từ thuộc tính data-index
        const index = e.target.getAttribute('data-index');
        
        // Xóa phần tử khỏi mảng
        danhSachSinhVien.splice(index, 1);
        
        // Cập nhật lại giao diện
        renderTable();
    }
});
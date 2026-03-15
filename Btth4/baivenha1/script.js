// ==========================================
// 1. TÍNH NĂNG ĐẾM KÝ TỰ HỌ TÊN
// ==========================================
const fullnameInput = document.getElementById('fullname');
const nameCounter = document.getElementById('nameCounter');

fullnameInput.addEventListener('input', function() {
    nameCounter.textContent = `${this.value.length}/50`;
});

// ==========================================
// 2. TÍNH NĂNG ẨN/HIỆN MẬT KHẨU
// ==========================================
const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.getElementById('togglePassword');

togglePasswordBtn.addEventListener('click', function() {
    const isPassword = passwordInput.getAttribute('type') === 'password';
    passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
    this.textContent = isPassword ? '🙈' : '👁'; // Đổi icon
});

// ==========================================
// 3. TÍNH NĂNG ĐO ĐỘ MẠNH MẬT KHẨU
// ==========================================
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');

passwordInput.addEventListener('input', function() {
    const val = this.value;
    let strength = 0;

    if (val.length >= 6) strength += 1;
    if (val.match(/[A-Z]/) && val.match(/[a-z]/)) strength += 1;
    if (val.match(/[0-9]/) || val.match(/[^a-zA-Z0-9]/)) strength += 1;

    if (val.length === 0) {
        strengthBar.style.width = '0%';
        strengthText.textContent = '';
        return;
    }

    if (strength === 1 || val.length < 6) {
        strengthBar.style.width = '33%'; strengthBar.style.backgroundColor = '#dc3545';
        strengthText.textContent = 'Yếu'; strengthText.style.color = '#dc3545';
    } else if (strength === 2) {
        strengthBar.style.width = '66%'; strengthBar.style.backgroundColor = '#ffc107';
        strengthText.textContent = 'Trung bình'; strengthText.style.color = '#ffc107';
    } else {
        strengthBar.style.width = '100%'; strengthBar.style.backgroundColor = '#198754';
        strengthText.textContent = 'Mạnh'; strengthText.style.color = '#198754';
    }
});

// ==========================================
// 4. KIỂM TRA LỖI (VALIDATION) KHI BẤM ĐĂNG KÝ
// ==========================================
const form = document.getElementById('registerForm');

form.addEventListener('submit', function(e) {
    e.preventDefault(); // Ngăn chặn trang bị tải lại
    let isValid = true;

    // Hàm phụ trợ để báo lỗi
    const showError = (id, message) => {
        document.getElementById(id + 'Error').textContent = message;
        isValid = false;
    };
    
    // Xóa tất cả lỗi cũ trước khi kiểm tra lại
    ['fullname', 'email', 'phone', 'password', 'confirmPassword', 'gender', 'terms'].forEach(id => {
        document.getElementById(id + 'Error').textContent = '';
    });

    // Kiểm tra Họ tên
    if (fullnameInput.value.trim() === '') showError('fullname', 'Vui lòng nhập họ và tên');

    // Kiểm tra Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(document.getElementById('email').value)) showError('email', 'Email không hợp lệ (VD: name@gmail.com)');

    // Kiểm tra SĐT
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(document.getElementById('phone').value)) showError('phone', 'SĐT phải có đúng 10 số và bắt đầu bằng số 0');

    // Kiểm tra Mật khẩu
    if (passwordInput.value.length < 6) showError('password', 'Mật khẩu phải có ít nhất 6 ký tự');

    // Kiểm tra Xác nhận mật khẩu
    const confirmPass = document.getElementById('confirmPassword').value;
    if (confirmPass !== passwordInput.value || confirmPass === '') showError('confirmPassword', 'Mật khẩu xác nhận không khớp');

    // Kiểm tra Giới tính
    if (!document.getElementById('male').checked && !document.getElementById('female').checked) {
        showError('gender', 'Vui lòng chọn giới tính');
    }

    // Kiểm tra Điều khoản
    if (!document.getElementById('terms').checked) showError('terms', 'Bạn phải đồng ý với các điều khoản');

    // THÀNH CÔNG: Nếu không có lỗi nào (isValid vẫn là true)
    if (isValid) {
        form.style.display = 'none'; // Ẩn form
        document.getElementById('successMessage').style.display = 'block'; // Hiện lời chào
        document.getElementById('successName').textContent = fullnameInput.value;
    }
});
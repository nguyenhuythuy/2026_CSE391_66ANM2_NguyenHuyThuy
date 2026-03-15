// 1. CÁC HÀM TIỆN ÍCH (Hiển thị / Xóa lỗi)
function showError(fieldId, message) {
    document.getElementById(fieldId + 'Error').textContent = message;
}

function clearError(fieldId) {
    document.getElementById(fieldId + 'Error').textContent = '';
}

// 2. CÁC HÀM VALIDATE TỪNG TRƯỜNG (Trả về true/false)
function validateFullname() {
    const val = document.getElementById('fullname').value.trim();
    if (val === '') { showError('fullname', 'Họ và tên không được để trống'); return false; }
    if (val.length < 3) { showError('fullname', 'Họ và tên phải từ 3 ký tự trở lên'); return false; }
    const regex = /^[\p{L}\s]+$/u; 
    if (!regex.test(val)) { showError('fullname', 'Họ và tên chỉ chứa chữ cái và khoảng trắng'); return false; }
    clearError('fullname');
    return true;
}

function validateEmail() {
    const val = document.getElementById('email').value.trim();
    if (val === '') { showError('email', 'Email không được để trống'); return false; }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(val)) { showError('email', 'Email không đúng định dạng'); return false; }
    clearError('email');
    return true;
}

function validatePhone() {
    const val = document.getElementById('phone').value.trim();
    if (val === '') { showError('phone', 'Số điện thoại không được để trống'); return false; }
    const regex = /^0\d{9}$/;
    if (!regex.test(val)) { showError('phone', 'Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0'); return false; }
    clearError('phone');
    return true;
}

function validatePassword() {
    const val = document.getElementById('password').value;
    if (val === '') { showError('password', 'Mật khẩu không được để trống'); return false; }
    if (val.length < 8) { showError('password', 'Mật khẩu phải từ 8 ký tự trở lên'); return false; }
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    if (!regex.test(val)) { showError('password', 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số'); return false; }
    clearError('password');
    
    // Cập nhật lại Validate Confirm Password nếu như Confirm Password đã có dữ liệu
    const confirmVal = document.getElementById('confirmPassword').value;
    if (confirmVal !== '') validateConfirmPassword();

    return true;
}

function validateConfirmPassword() {
    const pass = document.getElementById('password').value;
    const confirmPass = document.getElementById('confirmPassword').value;
    if (confirmPass === '') { showError('confirmPassword', 'Vui lòng xác nhận mật khẩu'); return false; }
    if (pass !== confirmPass) { showError('confirmPassword', 'Mật khẩu xác nhận không khớp'); return false; }
    clearError('confirmPassword');
    return true;
}

function validateGender() {
    const maleChecked = document.getElementById('male').checked;
    const femaleChecked = document.getElementById('female').checked;
    if (!maleChecked && !femaleChecked) { showError('gender', 'Vui lòng chọn giới tính'); return false; }
    clearError('gender');
    return true;
}

function validateTerms() {
    const termsChecked = document.getElementById('terms').checked;
    if (!termsChecked) { showError('terms', 'Bạn phải đồng ý với điều khoản'); return false; }
    clearError('terms');
    return true;
}

// 3. GẮN SỰ KIỆN BLUR VÀ INPUT ĐỂ REAL-TIME VALIDATE
const textFields = [
    { id: 'fullname', validateFn: validateFullname },
    { id: 'email', validateFn: validateEmail },
    { id: 'phone', validateFn: validatePhone },
    { id: 'password', validateFn: validatePassword },
    { id: 'confirmPassword', validateFn: validateConfirmPassword }
];

textFields.forEach(field => {
    const el = document.getElementById(field.id);
    el.addEventListener('blur', field.validateFn);
    el.addEventListener('input', () => clearError(field.id));
});

// Xử lý riêng cho Radio (Giới tính) và Checkbox (Điều khoản) dùng sự kiện 'change'
const radios = document.querySelectorAll('input[name="gender"]');
radios.forEach(radio => radio.addEventListener('change', () => clearError('gender')));
document.getElementById('terms').addEventListener('change', () => clearError('terms'));

// 4. VALIDATE KHI SUBMIT
const form = document.getElementById('registerForm');
form.addEventListener('submit', function(event) {
    event.preventDefault();

    const isValid = validateFullname() 
                  & validateEmail() 
                  & validatePhone() 
                  & validatePassword() 
                  & validateConfirmPassword() 
                  & validateGender() 
                  & validateTerms();

    if (isValid) {
        form.style.display = 'none';
        document.getElementById('successMessage').style.display = 'block';
        document.getElementById('successName').textContent = document.getElementById('fullname').value.trim();
    }
});
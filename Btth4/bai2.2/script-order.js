// Data giá sản phẩm
const prices = { "ao": 150000, "quan": 300000, "giay": 500000 };

const form = document.getElementById('orderForm');
const confirmBox = document.getElementById('confirmBox');
const successMessage = document.getElementById('successMessage');

// --- HÀM TIỆN ÍCH ---
function showError(fieldId, msg) { document.getElementById(fieldId + 'Error').textContent = msg; }
function clearError(fieldId) { document.getElementById(fieldId + 'Error').textContent = ''; }

// --- TÍNH TỔNG TIỀN ---
function calculateTotal() {
    const product = document.getElementById('product').value;
    const qty = parseInt(document.getElementById('quantity').value) || 0;
    const totalEl = document.getElementById('totalPrice');
    
    if (product && qty > 0 && qty <= 99) {
        const total = prices[product] * qty;
        totalEl.textContent = total.toLocaleString('vi-VN') + ' VNĐ';
    } else {
        totalEl.textContent = '0 VNĐ';
    }
}
document.getElementById('product').addEventListener('change', calculateTotal);
document.getElementById('quantity').addEventListener('input', calculateTotal);

// --- ĐẾM KÝ TỰ GHI CHÚ ---
const noteInput = document.getElementById('note');
const noteCount = document.getElementById('noteCount');
noteInput.addEventListener('input', () => {
    const len = noteInput.value.length;
    noteCount.textContent = `${len}/200`;
    if (len > 200) {
        noteCount.style.color = 'red';
        showError('note', 'Ghi chú không được vượt quá 200 ký tự');
    } else {
        noteCount.style.color = '#666';
        clearError('note');
    }
});

// --- CÁC HÀM VALIDATE ---
function valProduct() {
    if (!document.getElementById('product').value) { showError('product', 'Vui lòng chọn sản phẩm'); return false; }
    clearError('product'); return true;
}
function valQuantity() {
    const qty = parseInt(document.getElementById('quantity').value);
    if (!qty || qty < 1 || qty > 99) { showError('quantity', 'Số lượng phải từ 1 đến 99'); return false; }
    clearError('quantity'); return true;
}
function valDate() {
    const dateVal = document.getElementById('deliveryDate').value;
    if (!dateVal) { showError('deliveryDate', 'Vui lòng chọn ngày giao'); return false; }
    
    const selected = new Date(dateVal); selected.setHours(0,0,0,0);
    const today = new Date(); today.setHours(0,0,0,0);
    const maxDate = new Date(today); maxDate.setDate(today.getDate() + 30);

    if (selected < today) { showError('deliveryDate', 'Không chọn ngày trong quá khứ'); return false; }
    if (selected > maxDate) { showError('deliveryDate', 'Ngày giao không quá 30 ngày từ hôm nay'); return false; }
    clearError('deliveryDate'); return true;
}
function valAddress() {
    const addr = document.getElementById('address').value.trim();
    if (addr === '') { showError('address', 'Địa chỉ không được để trống'); return false; }
    if (addr.length < 10) { showError('address', 'Địa chỉ phải từ 10 ký tự trở lên'); return false; }
    clearError('address'); return true;
}
function valNote() {
    if (document.getElementById('note').value.length > 200) return false; // Lỗi đã show ở event input
    return true;
}
function valPayment() {
    const isChecked = document.querySelector('input[name="payment"]:checked');
    if (!isChecked) { showError('payment', 'Vui lòng chọn phương thức thanh toán'); return false; }
    clearError('payment'); return true;
}

// --- GẮN SỰ KIỆN REALTIME ---
['product', 'quantity', 'deliveryDate', 'address'].forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener('blur', eval('val' + id.charAt(0).toUpperCase() + id.slice(1)));
    el.addEventListener('input', () => clearError(id));
});
document.querySelectorAll('input[name="payment"]').forEach(r => r.addEventListener('change', () => clearError('payment')));

// --- SUBMIT FORM ---
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const isValid = valProduct() & valQuantity() & valDate() & valAddress() & valNote() & valPayment();
    
    if (isValid) {
        // Render thông tin tóm tắt
        const spName = document.getElementById('product').options[document.getElementById('product').selectedIndex].text;
        const qty = document.getElementById('quantity').value;
        const total = document.getElementById('totalPrice').textContent;
        const date = document.getElementById('deliveryDate').value;
        
        document.getElementById('summaryList').innerHTML = `
            <li><strong>Sản phẩm:</strong> ${spName}</li>
            <li><strong>Số lượng:</strong> ${qty}</li>
            <li><strong>Ngày giao:</strong> ${date}</li>
            <li><strong>Tổng tiền:</strong> <span style="color:red; font-weight:bold">${total}</span></li>
        `;
        
        form.classList.add('hidden');
        confirmBox.classList.remove('hidden');
    }
});

// --- XÁC NHẬN / HỦY ---
document.getElementById('btnCancel').addEventListener('click', () => {
    confirmBox.classList.add('hidden');
    form.classList.remove('hidden');
});

document.getElementById('btnConfirm').addEventListener('click', () => {
    confirmBox.classList.add('hidden');
    successMessage.classList.remove('hidden');
});
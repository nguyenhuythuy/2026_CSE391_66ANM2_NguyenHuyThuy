const steps = document.querySelectorAll(".form-step");
const progressSteps = document.querySelectorAll(".step");
const progress = document.getElementById("progress");
let currentStep = 0;

// XỬ LÝ NÚT TIẾP THEO
document.querySelectorAll(".btn-next").forEach(button => {
    button.addEventListener("click", () => {
        if (validateStep()) {
            currentStep++;
            updateFormSteps();
            if(currentStep === 2) showSummary(); // Nếu tới bước 3 thì hiện tổng hợp
        }
    });
});

// XỬ LÝ NÚT QUAY LẠI
document.querySelectorAll(".btn-prev").forEach(button => {
    button.addEventListener("click", () => {
        currentStep--;
        updateFormSteps();
    });
});

function updateFormSteps() {
    // Hiện bước hiện tại, ẩn bước khác
    steps.forEach((step, index) => {
        step.classList.toggle("active", index === currentStep);
    });

    // Cập nhật thanh tiến trình
    progressSteps.forEach((step, index) => {
        step.classList.toggle("active", index <= currentStep);
    });
    
    const progressWidth = (currentStep / (progressSteps.length - 1)) * 100;
    progress.style.width = progressWidth + "%";
}

// HÀM HIỂN THỊ LẠI THÔNG TIN Ở BƯỚC 3
function showSummary() {
    const summary = document.getElementById("summary");
    summary.innerHTML = `
        <p><strong>Họ tên:</strong> ${document.getElementById('fullname').value}</p>
        <p><strong>Ngày sinh:</strong> ${document.getElementById('dob').value}</p>
        <p><strong>Email:</strong> ${document.getElementById('email').value}</p>
    `;
}

// HÀM VALIDATE CƠ BẢN (Bạn có thể viết chi tiết hơn)
function validateStep() {
    let isValid = true;
    const inputs = steps[currentStep].querySelectorAll("input");
    inputs.forEach(input => {
        if (!input.value) {
            input.style.borderColor = "red";
            isValid = false;
        } else {
            input.style.borderColor = "#ccc";
        }
    });
    return isValid;
}
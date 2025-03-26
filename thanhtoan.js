let cart = [];
let totalAmount = 0;

function addToCart(item, price) {
  cart.push({ item, price });
  updateCart();
}

function updateCart() {
  const cartItemsElement = document.getElementById("cart-items");
  cartItemsElement.innerHTML = '';

  cart.forEach((product) => {
    const li = document.createElement("li");
    li.innerText = `${product.item} - $${product.price}`;
    cartItemsElement.appendChild(li);
  });

  totalAmount = cart.reduce((total, product) => total + product.price, 0);
  document.getElementById("total").innerText = `Total: $${totalAmount}`;
}

function fillBillingAddress() {
  const useSameAddress = document.getElementById("same-address").checked;
  const shippingAddressInput = document.getElementById("shipping-address");
  const billingAddressInput = document.getElementById("billing-address");

  if (useSameAddress) {
    billingAddressInput.value = shippingAddressInput.value;
    shippingAddressInput.addEventListener('input', () => {
      if (document.getElementById("same-address").checked) {
        billingAddressInput.value = shippingAddressInput.value;
      }
    });
  } else {
    billingAddressInput.value = '';
  }
}

function togglePaymentFields() {
  const creditCardInfo = document.getElementById("credit-card-info");
  const qrCodeInfo = document.getElementById("qr-code-info");
  const selectedPayment = document.querySelector('input[name="payment"]:checked');

  creditCardInfo.classList.add("hidden");
  qrCodeInfo.classList.add("hidden");

  if (!selectedPayment) return;

  if (selectedPayment.value === "credit-card") {
    creditCardInfo.classList.remove("hidden");
  } else if (selectedPayment.value === "qr-code") {
    qrCodeInfo.classList.remove("hidden");
  }
}

function validatePhone(phone) {
  return /^\d{10}$/.test(phone);
}


function validateCreditCard(formatted) {
  const digitsOnly = formatted.replace(/\s/g, '');
  return digitsOnly.length >= 13 && digitsOnly.length <= 19;
}

function showError(inputElement, errorElementId, message) {
  const errorElement = document.getElementById(errorElementId);
  errorElement.textContent = message;
  errorElement.style.display = 'block';
  inputElement.classList.add('input-error');
}

function clearErrors() {
  const errorElements = ['phone-error'];
  errorElements.forEach(id => {
    const errorElement = document.getElementById(id);
    errorElement.textContent = '';
    errorElement.style.display = 'none';
  });
  document.getElementById('phone').classList.remove('input-error');
}

function submitOrder() {
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const shippingAddress = document.getElementById("shipping-address").value.trim();
  const billingAddress = document.getElementById("billing-address").value.trim();
  const paymentMethod = document.querySelector('input[name="payment"]:checked');

  let isValid = true;

  // Xóa lỗi cũ trước khi kiểm tra
  clearErrors();


  // Kiểm tra số điện thoại
  if (!phone || !validatePhone(phone)) {
    showError(document.getElementById("phone"), "phone-error", "Please Provide Actual Phone Number");
    isValid = false;
  }

  // Kiểm tra các trường bắt buộc khác
  if (!name || !shippingAddress || !billingAddress) {
    alert("Please fill in all required fields with valid information!");
    return;
  }

  if (!paymentMethod) {
    alert("Please select a payment method.");
    return;
  }

  if (paymentMethod.value === "credit-card") {
    const ccNumber = document.getElementById("credit-card-number").value.trim();
    if (!validateCreditCard(ccNumber)) {
      alert("Invalid credit card number.");
      return;
    }
  }

  if (!isValid) {
    return; // Ngăn submit nếu có lỗi
  }

  // Nếu mọi thứ hợp lệ, chuyển hướng đến trang thành công
  window.location.href = "success.html";
}

// Định dạng đầu vào cho số điện thoại và thẻ tín dụng
document.addEventListener("DOMContentLoaded", () => {
  const ccInput = document.getElementById("credit-card-number");
  if (ccInput) {
    ccInput.addEventListener("input", function () {
      let value = this.value.replace(/\D/g, '').substring(0, 19);
      let formatted = value.match(/.{1,4}/g)?.join(" ") || "";
      this.value = formatted;
    });
  }

  const phoneInput = document.getElementById("phone");
  if (phoneInput) {
    phoneInput.addEventListener("input", function () {
      this.value = this.value.replace(/\D/g, '').substring(0, 10);
    });
  }
});
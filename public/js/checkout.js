// ShopEase — Checkout Page

const summaryBody = document.getElementById("summary-body");
const summaryTotal = document.getElementById("summary-total");
const checkoutForm = document.getElementById("checkout-form");
const checkoutError = document.getElementById("checkout-error");

async function init() {
    const user = await getCurrentUser();

    if (!user) {
        window.location.href = "login.html";
        return;
    }

   let cart;
    try {
        cart = await getCart();
    } catch (err) {
        checkoutError.textContent = "Couldn't load your cart. Please try again.";
        return;
    }

    if (!cart.items || cart.items.length === 0) {
        window.location.href = "cart.html";
        return;
    }

    summaryBody.innerHTML = cart.items.map(item => `
        <div class="summary-row">
            <span>${item.product.name} × ${item.qty}</span>
            <span>${formatPrice(item.product.price * item.qty)}</span>
        </div>
    `).join("");

    summaryTotal.textContent = formatPrice(cartTotal(cart));
}

init();

checkoutForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    checkoutError.textContent = "";

    const payload = {
        fullName: document.getElementById("checkout-name").value.trim(),
        email: document.getElementById("checkout-email").value.trim(),
        phone: document.getElementById("checkout-phone").value.trim(),
        address: document.getElementById("checkout-address").value.trim(),
        paymentMethod: document.getElementById("checkout-payment").value
    };

    try {
        const order = await apiFetch("/orders", {
            method: "POST",
            body: JSON.stringify(payload)
        });

        initNav();

        document.querySelector(".checkout-box").innerHTML = `
            <div class="order-success">
                <h2>Order Placed!</h2>
                <p>Thank you for shopping with ShopEase. Your total of <strong>${formatPrice(order.totalAmount)}</strong> will be collected via ${order.paymentMethod}. A confirmation has been sent to your email.</p>
                <a href="index.html" class="btn">Back to Home</a>
            </div>
        `;
    } catch (err) {
        checkoutError.textContent = err.message;
    }
});

// ShopEase — Cart Page

const cartBody = document.getElementById("cart-body");
const cartEmpty = document.getElementById("cart-empty");
const cartTableWrap = document.getElementById("cart-table-wrap");
const grandTotalEl = document.getElementById("grand-total");
const cartLoggedOut = document.getElementById("cart-logged-out");

async function renderCart() {
    const user = await getCurrentUser();

    if (!user) {
        cartTableWrap.style.display = "none";
        cartEmpty.style.display = "none";
        cartLoggedOut.style.display = "block";
        document.body.style.visibility = "visible";
        return;
    }

    cartLoggedOut.style.display = "none";

    let cart;
    try {
        cart = await getCart();
    } catch (err) {
        cartTableWrap.style.display = "none";
        cartEmpty.style.display = "block";
        cartEmpty.innerHTML = `<p>Couldn't load your cart. Please try again.</p>`;
        return;
    }

   if (!cart.items || cart.items.length === 0) {
        cartTableWrap.style.display = "none";
        cartEmpty.style.display = "block";
        document.body.style.visibility = "visible";
        return;
    }

    cartTableWrap.style.display = "block";
    cartEmpty.style.display = "none";

    cartBody.innerHTML = cart.items.map(item => `
        <tr>
            <td class="cart-product">
                <img src="${item.product.image}" alt="${item.product.name}">
                <span>${item.product.name}</span>
            </td>
            <td>${formatPrice(item.product.price)}</td>
            <td>
                <div class="qty-control">
                    <button class="qty-btn" onclick="changeQty('${item.product._id}', ${item.qty - 1})" aria-label="Decrease quantity">−</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="changeQty('${item.product._id}', ${item.qty + 1})" aria-label="Increase quantity">+</button>
                </div>
            </td>
            <td>${formatPrice(item.product.price * item.qty)}</td>
            <td><button class="remove-btn" onclick="removeItem('${item.product._id}')">Remove</button></td>
        </tr>
    `).join("");

   grandTotalEl.textContent = formatPrice(cartTotal(cart));
    document.body.style.visibility = "visible";

}

async function changeQty(productId, newQty) {
    try {
        if (newQty < 1) {
            await removeFromCart(productId);
        } else {
            await updateCartQty(productId, newQty);
        }
        await renderCart();
        initNav();
    } catch (err) {
        showToast(err.message);
    }
}

async function removeItem(productId) {
    try {
        await removeFromCart(productId);
        await renderCart();
        initNav();
    } catch (err) {
        showToast(err.message);
    }
}

renderCart();

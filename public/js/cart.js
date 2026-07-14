function formatPrice(num) {
    return "₹" + Number(num).toLocaleString("en-IN");
}

let toastTimer = null;
function showToast(message) {
    let toast = document.getElementById("toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        toast.className = "toast";
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2000);
}

async function getCurrentUser() {
    try {
        const data = await apiFetch("/auth/me");
        return data.user;
    } catch (e) {
        return null;
    }
}

async function getCart() {
    return apiFetch("/cart");
}

async function addToCart(productId, qty = 1) {
    return apiFetch("/cart", {
        method: "POST",
        body: JSON.stringify({ productId, qty })
    });
}

async function updateCartQty(productId, qty) {
    return apiFetch(`/cart/${productId}`, {
        method: "PUT",
        body: JSON.stringify({ qty })
    });
}

async function removeFromCart(productId) {
    return apiFetch(`/cart/${productId}`, { method: "DELETE" });
}

function cartTotal(cart) {
    return cart.items.reduce((sum, item) => sum + item.product.price * item.qty, 0);
}

function cartItemCount(cart) {
    return cart.items.reduce((sum, item) => sum + item.qty, 0);
}

// Updates the navbar: cart badge, and Login/Register vs "Hi, name" + Logout
async function initNav() {
    const user = await getCurrentUser();
    const authSlot = document.getElementById("nav-auth");

    if (authSlot) {
        if (user) {
            authSlot.innerHTML = `
                <span class="nav-user">Hi, ${user.name}</span>
                <a href="#" id="logout-link">Logout</a>
            `;
            document.getElementById("logout-link").addEventListener("click", async (e) => {
                e.preventDefault();
                await apiFetch("/auth/logout", { method: "POST" });
                window.location.href = "index.html";
            });
        } else {
            authSlot.innerHTML = `
                <a href="login.html">Login</a>
                <a href="register.html">Register</a>
            `;
        }
    }

    const badge = document.getElementById("cart-count");
    if (badge) {
        if (user) {
            try {
                const cart = await getCart();
                const count = cartItemCount(cart);
                badge.textContent = count;
                badge.style.display = count > 0 ? "inline-flex" : "none";
            } catch (e) {
                badge.style.display = "none";
            }
        } else {
            badge.style.display = "none";
        }
    }
}

document.addEventListener("DOMContentLoaded", initNav);

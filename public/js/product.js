// ShopEase — Product Details Page

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const qtyInput = document.getElementById("qty");
const addBtn = document.getElementById("add-to-cart");

let currentProduct = null;

(async function requireLoginForProductDetails() {
    const user = await getCurrentUser();
    if (!user) {
        window.location.href = "login.html";
    } else {
        document.body.style.visibility = "visible";
    }
})();

async function loadProduct() {
    if (!id) {
        document.querySelector(".product-info").innerHTML =
            `<h2>Product not found</h2><p>No product was specified.</p><a href="products.html" class="btn">Back to Products</a>`;
        return;
    }

    try {
        currentProduct = await apiFetch(`/products/${id}`);

        document.querySelector(".product-image img").src = currentProduct.image;
        document.querySelector(".product-image img").alt = currentProduct.name;
        document.querySelector(".product-info h2").textContent = currentProduct.name;
        document.querySelector(".price").textContent = formatPrice(currentProduct.price);
        document.querySelector(".product-info p").textContent = currentProduct.description;
        document.title = `ShopEase | ${currentProduct.name}`;
    } catch (err) {
        document.querySelector(".product-info").innerHTML =
            `<h2>Product not found</h2><p>This product may have been removed.</p><a href="products.html" class="btn">Back to Products</a>`;
    }
}

loadProduct();

if (addBtn) {
    addBtn.addEventListener("click", async () => {
        if (!currentProduct) return;

        const user = await getCurrentUser();
        if (!user) {
            showToast("Please log in to add items to your cart");
            setTimeout(() => { window.location.href = "login.html"; }, 1200);
            return;
        }

        const qty = Math.max(1, Number(qtyInput.value) || 1);

        try {
            await addToCart(currentProduct._id, qty);
            showToast(`${currentProduct.name} added to cart`);
            initNav();
        } catch (err) {
            showToast(err.message);
        }
    });
}

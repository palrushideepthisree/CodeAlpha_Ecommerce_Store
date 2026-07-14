// ShopEase — Products Listing Page

let ALL_PRODUCTS = [];
const productList = document.getElementById("product-list");
const search = document.getElementById("search");

(async function requireLoginForProducts() {
    const user = await getCurrentUser();
    if (!user) {
        window.location.href = "login.html";
    } else {
        document.body.style.visibility = "visible";
    }
})();

function renderProducts(productArray) {
    if (productArray.length === 0) {
        productList.innerHTML = `<p class="empty-msg">No products match your search.</p>`;
        return;
    }

    productList.innerHTML = productArray.map(product => `
        <div class="product-card">
            <a href="product.html?id=${product._id}" class="product-card-link">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
            </a>
            <p class="price">${formatPrice(product.price)}</p>
            <div class="product-card-actions">
                <button class="btn" onclick="handleAddToCart('${product._id}')">Add to Cart</button>
                <a href="product.html?id=${product._id}" class="btn btn-outline">View Details</a>
            </div>
        </div>
    `).join("");
}

async function handleAddToCart(id) {
    const user = await getCurrentUser();

    if (!user) {
        showToast("Please log in to add items to your cart");
        setTimeout(() => { window.location.href = "login.html"; }, 1200);
        return;
    }

    try {
        await addToCart(id, 1);
        const product = ALL_PRODUCTS.find(p => p._id === id);
        showToast(`${product ? product.name : "Item"} added to cart`);
        initNav();
    } catch (err) {
        showToast(err.message);
    }
}

async function loadProducts() {
    try {
        ALL_PRODUCTS = await apiFetch("/products");
        renderProducts(ALL_PRODUCTS);
    } catch (err) {
        productList.innerHTML = `<p class="empty-msg">Couldn't load products — is the backend running?</p>`;
    }
}

loadProducts();

// Search Feature
search.addEventListener("keyup", () => {
    const keyword = search.value.toLowerCase();

    const filteredProducts = ALL_PRODUCTS.filter(product =>
        product.name.toLowerCase().includes(keyword)
    );

    renderProducts(filteredProducts);
});
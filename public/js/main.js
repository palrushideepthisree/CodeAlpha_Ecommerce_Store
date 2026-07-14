// ShopEase — Home Page

const featuredContainer = document.querySelector(".featured .product-container");

async function loadFeatured() {
    if (!featuredContainer) return;

    try {
        const products = await apiFetch("/products");
        const featured = products.slice(0, 3);

        featuredContainer.innerHTML = featured.map(product => `
            <div class="product-card">
                <a href="product.html?id=${product._id}" class="product-card-link">
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                </a>
                <p class="price">${formatPrice(product.price)}</p>
                <a href="product.html?id=${product._id}" class="btn">View Details</a>
            </div>
        `).join("");
    } catch (err) {
        featuredContainer.innerHTML = `<p class="empty-msg">Couldn't load products — is the backend running?</p>`;
    }
}

loadFeatured();

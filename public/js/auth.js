// ShopEase — Login & Register
// backend sets a session cookie

const registerForm = document.getElementById("register-form");

if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("reg-name").value.trim();
        const email = document.getElementById("reg-email").value.trim();
        const password = document.getElementById("reg-password").value;
        const confirm = document.getElementById("reg-confirm").value;
        const errorEl = document.getElementById("register-error");

        errorEl.textContent = "";

        if (password.length < 6) {
            errorEl.textContent = "Password must be at least 6 characters.";
            return;
        }

        if (password !== confirm) {
            errorEl.textContent = "Passwords do not match.";
            return;
        }

        try {
            await apiFetch("/auth/register", {
                method: "POST",
                body: JSON.stringify({ name, email, password })
            });
            window.location.href = "index.html";
        } catch (err) {
            errorEl.textContent = err.message;
        }
    });
}

const loginForm = document.getElementById("login-form");

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("login-email").value.trim();
        const password = document.getElementById("login-password").value;
        const errorEl = document.getElementById("login-error");

        errorEl.textContent = "";

        try {
            await apiFetch("/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password })
            });
            window.location.href = "index.html";
        } catch (err) {
            errorEl.textContent = err.message;
        }
    });

    const params = new URLSearchParams(window.location.search);
    if (params.get("registered")) {
        const msg = document.getElementById("login-success");
        if (msg) msg.textContent = "Account created! Please log in.";
    }
}

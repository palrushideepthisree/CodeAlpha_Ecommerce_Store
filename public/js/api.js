// ShopEase — API helper
// Frontend and backend are now served from the same origin,
// so we just use a relative path.

const API_BASE = "/api";

async function apiFetch(path, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
        credentials: "include", // send/receive the session cookie
        headers: { "Content-Type": "application/json", ...(options.headers || {}) },
        ...options
    });

    let data = null;
    try {
        data = await res.json();
    } catch (e) {
        // response had no JSON body
    }

    if (!res.ok) {
        const message = (data && data.message) || `Request failed (${res.status})`;
        throw new Error(message);
    }

    return data;
}
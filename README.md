# ShopEase

ShopEase is a full-stack e-commerce application that allows users to browse products, register and log in, manage their shopping cart, and place orders. The backend handles authentication, product management, cart operations, and basic order processing using Node.js, Express, and MongoDB.

## Technologies

Express + MongoDB (Mongoose) API for the ShopEase frontend. Auth uses
server-tracked session cookies (not JWT) — sessions are stored in
MongoDB via `connect-mongo`, so they survive server restarts.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Make sure MongoDB is running locally, or have a MongoDB Atlas
   connection string ready.

3. Copy the example environment file and fill it in:
   ```
   cp .env.example .env
   ```
   - `MONGODB_URI` — your MongoDB connection string
   - `SESSION_SECRET` — any long random string
   - `CLIENT_ORIGIN` — the URL your frontend is served from (e.g. the
     Live Server URL, like `http://127.0.0.1:5500`)

4. Seed the product catalog (matches the frontend's original 6 products):
   ```
   npm run seed
   ```

5. Start the server:
   ```
   npm run dev
   ```
   The API runs at `http://localhost:5000` by default.

## Notes on the frontend

The frontend currently stores products, cart, and accounts in
`localStorage` as a placeholder. To connect it to this backend:

- Product IDs change from small numbers (1–6) to MongoDB ObjectIds
  (long strings) — any frontend code keying off numeric IDs needs to
  use the `_id` returned by `/api/products` instead.
- `fetch()` calls to this API need `credentials: "include"` so the
  session cookie is sent.
- Ask me to wire this up next and I'll update the frontend JS to call
  these endpoints instead of using localStorage.

## API Reference

All request/response bodies are JSON. Endpoints marked 🔒 require an
active session (i.e. the user must be logged in).

### Auth — `/api/auth`

| Method | Route | Body | Description |
|---|---|---|---|
| POST | `/register` | `{ name, email, password }` | Create an account and log in |
| POST | `/login` | `{ email, password }` | Log in |
| POST | `/logout` | — | Log out, destroys session |
| GET | `/me` | — | Currently logged-in user, or `{ user: null }` |

### Products — `/api/products`

| Method | Route | Body | Description |
|---|---|---|---|
| GET | `/` | — | List all products. Optional `?search=keyword` |
| GET | `/:id` | — | Get one product |
| POST | `/` | `{ name, price, image, description, stock }` | Create a product |
| PUT | `/:id` | any of the above fields | Update a product |
| DELETE | `/:id` | — | Delete a product |

### Cart — `/api/cart` 🔒 (all routes require login)

| Method | Route | Body | Description |
|---|---|---|---|
| GET | `/` | — | Get the current user's cart |
| POST | `/` | `{ productId, qty }` | Add an item (or increase qty if already in cart) |
| PUT | `/:productId` | `{ qty }` | Set an item's quantity |
| DELETE | `/:productId` | — | Remove one item |
| DELETE | `/` | — | Clear the whole cart |

### Orders — `/api/orders` 🔒 (all routes require login)

| Method | Route | Body | Description |
|---|---|---|---|
| POST | `/` | `{ fullName, email, phone, address, paymentMethod }` | Place an order from the current cart, then empties it |
| GET | `/` | — | This user's order history |
| GET | `/:id` | — | One order (must belong to the logged-in user) |

## Project structure

```
shopease-backend/
├── server.js              Entry point — middleware, routes, listen
├── config/
│   └── db.js               MongoDB connection
├── models/
│   ├── User.js              name, email, hashed password
│   ├── Product.js           name, price, image, description, stock
│   ├── Cart.js               one per user, embedded items
│   └── Order.js              snapshot of items + shipping info at purchase time
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── cartRoutes.js
│   └── orderRoutes.js
├── middleware/
│   └── requireAuth.js       blocks routes if not logged in
└── seed/
    └── seedProducts.js       populates the product catalog
```
## Features

- User authentication with session-based login
- Product catalog CRUD
- Shopping cart management
- Order processing and order history
- MongoDB persistence with Mongoose

## Author

**Deepthi Sree**

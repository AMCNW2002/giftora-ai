# Giftora AI – Full Stack Project (React + FastAPI + MongoDB Atlas)

```
giftora-fullstack/
├── frontend/   React (Vite) website         → http://localhost:5173
└── backend/    FastAPI (Python) REST API    → http://localhost:8000   (docs: /docs)
                     │
                     └── MongoDB Atlas (cloud database)
```

**Rule of the project:** only **registered users** can use the shop. Anyone can open the
Sign in / Create account page, but every other page *and every API endpoint* needs a valid login token.

---

## 1. What you need installed
- Python 3.10 or newer  (`python --version`)
- Node.js 18 or newer   (`node --version`)
- A free MongoDB Atlas account

## 2. Create the cloud database (MongoDB Atlas) – one time
1. Go to <https://www.mongodb.com/cloud/atlas> → sign up → **Create a free (M0) cluster**.
2. **Database Access** → *Add New Database User* → choose a username + password → role *Read and write to any database*.
   Use a password with only letters and numbers (special characters like `@` or `#` must be URL-encoded).
3. **Network Access** → *Add IP Address* → *Add current IP address* (for learning you can use `0.0.0.0/0`, but never for a real shop).
4. **Database** → *Connect* → *Drivers* → copy the connection string. It looks like  
   `mongodb+srv://myuser:<db_password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority`  
   Replace `<db_password>` with your real password.

You do **not** need to create collections by hand – the backend creates them and adds the 14 starter gifts automatically.

## 3. Run the backend
```bash
cd backend
python -m venv .venv
# Windows:  .venv\Scripts\activate          Mac/Linux:  source .venv/bin/activate
pip install -r requirements.txt

cp .env.example .env        # Windows: copy .env.example .env
```
Open `backend/.env` and fill in:
- `MONGODB_URI`    → the string from step 2
- `JWT_SECRET_KEY` → run `python -c "import secrets; print(secrets.token_urlsafe(48))"` and paste the result

Start the server:
```bash
uvicorn app.main:app --reload
```
Open <http://localhost:8000/docs> – you can try every endpoint there.
(Register → copy the `token` → click **Authorize** → paste it.)

## 4. Run the frontend (second terminal)
```bash
cd frontend
npm install
npm run dev
```
Open <http://localhost:5173> → you land on the sign in page → *Create Account* → shop!

> In development Vite forwards every `/api/...` request to port 8000 (see `frontend/vite.config.js`), so there is nothing else to configure.

## 5. Run the tests (optional, no internet / Atlas needed)
```bash
cd backend
pip install -r requirements-dev.txt
pytest
```
The tests use a fake in-memory database and check, for example, that **every protected endpoint returns 401 without a token**.

---

## Backend folder structure (each file has ONE job)

```
backend/
├── app/
│   ├── main.py              ← starts the app, connects MongoDB, registers the routers, CORS
│   ├── core/
│   │   ├── config.py        ← reads .env (Mongo URI, JWT secret, shipping rules)
│   │   └── security.py      ← bcrypt password hashing + JWT create/verify
│   ├── db/
│   │   ├── database.py      ← MongoDB connection
│   │   ├── init_db.py       ← creates indexes + inserts starter products on startup
│   │   └── seed_data.py     ← the 14 starter products (edit / add here)
│   ├── api/
│   │   ├── deps.py          ← get_current_user  = the "security guard" for registered users
│   │   └── routes/          ← the endpoints, one file per feature
│   │       ├── auth.py      ← register, login, me
│   │       ├── products.py  ← list / get products
│   │       ├── cart.py      ← each user's shopping bag
│   │       ├── gift_box.py  ← saved gift box + AI suggestion
│   │       ├── orders.py    ← checkout, order history, promo codes
│   │       └── chat.py      ← AI concierge chat (messages saved)
│   ├── schemas/             ← Pydantic models: what JSON is allowed in / out (validation)
│   └── services/            ← business logic: pricing, gift_suggester, chatbot, catalog
├── tests/                   ← pytest tests
├── requirements.txt
└── .env.example
```

**How one request flows** (e.g. "add to cart"):

`React → api.js (adds the token) → routes/cart.py → deps.get_current_user (checks token) → schemas/cart.py (validates JSON) → MongoDB → JSON back`

## MongoDB collections

| Collection      | What is stored |
|-----------------|----------------|
| `users`         | name, email (unique), **password_hash** (never the real password), created_at |
| `products`      | the gift catalogue |
| `carts`         | one document per user: product ids + quantities |
| `gift_boxes`    | one saved gift box (budget, ribbon, message, items) per user |
| `orders`        | placed orders with a price snapshot, discount, shipping, total |
| `chat_messages` | every question to the concierge + the reply |

## API endpoints

| Method | URL | Login needed? |
|--------|-----|---------------|
| POST | `/api/auth/register` | no |
| POST | `/api/auth/login` | no |
| GET  | `/api/health` | no |
| GET  | `/api/auth/me` | **yes** |
| GET  | `/api/products`, `/api/products/{id}` | **yes** |
| GET / PUT / DELETE | `/api/cart` | **yes** |
| GET / PUT | `/api/gift-box` · POST `/api/gift-box/suggest` | **yes** |
| POST | `/api/promo/validate` | **yes** |
| POST / GET | `/api/orders` · GET `/api/orders/{id}` | **yes** |
| POST | `/api/chat` · GET `/api/chat/history` | **yes** |

Promo codes to try: `GIFTORA10`, `SAVE10` (10 %), `DELIGHT` (15 %).

## What was changed in the frontend
- `src/services/api.js` – now calls the real backend. The old fake "demo token" fallback was removed on purpose: it would let anyone "log in" when the server is down.
- `src/context/AuthContext.jsx` (new) – who is logged in. `ProductsContext.jsx` (new) – loads products from the API.
- `src/components/ProtectedRoute` (new) – sends visitors who are not signed in to `/login`. Used in `App.jsx`.
- Cart and Gift Box are saved in MongoDB per user (not in the browser's localStorage), so each account has its own.
- Checkout creates a real order; the **server** recalculates prices and discounts.
- `src/data/products.js` now only has the category labels – products come from the database.

## Security notes (good to explain in your viva)
- Passwords are hashed with **bcrypt**; login errors never reveal whether an email exists.
- Login returns a **JWT** (expires after 24 h by default). Every protected route runs `get_current_user`.
- Prices are never trusted from the browser – the server reads them from MongoDB.
- Users can only read **their own** orders / cart / gift box (queries are filtered by `user_id`).
- The JWT is kept in `localStorage` (simple, fine for learning). For a real production shop use an httpOnly cookie, add rate-limiting on login, and use HTTPS.
- Never commit `backend/.env` (it is already in `.gitignore`).

## Deploying later (idea)
- Backend → Render / Railway: start command `uvicorn app.main:app --host 0.0.0.0 --port $PORT`; add the `.env` values as environment variables; set `CORS_ORIGINS` to your site URL.
- Frontend → Vercel / Netlify: `npm run build`, and set `VITE_API_BASE_URL` to the backend URL.

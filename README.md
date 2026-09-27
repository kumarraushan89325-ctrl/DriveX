# DriveNow

**Book Your Perfect Ride, Anytime, Anywhere.**

Production-style MERN car rental platform: React + Vite frontend, Express API, MongoDB, JWT auth, Cloudinary image uploads, and date-overlap booking protection.

## Project structure

```text
car/
├── client/                 # React (Vite) frontend
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   ├── .env.example
│   └── package.json
├── server/                 # Express API
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── utils/
│   ├── seed.js
│   ├── server.js
│   └── .env.example
├── .gitignore
└── README.md
```

## Prerequisites

- Node.js 18 or newer
- MongoDB running locally **or** a MongoDB Atlas connection string
- (Optional) a [Cloudinary](https://cloudinary.com) account for production image hosting

## 1. Clone / open the project

```powershell
cd c:\Users\sahm7\OneDrive\Desktop\car
```

## 2. Backend setup

```powershell
cd server
copy .env.example .env
npm install
```

Edit `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/drivenow
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
TAX_RATE=0.18
ADMIN_EMAIL=admin@drivenow.com
ADMIN_PASSWORD=Admin@123
```

### MongoDB

**Local**

1. Install MongoDB Community Server.
2. Start the service (`net start MongoDB` on Windows, or `mongod`).
3. Keep `MONGODB_URI=mongodb://127.0.0.1:27017/drivenow`.

**Atlas**

1. Create a cluster and database user.
2. Allow your IP in Network Access.
3. Paste the `mongodb+srv://...` URI into `MONGODB_URI`.

### Cloudinary (car image uploads)

1. Sign up at https://cloudinary.com
2. From the dashboard copy **Cloud name**, **API Key**, and **API Secret**.
3. Put them in `server/.env`.

If Cloudinary keys are left empty, uploaded files are stored in `server/uploads/` and served at `/uploads/...`. Seeded cars already use Unsplash URLs so the app works without Cloudinary.

### Seed sample data

```powershell
cd server
npm run seed
```

This creates 8 cars plus:

| Role     | Email                   | Password      |
|----------|-------------------------|---------------|
| Admin    | `admin@drivenow.com`    | `Admin@123`   |
| Customer | `customer@drivenow.com` | `Customer@123`|

### Run the API

```powershell
cd server
npm run dev
```

API: http://localhost:5000  
Health: http://localhost:5000/api/health

## 3. Frontend setup

Open a **second** terminal:

```powershell
cd client
copy .env.example .env
npm install
npm run dev
```

App: http://localhost:5173

`client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Required npm packages

**Backend** (`server`): `express mongoose bcryptjs jsonwebtoken cookie-parser cors dotenv multer cloudinary express-validator`

**Frontend** (`client`): `react react-dom react-router-dom axios react-icons recharts`

**Frontend tooling**: `vite @vitejs/plugin-react tailwindcss postcss autoprefixer`

## API reference

All JSON. Authenticated routes send the JWT as an HTTP-only cookie **or** `Authorization: Bearer <token>`.

### Auth

| Method | Path | Access |
|--------|------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/logout` | Public |
| GET | `/api/auth/me` | Logged in |

Register body: `{ name, email, phone, password, confirmPassword }`  
Login body: `{ email, password }`

### Cars

| Method | Path | Access |
|--------|------|--------|
| GET | `/api/cars` | Public (filters: search, brand, fuelType, transmission, seats, category, minPrice, maxPrice, location, available, pickupDate, returnDate, sort) |
| GET | `/api/cars/:id` | Public |
| GET | `/api/cars/:id/availability?pickupDate=&returnDate=` | Public |
| POST | `/api/cars` | Admin (multipart `images`) |
| PUT | `/api/cars/:id` | Admin |
| DELETE | `/api/cars/:id` | Admin |

`sort`: `price_asc` · `price_desc` · `newest` · `popular`

### Bookings

| Method | Path | Access |
|--------|------|--------|
| POST | `/api/bookings` | Customer |
| GET | `/api/bookings/my` | Customer |
| GET | `/api/bookings/:id` | Owner or admin |
| PUT | `/api/bookings/:id/cancel` | Owner or admin |
| GET | `/api/bookings` | Admin |
| GET | `/api/bookings/stats` | Admin |
| PUT | `/api/bookings/:id/status` | Admin |

Booking overlap: a car cannot be reserved if another **Pending** or **Confirmed** booking overlaps the requested dates. Overlap example: existing `10 Sep → 15 Sep` vs new `12 Sep → 18 Sep` → unavailable.

Pricing: `totalDays = returnDate - pickupDate`, `subtotal = totalDays × pricePerDay`, `tax = subtotal × 0.18`, `totalAmount = subtotal + tax`.

### Users

| Method | Path | Access |
|--------|------|--------|
| GET | `/api/users/overview` | Admin |
| GET | `/api/users` | Admin |
| GET | `/api/users/:id` | Self or admin |
| PUT | `/api/users/:id` | Self or admin |
| DELETE | `/api/users/:id` | Admin |

## How to test a full booking

1. Start MongoDB, API, and Vite.
2. Run `npm run seed` in `server`.
3. Log in as `customer@drivenow.com`.
4. Open a car, pick dates that do **not** overlap an existing trip, submit **Book Now**.
5. Log out, log in as `admin@drivenow.com`.
6. Approve the booking under **Admin → Bookings**.

Trying the same dates again should return: **This car is not available for the selected dates.**

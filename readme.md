# Book My Ticket – Backend

A simplified movie ticket booking backend built using **Node.js, Express, and PostgreSQL**.
This project extends an existing codebase by adding **authentication and secure seat booking functionality**.

---

## 🚀 Features

- 🔐 User Registration & Login (JWT आधारित authentication)
- 🔒 Protected routes using middleware
- 🎟️ Seat booking system
- ⚡ Prevents duplicate bookings using DB transactions
- 👤 Bookings linked to logged-in users
- 🧱 Clean modular backend structure

---

## 🏗️ Tech Stack

- **Node.js**
- **Express.js**
- **PostgreSQL**
- **JWT (jsonwebtoken)**
- **bcryptjs**

## 📁 Project Structure

```
auth/
│
├── auth.controller.js    # Register, Login, Logout logic
├── auth.middleware.js    # JWT auth + token utilities
├── auth.model.js         # Database queries
├── auth.routes.js        # Routes
├── auth.utils.js         # Password hashing

bookings/
├── booking.controller.js   # Booking logic
├── booking.model.js        # DB queries
├── booking.routes.js       # Routes

movies/
├── movie.controller.js     # Movie & show logic
├── movie.model.js          # DB queries
├── movie.routes.js         # Routes

index.js                  # Main server
```

## 🔐 Authentication Flow

1. User registers → password is hashed using bcrypt
2. User logs in → receives JWT token
3. Token is sent in headers:

```
Authorization: Bearer <token>
```

4. Middleware verifies token and attaches user info to `req.user`

## 🔐 Auth APIs

### Register

```
POST /api/auth/register
```

### Login

```
POST /api/auth/login
```

Response:

```json
{
  "success": true,
  "token": "JWT_TOKEN",
  "user": {
    "id": 1,
    "email": "test@mail.com"
  }
}
```

---

### Logout

```
POST /api/auth/logout
Authorization: Bearer <token>
```

## 🎟️ Booking Flow

1. User selects seat
2. Request hits protected endpoint
3. Backend:
   - Starts transaction
   - Locks seat using `FOR UPDATE`
   - Checks availability
   - Updates booking

4. Commits transaction

---

### 🔥 Core Query

```sql
SELECT * FROM seats
WHERE id = $1 AND show_id = $2 AND isbooked = FALSE
FOR UPDATE;
```

## 💺 Seat Booking API

### Book Seat

```
PUT /:seatId/:showId/
Authorization: Bearer <token>
```

### Response

```json
{
  "success": true,
  "message": "Seat booked successfully"
}
```

## ⚙️ Setup Instructions

### 1. Clone repo

```
git clone <your-repo-url>
cd book-my-ticket
```

---

### 2. Install dependencies

```
npm install
```

---

### 3. Create `.env`

```
PORT=5500
ACCESS_SECRET=your_secret
REFRESH_SECRET=your_secret
DB_HOST=localhost
DB_PORT=5433
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=sql_class_2_db
```

---

### 4. Run server

```
npm start
```

## 🎯 Key Highlights

- ✅ JWT-based authentication
- ✅ Password hashing using bcrypt
- ✅ Protected routes with middleware
- ✅ Transaction-based booking system
- ✅ Race condition handling using `FOR UPDATE`
- ✅ Clean separation of concerns

---

## 🚀 Future Improvements

- 🎟️ Booking history
- ❌ Cancel booking
- 💳 Payment integration
- 🎨 Frontend UI

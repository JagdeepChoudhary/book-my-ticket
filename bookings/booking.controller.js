import * as bookingModel from "./booking.model.js";
// CREATE TABLE screens (
//     id SERIAL PRIMARY KEY,
//     name VARCHAR(100) NOT NULL,        -- e.g. "Screen 1", "IMAX Hall"
//     total_seats INT NOT NULL
// );

// CREATE TABLE shows (
//     id SERIAL PRIMARY KEY,
//     movie_id INT NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
//     screen_id INT NOT NULL REFERENCES screens(id) ON DELETE CASCADE,
//     show_time TIMESTAMP NOT NULL,
//     price NUMERIC(8, 2) NOT NULL DEFAULT 250.00,
//     created_at TIMESTAMP DEFAULT NOW()
// );
// CREATE TABLE seats (
//     id SERIAL PRIMARY KEY,
//     show_id INT NOT NULL REFERENCES shows(id) ON DELETE CASCADE,
//     user_id INT REFERENCES users(id) ON DELETE SET NULL,
//     seat_number VARCHAR(10) NOT NULL,  -- e.g. "A1", "B4"
//     isbooked BOOLEAN DEFAULT FALSE,
//     UNIQUE(show_id, seat_number)       -- no duplicate seats per show
// );
export const getMyBookings = async (req, res) => {
    try {
        const result = await bookingModel.getMyBookingsQuery(req.user.id);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "No bookings found" });
        }
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch bookings" });
    }
};
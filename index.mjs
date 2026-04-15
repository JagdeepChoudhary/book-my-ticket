// CREATE TABLE seats (
//     id SERIAL PRIMARY KEY,
//     show_id INT NOT NULL REFERENCES shows(id) ON DELETE CASCADE,
//     user_id INT REFERENCES users(id) ON DELETE SET NULL,
//     seat_number VARCHAR(10) NOT NULL,  -- e.g. "A1", "B4"
//     isbooked BOOLEAN DEFAULT FALSE,
//     UNIQUE(show_id, seat_number)       -- no duplicate seats per show
// );

import express from "express";
import pg from "pg";
import { dirname } from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import "dotenv/config";
import authRoute from "./auth/auth.routes.js";
import { authenticate } from "./auth/auth.middleware.js";
import movieRoutes from "./movies/movie.routes.js";
import bookingRoutes from "./bookings/booking.routes.js";
const __dirname = dirname(fileURLToPath(import.meta.url));

const port = process.env.PORT || 5500;

// Equivalent to mongoose connection
// Pool is nothing but group of connections
// If you pick one connection out of the pool and release it
// the pooler will keep that connection open for sometime to other clients to reuse
export const pool = new pg.Pool({
  host: "localhost",
  port: 5433,
  user: "postgres",
  password: "postgres",
  database: "sql_class_2_db",
  max: 20,
  connectionTimeoutMillis: 0,
  idleTimeoutMillis: 0,
});

const app = new express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
// Assuming that movies and seats deatils not need auth
app.use("/api/auth", authRoute);
app.use("/movies", movieRoutes);
app.use("/", bookingRoutes);
// Get all movies

// Get all shows for a movie (with screen info)


// Get all seats for a show
app.get("/shows/:showId/seats", async (req, res) => {
  try {
    const { showId } = req.params;

    const show = await pool.query("SELECT id FROM shows WHERE id = $1", [showId]);
    if (show.rowCount === 0) {
      return res.status(404).json({ success: false, error: "Show not found" });
    }

    const result = await pool.query(
      `SELECT id, seat_number, isbooked
       FROM seats
       WHERE show_id = $1
       ORDER BY seat_number`,
      [showId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to fetch seats" });
  }
});

// Book a seat
app.put("/:seatId/:showId", authenticate, async (req, res) => {
  const conn = await pool.connect();

  try {
    const showId = Number(req.params.showId);
    const seatId = Number(req.params.seatId);
    const userId = req.user.id;

    if (!showId || !seatId) {
      return res.status(400).json({
        success: false,
        error: "Invalid showId or seatId",
      });
    }

    await conn.query("BEGIN");


    const result = await conn.query(
      `SELECT id, seat_number 
       FROM seats 
       WHERE id = $1 AND show_id = $2 AND isbooked = FALSE
       FOR UPDATE`,
      [seatId, showId]
    );

    if (result.rowCount === 0) {
      await conn.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        error: "Seat already booked or not found",
      });
    }


    await conn.query(
      `UPDATE seats 
       SET isbooked = TRUE, user_id = $3
       WHERE id = $1 AND show_id = $2`,
      [seatId, showId, userId]
    );

    const details = await conn.query(
      `SELECT 
          s.id,
          s.seat_number,
          sh.show_time,
          sh.price,
          m.title,
          sc.name AS screen
       FROM seats s
       JOIN shows sh ON s.show_id = sh.id
       JOIN movies m ON sh.movie_id = m.id
       JOIN screens sc ON sh.screen_id = sc.id
       WHERE s.id = $1 AND s.show_id = $2`,
      [seatId, showId]
    );

    await conn.query("COMMIT");

    const booking = details.rows[0];

    res.json({
      success: true,
      message: "Seat booked successfully",
      booking: {
        seatId,
        seatNumber: booking.seat_number,
        movie: booking.title,
        screen: booking.screen,
        showTime: booking.show_time,
        price: booking.price,
      },
    });

  } catch (err) {
    await conn.query("ROLLBACK");
    console.error(err);

    res.status(500).json({
      success: false,
      error: "Booking failed",
    });

  } finally {
    conn.release();
  }
});

app.listen(port, () => console.log("Server starting on :http://localhost:" + port));

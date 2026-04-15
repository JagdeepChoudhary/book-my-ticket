import { pool } from "../index.mjs";

export const getMyBookingsQuery = (userId) => {
    return pool.query(
        `SELECT 
       s.id AS seat_id,
       s.seat_number,
       m.title,
       m.genre,
       m.language,
       m.duration_mins,
       sh.show_time,
       sh.price,
       sc.name AS screen
     FROM seats s
     JOIN shows sh ON s.show_id = sh.id
     JOIN movies m ON sh.movie_id = m.id
     JOIN screens sc ON sh.screen_id = sc.id
     WHERE s.user_id = $1
     ORDER BY sh.show_time`,
        [userId]
    );
};
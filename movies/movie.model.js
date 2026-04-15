import { pool } from "../index.mjs";


// CREATE TABLE IF NOT EXISTS movies (
//     id SERIAL PRIMARY KEY,
//     title VARCHAR(255) NOT NULL,
//     description TEXT,
//     genre VARCHAR(100),
//     language VARCHAR(50),
//     duration_mins INT,              -- 👈 important (used in your queries)
//     release_date DATE,
//     poster_url TEXT,
//     created_at TIMESTAMPTZ DEFAULT NOW(),
//     updated_at TIMESTAMPTZ DEFAULT NOW()
// );
export const getAllMoviesQuery = () => {
    return pool.query("SELECT * FROM movies ORDER BY title");
};

export const getMovieByIdQuery = (movieId) => {
    return pool.query("SELECT id FROM movies WHERE id = $1", [movieId]);
};

export const getShowsByMovieQuery = (movieId) => {
    return pool.query(
        `SELECT 
       sh.id AS show_id,
       sh.show_time,
       sh.price,
       sc.name AS screen,
       COUNT(s.id) FILTER (WHERE s.isbooked = FALSE) AS available_seats
     FROM shows sh
     JOIN screens sc ON sh.screen_id = sc.id
     LEFT JOIN seats s ON s.show_id = sh.id
     WHERE sh.movie_id = $1
     GROUP BY sh.id, sh.show_time, sh.price, sc.name
     ORDER BY sh.show_time`,
        [movieId]
    );
};
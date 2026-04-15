// CREATE TABLE IF NOT EXISTS users(
//     id            SERIAL PRIMARY KEY,
//     username      VARCHAR(100)        NOT NULL,
//     email         VARCHAR(255) UNIQUE NOT NULL,
//     password TEXT                NOT NULL,
//     is_verified BOOLEAN DEFAULT FALSE,
//     verification_token TEXT,
//     refresh_token TEXT,
//     created_at    TIMESTAMPTZ         DEFAULT NOW()
// );

import { pool } from "../index.mjs";

export const updateRefreshToken = (userId, token) => {
    return pool.query(
        "UPDATE users SET refresh_token = $1 WHERE id = $2",
        [token, userId]
    );
};

export const findUserByRefreshToken = (token) => {
    return pool.query(
        "SELECT * FROM users WHERE refresh_token = $1",
        [token]
    );
};
export const findUserByEmail = (email) => {
    return pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );
}
export const createUser = (username, email, password,) => {
    return pool.query(
        "INSERT INTO users (username, email, password ) VALUES ($1, $2, $3) RETURNING *",
        [username, email, password,]
    );
}
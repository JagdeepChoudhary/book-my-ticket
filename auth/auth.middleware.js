import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.ACCESS_SECRET || "access_secret";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh_secret";
const VERIFY_SECRET = process.env.VERIFY_SECRET || "verify_secret";


export const generateAccessToken = (payload) =>
    jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });

export const generateRefreshToken = (payload) =>
    jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });

export const generateVerificationToken = (payload) =>
    jwt.sign(payload, VERIFY_SECRET, { expiresIn: "1d" });

/**
 * authenticate middleware to protect routes
 * 1. Check if Authorization header exists and starts with "Bearer "
 * 2. Extract token and verify it using jwt.verify()
 * 3. If valid, attach decoded payload to req.user and call next()
 * 4. If invalid or expired, return 401 with appropriate message
 */
export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith("Bearer ")) { return res.status(401).json({ success: false, error: "No token provided" }) };

    const token = authHeader.slice(7);
    try {
        const decoded = jwt.verify(token, ACCESS_SECRET);

        req.user = {
            id: decoded.id,
            email: decoded.email
        };

        next();
    } catch (err) {
        const isExpired = err.name === "TokenExpiredError";

        return res.status(isExpired ? 401 : 403).json({
            success: false,
            error: isExpired ? "Token expired" : "Invalid token",
            code: isExpired ? "TOKEN_EXPIRED" : "INVALID_TOKEN",
        });
    }
};


export const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, REFRESH_SECRET);
    } catch {
        throw new Error("Invalid or expired refresh token");
    }
};
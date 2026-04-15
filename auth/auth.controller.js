import { generateAccessToken } from "./auth.middleware.js";
import { createUser, findUserByEmail, updateRefreshToken } from "./auth.model.js";
import { comparePassword, hashPassword } from "./auth.utils.js";

export const register = async (req, res) => {
    console.log(req.body);
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            error: "All fields are required",
        });
    }

    try {
        // Check if user already exists
        const existingUser = await findUserByEmail(email);

        if (existingUser.rowCount > 0) {
            return res.status(409).json({
                success: false,
                error: "User with this email already exists",
            });
        }
        const hashedPassword = await hashPassword(password);
        // Create new user
        const result = await createUser(name, email, hashedPassword); // You should generate a verification token here
        result.rows[0].password = undefined;
        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user: result.rows[0],
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            error: "Email and password are required",
        });
    }

    try {
        const user = await findUserByEmail(email);

        if (user.rowCount === 0) {
            return res.status(401).json({
                success: false,
                error: "Invalid email or password",
            });
        }
        const isPasswordValid = await comparePassword(password, user.rows[0].password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                error: "Invalid email or password",
            });
        }
        const token = generateAccessToken({ id: user.rows[0].id, email: user.rows[0].email });
        const refreshToken = generateAccessToken({ id: user.rows[0].id, email: user.rows[0].email });
        await updateRefreshToken(user.rows[0].id, refreshToken);
        user.rows[0].password = undefined;
        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token,
            user: user.rows[0],
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
}

export const logout = async (req, res) => {
    const userId = req.user.id;

    try {
        await updateRefreshToken(userId, null);
        return res.status(200).json({
            success: true,
            message: "User logged out successfully",
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
}
import bcrypt from "bcryptjs";
/**
 * 
 * @param {*} password 
 * @returns  hashed password 
 */
export const hashPassword = async (password) => {
    return bcrypt.hash(password, 10);
};


/**
 * Compares a plain text password with a hashed password
 * @param {string} password - The plain text password to compare
 * @param {string} hashedPassword - The hashed password to compare against
 * @returns {Promise<boolean>} - A promise resolving to true if the passwords match, false otherwise
 */
export const comparePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
};
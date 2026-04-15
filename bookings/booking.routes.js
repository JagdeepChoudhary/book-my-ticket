import express from "express";
import { authenticate } from "../auth/auth.middleware.js";
import { getMyBookings } from "./booking.controller.js";

const router = express.Router();

router.get("/mybookings", authenticate, getMyBookings);

export default router;
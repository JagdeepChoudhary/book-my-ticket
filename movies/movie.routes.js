import express from "express";
import {
    getMovies,
    getShowsByMovie,
} from "./movie.controller.js";

const router = express.Router();

router.get("/", getMovies);
router.get("/:movieId/shows", getShowsByMovie);

export default router;
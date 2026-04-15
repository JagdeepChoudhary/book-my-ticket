import * as movieModel from "./movie.model.js";

export const getMovies = async (req, res) => {
    try {
        const result = await movieModel.getAllMoviesQuery();
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch movies" });
    }
};

export const getShowsByMovie = async (req, res) => {
    try {
        const { movieId } = req.params;

        const movie = await movieModel.getMovieByIdQuery(movieId);

        if (movie.rowCount === 0) {
            return res.status(404).json({ error: "Movie not found" });
        }

        const shows = await movieModel.getShowsByMovieQuery(movieId);
        res.json(shows.rows);

    } catch (err) {
        res.status(500).json({ error: "Failed to fetch shows" });
    }
};
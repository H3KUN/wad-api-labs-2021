import express from "express";
import {genres} from "./genresData";

const genresRouter = express.Router();
genresRouter.get('/', (req, res) => {
    res.json(genres);
});
export default genresRouter;
import express from "express";
import {movies,movieDetails,movieReviews} from "./moviesData";
import uniqid from 'uniqid'

const moviesRouter = express.Router();
moviesRouter.get('/', (req, res) => {
    res.json(movies);
});
moviesRouter.get('/:id',(req,res)=>{
    const id = parseInt(req.params.id);
    if (movieDetails.id === id) {
        res.status(200).json(movieDetails);
    } else {
        res.status(404).json({
            message: 'The resource you requested could not be found.',
            status_code: 404
        });
    }
});
moviesRouter.get('/:id/reviews',(req,res) =>{
    const id = parseInt(req.params.id);
    // find reviews in list
    if (movieReviews.id === id) {
        res.status(200).json(movieReviews);
    } else {
        res.status(404).json({
            message: 'The resource you requested could not be found.',
            status_code: 404
        });
    }
})
moviesRouter.post('/:id/reviews',(req,res) => {
    const id = parseInt(req.params.id);
    if (movieReviews.id === id) {
        req.body.created_at = new Date();
        req.body.updated_at = new Date();
        req.body.id = uniqid();
        movieReviews.results.push(req.body); //push the new review onto the list
        res.status(201).json(req.body);
    } else {
        res.status(404).json({
            message: 'The resource you requested could not be found.',
            status_code: 404
        });
    }
})
export default moviesRouter;
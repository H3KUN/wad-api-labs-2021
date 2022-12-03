import express from 'express';
import User from './userModel';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import movieModel from '../movies/movieModel';

const userRouter = express.Router(); // eslint-disable-line

// Get all users
userRouter.get('/', async (req, res) => {
    const users = await User.find();
    res.status(200).json(users);
});

// register(Create)/Authenticate User
userRouter.post('/', asyncHandler(async (req, res) => {
    if (!req.body.username || !req.body.password) {
        res.status(401).json({success: false, msg: 'Please pass username and password.'});
        return next();
    }
    if (req.query.action === 'register') {
        const regex = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/);
        if (regex.test(req.body.password)) {
            await User.create(req.body);
            res.status(201).json({code: 201, msg: 'Successful created new user.'});
        }else{
            res.status(401).json({code:401,msg:'It is Bad Password.XD Passwords are at least 5 characters long and contain at least one number and one letter.'})
        }


    } else {
        const user = await User.findByUserName(req.body.username);
        if (!user) return res.status(401).json({ code: 401, msg: 'Authentication failed. User not found.' });
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (isMatch && !err) {
                // if user is found and password matches, create a token
                const token = jwt.sign(user.username, process.env.SECRET);
                // return the information including token as JSON
                res.status(200).json({success: true, token: 'BEARER ' + token});
            } else {
                res.status(401).json({code: 401,msg: 'Authentication failed. Wrong password.'});
            }
        });
    }
}));
userRouter.put('/:id', async (req, res) => {
    if (req.body._id) delete req.body._id;
    const result = await User.updateOne({
        _id: req.params.id,
    }, req.body);
    if (result.matchedCount) {
        res.status(200).json({code: 200, msg: 'User Updated Sucessfully'});
    } else {
        res.status(404).json({code: 404, msg: 'Unable to Update User'});
    }
});
//Add a favourite. No Error Handling Yet. Can add duplicates too!
userRouter.post('/:userName/favourites', asyncHandler(async (req, res) => {
    const newFavourite = req.body.id;
    const userName = req.params.userName;
    const user = await User.findByUserName(userName);
    await user.favourites.add(newFavourite);
    await user.save();
    res.status(201).json(user.favourite);
}));
userRouter.post('/:userName/favourites/delete', asyncHandler(async (req, res) => {
    const newFavourite = req.body.id;
    const userName = req.params.userName;
    const user = await User.findByUserName(userName);
    await user.favourites.delete(newFavourite);
    await user.save();
    res.status(201).json(user.favourite);
}));
userRouter.get('/:userName/favourites', asyncHandler( async (req, res) => {
    const userName = req.params.userName;
    const user = await User.findByUserName(userName).populate('favourites');
    res.status(200).json(user.favourites);
}));
userRouter.post('/:userName/reviews', asyncHandler(async (req, res) => {
    const newReview = req.body.id;
    const userName = req.params.userName;
    const user = await User.findByUserName(userName);
    await user.reviews.add(newReview);
    await user.save();
    res.status(201).json(user.reviews);
}));
userRouter.get('/:userName/reviews', asyncHandler( async (req, res) => {
    const userName = req.params.userName;
    const user = await User.findByUserName(userName).populate('reviews');
    res.status(200).json(user.reviews);
}));
export default userRouter;
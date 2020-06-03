const express = require('express');
const { isLoggedIn } = require('./middlewares/permission');
const { 
    authRouter, 
    userRouter, 
    restaurantRouter, 
    stakeholderRouter, 
    connectionRouter,
    projectRouter,
    csvRouter
} = require('./routes');
const router = express.Router();

router.use('/auth', authRouter);
router.use('/restaurants', isLoggedIn, restaurantRouter);
router.use('/users', isLoggedIn, userRouter);
router.use('/stakeholders', isLoggedIn, stakeholderRouter);
router.use('/connections', isLoggedIn, connectionRouter);
router.use('/projects', isLoggedIn, projectRouter);
router.use('/csv', isLoggedIn, csvRouter);

module.exports = { apiRouter: router };

import express from 'express';
const { Router } = express;

import bodyParser from 'body-parser';
const jsonParser = bodyParser.json();


const isLogged = (req, res, next) => {
    if (!req.session.username){
        res.redirect("/user/login")
    }
    next();
};

const userRouter = new Router();

userRouter.get('/login', (req, res) => {
    return res.render("main", {layout: 'login'});
});

userRouter.post('/login', jsonParser, (req, res) => {
        req.session.username = req.body.name;
        return res.redirect('/productos');
});

userRouter.get('/logout', isLogged, (req, res) => {
    setTimeout(function () {
        req.session.destroy( err => err && console.log(err))
    }, 2000)
    return res.render("main", {layout: 'vuelvaProntos', username: req.session.username})
});


export default userRouter;
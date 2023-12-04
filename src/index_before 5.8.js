import express from "express";
import session from "express-session";
import login from './login.js';

const app = express();


app.use(
    session({
        //secret: '20083971d_eie4432_lab4',
        secret: '20083971D Qiu Liuming, 20091909D Su Bowen4',
        resave: false,
        saveUninitialized: false,
        cookie: { httpOnly: true },
    })
);

app.use('/auth', login);

app.get('/', (req, res) => {
    if (req.session.logged) {
        res.redirect('/index.html');
    } else {
        res.redirect('/login.html');
    }
});

app.use('/', express.static('static'));

app.listen(8080, ()=> {
    console.log(Date());
    console.log("Server started at http://127.0.0.1:8080");
});


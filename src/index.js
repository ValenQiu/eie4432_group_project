import express from "express";
import session from "express-session";
import login from './login.js';
import train from "./train.js";
import mongostore from 'connect-mongo';
import client from './dbclient.js';
import path from 'path'; 

const app = express();


app.use(
    session({
    secret: 'Group Project',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true },
    store: mongostore.create({
    client,
    dbName: 'projectdb',
    collectionName: 'session',
    }),
    })
   );

app.use('/auth', login);
app.use('/event',train);

// app.use('/', (req, res) => {
//     if (req.session.logged){

//     }
// })

app.get('/', (req, res) => {
    // if (req.session.logged) {
    res.redirect('/index.html');
    // } else {
    //     res.redirect('/login.html');
    // }
});

app.use('/', express.static(path.join(process.cwd(), '/static'))); 

app.listen(8080, ()=> {
    console.log(Date());
    console.log("Server started at http://127.0.0.1:8080");
});


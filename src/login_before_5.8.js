import express from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import bodyParser from 'body-parser';

// const {validate_user, update_user, fetch_user, username_exist
//     } = require('./userdb');

const users = new Map();
const route = express.Router();
const form = multer();

async function init_userdb(){
    if (users.size > 0){
        return;
    };
    try {
        const data = await fs.readFile('users.json', 'utf-8');
        const usersArray = JSON.parse(data);
        usersArray.forEach((user) => {
            users.set(user.username, user);
    });
    } catch (err) {
        console.log('error',err);
    }
}

async function validate_user(username, password){
    const user = users.get(username);
    if (!user || user.password !== password){
        return false;
    } else {
        return {
            username: user.username,
            role: user.role,
        };
    };
}

async function update_user(username, password, role){
    const user = users.get(username);
    if (user) {
        user.password = password;
        user.role = role;
    } else {
        const newUser = {
            username,
            password,
            role,
            enabled: true,
        };
        users.set(username, newUser);
    }

    try {
        const userjson = new Array();
        users.forEach((user) => {
            userjson.push(user);
        })
        await fs.writeFile('users.json', JSON.stringify(userjson, null, 2), 'utf-8');
        return true;
    } catch (error){
        console.error("Error writing to users.json:", error);
        return false;
    }
}

route.use(bodyParser.urlencoded({ extended: false }));
route.use(bodyParser.json());

route.post('/login', form.none(), async (req, res) => {
    await init_userdb();

    req.session.logged = false;
    const user = await validate_user(req.body.username, req.body.password);
    if (user && users.get(user.username).enabled) {
        req.session.username = user.username;
        req.session.role = user.role;
        req.session.logged = true;
        req.session.timestamp = Date.now();
        res.json({
            status: 'success',
            user: {
                username: user.username,
                role: user.role,
                },
        });
    } else if (user && !users.get(user.username).enabled) {
        res.status(401).json({
        status: 'failed',
        message: `User 'bob' is currently disabled`,
        });
    } else {
        res.status(401).json({
        status: 'failed',
        message: 'Incorrect username and password',
        });
    }
})

route.post('/logout', (req, res) => {
    if (req.session.logged) {
        req.session.destroy();
        res.end();
    } else {
        res.status(401).json({
        status: 'failed',
        message: 'Unauthorized',
        });
    }
  });

route.get('/me', async (req, res) => {
    if (req.session.logged) {
        const user = users.get(req.session.username);
        res.json({
          status: 'success',
          user: {
            username: user.username,
            role: user.role,
          },
        });
      } else {
        res.status(401).json({
          status: 'failed',
          message: 'Unauthorized',
        });
      }
})

route.post('/register',form.none(), async(req, res) => {
    if (users.size == 0){
        await init_userdb();
    }
    const usernameInput = req.body.username;
    var passwordInput = req.body.password;
    const roleInput = req.body.role;
    // console.log(req.body);
    // console.log(roleInput);

    if (!usernameInput || !passwordInput){
        res.status(400).json({
            status: 'failed',
            message:'Missing fields',
        });
        return;
    } else if (usernameInput.length < 3){
        res.status(400).json({
            status: 'failled',
            message: 'Username must be at least 3 characters',
        });
        return;
    } else if (users.has(usernameInput)){
        res.status(400).json({
        status: 'failled',
        message: `Username ${usernameInput} already exists`,
    }); 
        return;
    } else if (passwordInput.length < 8){
        res.status(400).json({
            status: 'failled',
            message: 'Password must be at least 8 characters',
        });
        return;
    } else if (roleInput !== "student" && roleInput !== "user"){
        res.status(400).json({
            status: 'failled',
            message: 'Role can only be either `student` or `user`',
        });
        return;
    }

    // console.log(passwordInput);
    const registrationSuccess = await update_user(usernameInput, passwordInput, roleInput);

    if (registrationSuccess){
        res.json({
            status: 'success',
            user:{
                username: usernameInput,
                role: roleInput,
            }
        });
        // console.log(res.status());
    } else {
        res.status(500).json({
            status: 'failed',
            message: 'Account created but unable to save into the database',
        })
    }

})

export default route;

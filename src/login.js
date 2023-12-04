import express from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import bodyParser from 'body-parser';
import crypto from 'crypto';
import {
    validate_user,
    update_user,
    fetch_user,
    username_exist,
    change_profile,
    allUsers,
    transactionHistory,
    lastLoginTime,
    lastProfileEditTime
  } from './userdb.js';
import { existsSync } from 'fs';

const users = new Map();
const route = express.Router();
const form = multer();

async function sha256(input){
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    return crypto.subtle.digest("SHA-256", data)
        .then(buffer => {
            const hashArray = Array.from(new Uint8Array(buffer));
            const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
            return hashHex;
        });
}

route.use(bodyParser.urlencoded({ extended: false }));
route.use(bodyParser.json());

route.post('/login', form.none(), async (req, res) => {

    req.session.logged = false;
    const passwordHashed = await sha256(req.body.password);
    const user = await validate_user(req.body.username, passwordHashed);

    if (user && user.enabled) {
        req.session.username = user.username;
        req.session.gender = user.gender;
        req.session.logged = true;
        req.session.role = user.role;
        req.session.timestamp = Date.now();
        // const loginTime = JSON.stringify(req.session.timestamp);
        const loginRecord = await lastLoginTime(req.session.username, Date());
        res.json({
            status: 'success',
            user: {
                username: user.username,
                role: user.role,
                },
        });
    } else if (user && !user.enabled) {
        res.status(401).json({
        status: 'failed',
        message: `User is currently disabled`,
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
        const user = await fetch_user(req.session.username);
        res.json({
          status: 'success',
          user: {
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            birthday: user.birthday,
            gender: user.gender,
            role: user.role,
            nickname: user.nickname,
            email:  user.email,
            lastLogintime: user.lastLoginTime,
          },
        });
      } else {
        res.status(401).json({
          status: 'failed',
          message: 'Unauthorized',
        });
      }
})

route.post('/profile',form.none(),async(req,res) => {
    const username = req.body.username;
    const gender_change = req.body.gender;
    const firstname_change = req.body.firstname;
    const lastname_change = req.body.lastname;
    const birthday_change = req.body.birthday;
    const nickname_change = req.body.nickname;
    const email_change = req.body.email;

    const changeSuccess = await change_profile(username, firstname_change, lastname_change, birthday_change,nickname_change,gender_change,email_change);

    if (changeSuccess){
        res.json({
            status: 'success',
        });
        // console.log(res.status());
    } else {
        res.status(401).json({
            status: 'failed',
            message: 'Unauthorized',
          });
    }
})
route.post('/register',form.none(), async(req, res) => {
    // if (users.size == 0){
    //     await init_userdb();
    // }
    const usernameInput = req.body.username;
    var passwordInput = req.body.password;
    const genderInput = req.body.gender;
    const firstnameInput = req.body.firstname;
    const lastnameInput = req.body.lastname;
    const birthdayInput = req.body.birthday;
    const nicknameInput = req.body.nickname;
    const role = req.body.role;
    const emailInput = req.body.email;
    // console.log(req.birthday);
    // console.log(roleInput);
    // console.log(req.body.birthday)

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
    } else if (await username_exist(usernameInput)){
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
    } else if (genderInput !== "Male" && genderInput !== "Female"&& genderInput !== "Other"){
        res.status(400).json({
            status: 'failled',
            message: 'Please select gender',
        });
        return;
    }
    const passwordHashed = await sha256(passwordInput)
        .then(hash => {
            console.log('Hashed data: ', hash);
            return hash;
        })
        .catch(error => console.error('Error', error));
    console.log(passwordHashed);
    // console.log(passwordInput);
    const registrationSuccess = await update_user(usernameInput, passwordHashed, role, firstnameInput, lastnameInput, birthdayInput, nicknameInput,true, genderInput,emailInput);

    if (registrationSuccess){
        res.json({
            status: 'success',
            user:{
                username: usernameInput,
                role: role,
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

route.get('/usersData',form.none(), async(req, res) => {
    const traingetSuccess = await allUsers();
    res.json(traingetSuccess);
  })

route.get('/transaction',form.none(), async(req, res) => {
    const traingetSuccess = await transactionHistory();
    res.json(traingetSuccess);
  })

export default route;

// const testing = 12345678;
// sha256(testing)
//     .then(hash => console.log('Hashed data: ', hash))
//     .catch(error => console.error('Error', error));
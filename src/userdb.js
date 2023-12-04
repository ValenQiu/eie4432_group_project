import fs from 'fs/promises';
import client from './dbclient.js';


async function init_db() {
    try {
        // TODO
        const users = client.db('projectdb').collection('users');
        const count = await users.countDocuments();
        // console.log(count);
        console.log(Date());
        if (count == 0){
            const data = await fs.readFile('users.json', 'utf-8');
            const userObjects = JSON.parse(data);
            const result = await users.insertMany(userObjects);
            console.log(`Added ${result.insertedCount} users`);
        } else {
            console.log("Database is already initialized");
        }
    } catch (err) {
        // TODO
        console.error('Unable to initialize the database!');
    }
}

async function validate_user(username, password){
    if (!username || !password){
        return false;
    }

    try{
        const users = client.db('projectdb').collection('users');
        const user = await users.findOne({ username, password });
    
        if (user) {
            return user;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Unable to fetch from database!');
        return false;
    }
}

async function change_profile(username, firstname, lastname, birthday, nickname, gender,email) {
    try {
        const users = client.db('projectdb').collection('users');
    
        const result = await users.updateOne(
            { username },
            { $set: { username, firstname, lastname, birthday, nickname, gender,email} },
            { upsert: true }
        );
    
        if (result.upsertedCount === 0) {
            console.log('Change 0 user');
        } else {
            console.log('Change 1 user');
        }
  
        return true;
    } catch (error) {
        console.error('Unable to update the database!');
        return false;
    }
}

async function update_user(username, password, role, firstname, lastname, birthday, nickname, enabled, gender,email) {
    try {
        const users = client.db('projectdb').collection('users');
    
        const result = await users.updateOne(
            { username },
            { $set: { username, password, firstname, lastname, birthday, nickname, role, enabled, gender,email} },
            { upsert: true }
        );
    
        if (result.upsertedCount === 0) {
            console.log('Added 0 user');
        } else {
            console.log('Added 1 user');
        }
  
        return true;
    } catch (error) {
        console.error('Unable to update the database!');
        return false;
    }
}

async function fetch_user(username) {
    try {
        const users = client.db('projectdb').collection('users');
        // console.log(users);
        const user = await users.findOne({ username });
        return user;
    } catch (error) {
        console.error('Unable to fetch from database!');
        return null;
    }
}

async function username_exist(username) {
    try {
      const user = await fetch_user(username);
      return user !== null;
    } catch (error) {
      console.error('Unable to fetch from database!');
      return false;
    }
}  

async function allUsers() {
    try {
        const users = client.db('projectdb').collection('users');
        const allUser = await users.find({}).toArray();
        return allUser;
    } catch (error) {
        console.error('Unable to fetch from database!');
        return null;
    }
}

async function transactionHistory() {
    try {
        const transactions = client.db('projectdb').collection('transactions');
        // console.log(users);
        const allTransaction = await transactions.find({}).toArray();
        // console.log(allTransaction);
        return allTransaction;
    } catch (error) {
        console.error('Unable to fetch from database!');
        return null;
    }
}

async function test(){
    try {
        const seats = client.db('projectdb').collection('seats');
        const bookedSeat = await seats.find({trainID:'G123'}).toArray();
        return bookedSeat;
    } catch (error) {
        console.error('Unable to fetch from database!');
        return null;
    }
}

async function lastLoginTime(username, lastLoginTime){
    try {
        const users = client.db('projectdb').collection('users');
        const user = await users.updateOne(
            { username },
            { $set: { lastLoginTime }},
            { upsert: true}
        );
        if (user.upsertedCount === 0) {
            console.log('Added 0');
        } else {
            console.log('Added 1');
        }
        return true;
    } catch (error) {
        console.error('Unable to fetch from database!');
        return null;
    }
}

async function lastProfileEditTime(username, lastProfileEditTime){
    try {
        const users = client.db('projectdb').collection('users');
        const user = await users.updateOne(
            { username },
            { $set: { lastProfileEditTime }},
            { upsert: true}
        );
        if (user.upsertedCount === 0) {
            console.log('Added 0');
        } else {
            console.log('Added 1');
        }
        return true;
    } catch (error) {
        console.error('Unable to fetch from database!');
        return null;
    }
}

// init_db().catch(console.dir);
// validate_user('alice','xyz').then((res) => console.log(res));
// validate_user('alice','ecila').then((res) => console.log(res));
// update_user('bob','bob4321','student',true).then((res) => console.log(res));
// update_user('new_user', 'new_password', 'user', false).then((res) => console.log(res)); 
// fetch_user('anyone').then((res) => console.log(res));
// fetch_user('20083971d').then((res) => console.log(res));
// username_exist('anyone').then((res) => console.log(res));
// username_exist('new_user').then((res) => console.log(res));
// test().then((res)=> console.log(res));

export  {
    validate_user,
    update_user,
    fetch_user,
    username_exist,
    change_profile,
    allUsers,
    transactionHistory,
    lastLoginTime,
    lastProfileEditTime
};

// fetch_user('valenqiu').then((res) => console.log(res));
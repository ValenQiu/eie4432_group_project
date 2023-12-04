//Ticket related functions
import fs from 'fs/promises';
import client from './dbclient.js';


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

async function update_ticket(train, start, end, startdate, enddate, starttime, endtime, time, price) {
    try {
        const tickets = client.db('projectdb').collection('ticket');
        
        const result = await tickets.updateOne(
            { train },
            { $set: { train, start, end, startdate, enddate, starttime, endtime, time, price} },
            { upsert: true }
        );
    
        if (result.upsertedCount === 0) {
            console.log('Added 0 ticket');
        } else {
            console.log('Added 1 ticket');
        }
  
        return true;
    } catch (error) {
        console.error('Unable to update the ticket!');
        return false;
    }
}


async function get_ticket(){
    try{
        //tickets_map = new Map();
        const tickets = client.db('projectdb').collection('ticket');

        // Find all objects in the collection
        var tickets_obj = tickets.find().toArray();
        console.log();
        return tickets_obj;
    } catch(error){
        console.log("cannot convert object");
    }
}

async function fetch_user(username) {
    try {
        const users = client.db('projectdb').collection('users');
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

export  {
    validate_user,
    update_ticket,
    get_ticket,
    fetch_user,
    username_exist,
    update_ticket2
};
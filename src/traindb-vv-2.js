//Ticket related functions
import fs from 'fs/promises';
import client from './dbclient.js';

async function init_db() {
    try {
        // TODO
        const trains = client.db('projectdb').collection('trains');
        const count = await trains.countDocuments();
        // console.log(count);
        console.log(Date());
        if (count == 0){
            const data = await fs.readFile('trains.json', 'utf-8');
            const trainObjects = JSON.parse(data);
            const result = await trains.insertMany(trainObjects);
            console.log(`Added ${result.insertedCount} trains`);
        } else {
            console.log("Database is already initialized");
        }
    } catch (err) {
        // TODO
        console.error('Unable to initialize the database!');
    }
}


async function update_train(trainID, depart, arrive, startdate, enddate, starttime, endtime, time, price) {
    try {
        const trains = client.db('projectdb').collection('trains');
        
        const result = await trains.updateOne(
            { trainID },
            { $set: { trainID, depart, arrive, startdate, enddate, starttime, endtime, time, price} },
            { upsert: true }
        );
    
        if (result.upsertedCount === 0) {
            console.log('Added 0 travel');
        } else {
            console.log('Added 1 travel');
        }
  
        return true;
    } catch (error) {
        console.error('Unable to update the travel!');
        return false;
    }
}

async function delete_train(trainID) {
    try {
        const trains = client.db('projectdb').collection('trains');
        
        const result = await trains.deleteOne({ trainID },);
    
        if (result.upsertedCount === 0) {
            console.log('Delete q travel');
        } else {
            console.log('Delete 0 travel');
        }
  
        return true;
    } catch (error) {
        console.error('Unable to delete the train!');
        return false;
    }
}

async function get_train(trainID) {
    try {
        const trains = client.db('projectdb').collection('trains');
        const train = await trains.findOne({trainID});
        return train;
    } catch (error) {
        console.error('Unable to fetch from database!');
        return null;
    }
}

async function allTrain() {
    try {
        const trains = client.db('projectdb').collection('trains');
        const allTrain = await trains.find({}).toArray();
        return allTrain;
    } catch (error) {
        console.error('Unable to fetch from database!');
        return null;
    }
}


async function getTrain(){
    const trainID = localStorage.getItem("trainID_filter");
    // const start = localStorage.getItem("start_filter");
    // const end= localStorage.getItem("end_filter");
    // const startdate = localStorage.getItem("startdate_filter");
    // const enddate = localStorage.getItem("enddate_filter");
    // const starttime = localStorage.getItem("starttime_filter");
    // const endtime = localStorage.getItem("endtime_filter");
    // const description= localStorage.getItem("description_filter");
    try {
        const trains = client.db('projectdb').collection('trains');
        console.log(trainID);
        const train = await trains.find({
             trainID: trainID,
            // depart: start,
            // arrive: end,
            // startdate: startdate,
            // enddate: enddate,
            // starttime,starttime,
            // endtime: endtime,
            // decription: decription
        }).toArray();
        return train;
    } catch (error) {
        console.error('Unable to fetch from database!');
        return null;
    }
}

async function addTemporaryPassenger(seatID, passengerName, passengerID, passengerContact, buyerName, buyerRole){
    try {
        const passengers = client.db('projectdb').collection('temporaryPassenger');

        const result = await passengers.updateOne(
            { seatID },
            { $set: { seatID, passengerName, passengerID, passengerContact, buyerName, buyerRole} },
            { upsert: true }
        );
    
        if (result.upsertedCount === 0) {
            console.log('Added 0 Temporary Passenger');
        } else {
            console.log('Added 1 Temporary Passenger');
        }
  
        return true;
    } catch (error) {
        console.error('Unable to update the Temporary Passenger!');
        return false;
    }
}

async function fetchTemporaryPassenger(seatID){
    try {
        const passengers = client.db('projectdb').collection('temporaryPassenger');
        const passenger = await passengers.findOne({seatID});
        return passenger;
    } catch (error) {
        console.error('Unable to fetch from database!');
        return null;
    }
}

async function update_payment(payerName, cardNumber, trainID, total_price, selectedSeats, selectedClass, buyerName) {
    try {
        const transactions = client.db('projectdb').collection('transactions');
        // console.log("buyerName",buyerName);
        // console.log(user);
        // console.log("total_price",total_price);
        // const paymentData = {
        //     payerName: payerName,
        //     cardNumber: cardNumber,
        //     trainID: trainID,
        //     total_price: total_price,
        //     selectedSeats: selectedSeats,
        //     selectedClass: selectedClass,
        //     dateAndTime: Date()
        // };
        // console.log(paymentData);
        const result  = await transactions.insertOne({
            buyerName: buyerName,
            payerName: payerName,
            cardNumber: cardNumber,
            trainID: trainID,
            total_price: total_price,
            selectedSeats: selectedSeats,
            selectedClass: selectedClass,
            dateAndTime: Date()
        }
        );
        // console.log("result",result);
        // return result;
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

// async function get_bookedSeats(trainID){
//     try {
//         const seats = client.db('projectdb').collection('seats');
//         console.log(seats.toArray());
//         const bookedSeat = await seats.findOne({ trainID });
//         console.log(bookedSeat);
//         return bookedSeat;
//     } catch (error) {
//         console.error('Unable to update the database!');
//         return false;
//     }
// }

async function get_bookedSeats(trainID){
    try {
        const seats = client.db('projectdb').collection('seats');
        if (await seats.findOne({trainID})){
            const bookedSeat = await seats.findOne({trainID});
            // console.log(bookedSeat);
        // console.log(bookedSeat);
            return bookedSeat;
        } else {
            const bookedSeats = JSON.stringify([]);
            const bookedSeat = await seats.updateOne(
                { trainID },
                { $set: { bookedSeats: bookedSeats} },
                { upsert: true}
            );
            return bookedSeat;
        }
    } catch (error) {
        console.error('Unable to fetch from database!');
        return null;
    }
}

async function update_seat(trainID, seatID, passengerName, passengerID, passengerContact, buyer, seatClass){
    try{
        const seats = client.db('projectdb').collection('seats');
        const bookedSeat = await seats.findOne({trainID});
        // console.log(bookedSeat);
        // console.log(seatID);
        var bookedSeats = bookedSeat.bookedSeats;
        // console.log(bookedSeats);
        bookedSeats = JSON.parse(bookedSeats)
        bookedSeats.push(seatID);
        // console.log(bookedSeats);
        bookedSeats = JSON.stringify(bookedSeats);
        // console.log(bookedSeats);
        const result = await seats.updateOne(
            { trainID: trainID },
            {
                $set: {
                    bookedSeats: bookedSeats,
                    [seatID]: {
                        passengerName: passengerName,
                        passengerID: passengerID,
                        passengerContact: passengerContact,
                        buyer: buyer,
                        seatClass: seatClass,
                    },
                },
            },
            { upsert: true }
        );
        
        if (result.upsertedCount === 0) {
            console.log('Added 0 seat information');
        } else {
            console.log('Added 1 seat information');
        }
        return true;

    } catch (error) {
        console.error('Unable to fetch from database!');
        return null;
    }
}

async function allSeats(trainID) {
    try {
        const seats = client.db('projectdb').collection('seats');
        const allSeats = await seats.find({}).toArray();
        // console.log();
        return allSeats;
    } catch (error) {
        console.error('Unable to fetch from database!');
        return null;
    }
}

export  {
    update_train,
    get_train,
    allTrain,
    addTemporaryPassenger,
    fetchTemporaryPassenger,
    update_payment,
    get_bookedSeats,
    update_seat,
    delete_train,
    allSeats,
    getTrain
};


// get_train("G123").then((res)=> console.log(res));
// allTrain().then((res) => console.log(res));
// addTemporaryPassenger('seatID', 'passengerName', 'passengerID', 'passengerContact', 'buyerName', 'buyerRole');
// fetchTemporaryPassenger("8A").then((res)=> console.log(res));
// allTrain().then((res)=> console.log(res));
// get_bookedSeats("G123").then((res)=>console.log(res));
// update_seat("G123", "7B", "Qiu Liming","A123487(3)","43124321","valenqiu","user","economy").then((res)=>console.log(res));
// init_seatdb("G123", "3A", )
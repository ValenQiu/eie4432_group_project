import express from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import bodyParser from 'body-parser';
import {
    update_train,
    get_train,
    addTemporaryPassenger,
    allTrain,
    fetchTemporaryPassenger,
    update_payment,
    get_bookedSeats,
    update_seat,
    delete_train,
    getTrain,
    allSeats
  } from './traindb.js';
import { existsSync } from 'fs';

const users = new Map();
const route = express.Router();
const form = multer();


route.use(bodyParser.urlencoded({ extended: false }));
route.use(bodyParser.json());

// route.post('/dashboard', form.none(), async (req, res) => {

// });

// route.post('/train_update', async (req, res) => {
//   const trainID = req.body.trainID;
//   const start = req.body.start;
//   const end = req.body.end;
//   const startdate= req.body.startdate;
//   const enddate = req.body.enddate;
//   const starttime = req.body.starttime;
//   const endtime = req.body.endtime;
//   const time = req.body.time;
//   const price = req.body.price;
//   const description = req.body.description;
//   res.json({
//     status: 'success',
//     train: {
//       trainID: trainID,
//       start: start,
//       end: end,
//       startdate: startdate,
//       enddate: enddate,
//       starttime: starttime,
//       endtime: endtime,
//       time: time,
//       price: price,
//       description: description
//     },
//   });
// })

route.post('/train_upload',form.none(), async(req, res) => {


  const trainInput = req.body.train;
  const startInput = req.body.start;
  const endInput = req.body.end;
  const startdateInput = req.body.startdate;
  const enddateInput = req.body.enddate;
  const starttimeInput = req.body.starttime;
  const endtimeInput = req.body.endtime;
  const timeInput = req.body.time;
  const priceInput = req.body.price;
  const descriptionInput = req.body.description;

  // const traingetSuccess = await get_train();
  // console.log(traingetSuccess);
  
  const trainuploadSuccess = await update_train(trainInput, startInput, endInput, startdateInput, enddateInput, starttimeInput, endtimeInput, timeInput, priceInput,descriptionInput);
  if (trainuploadSuccess){
      res.json({
          status: 'success',
      });
      // console.log(res.status());
  } else {
      res.status(500).json({
          status: 'failed',
          message: 'Travel uploaded but unable to save into the database',
      })
  }

})

route.post('/train_delete',form.none(), async(req, res) => {


  const trainInput = req.body.train;

  // const traingetSuccess = await get_train();
  // console.log(traingetSuccess);
  
  const trainuploadSuccess = await delete_train(trainInput);
  if (trainuploadSuccess){
      res.json({
          status: 'success',
      });
      // console.log(res.status());
  } else {
      res.status(500).json({
          status: 'failed',
          message: 'Travel uploaded but unable to save into the database',
      })
  }

})

route.get('/dashboard',form.none(), async(req, res) => {
  //const trainID = localStorage.getItem("trainID_filter");
  // const start = localStorage.getItem("start_filter");
  // const end= localStorage.getItem("end_filter");
  // const startdate = localStorage.getItem("startdate_filter");
  // const enddate = localStorage.getItem("enddate_filter");
  // const starttime = localStorage.getItem("starttime_filter");
  // const endtime = localStorage.getItem("endtime_filter");
  // const description= localStorage.getItem("description_filter");
  const traingetSuccess = await allTrain();
  //const traingetSuccess = await allTrain();
  //const allticket = JSON.stringify(traingetSuccess);
  res.json(traingetSuccess);
})



route.post('/eventDetails',form.none(), async(req, res) => {
  // Get the values from req.body
  const total_price = req.body.total_price;
  // console.log("total_price", total_price);
  const train_id = req.body.train_id;
  const seat_selected = req.body.seat_selected;
  // console.log("train_id", train_id);

  req.session.total_price = total_price;
  req.session.train_id = train_id;
  req.session.seat_selected = seat_selected;

  // console.log(req.session.train_id);
  const train = await get_train(req.session.train_id);
  // console.log("train",train);

  if (train){
    res.json({
        status: 'success',
        train: {
          trainID: train.trainID,
          arrive: train.arrive,
          depart: train.depart,
          enddate: train.enddate,
          endtime: train.endtime,
          price: train.price,
          startdate: train.startdate,
          starttime: train.starttime,
          time: train.time
        },
    });
    // console.log(res.status());
    } else {
        console.log("cannot find.")
    }
})

route.post('/postTemporaryPassengers', form.none(), async(req, res) => {
    // req.session.seatID = 
  const seatID = req.body.seatID;
  // console.log(req.session.seatID);
  const passengerName = req.body.passengerName;
  const passengerID = req.body.passengerID;
  const passengerContact = req.body.passengerContact;
  const buyerName = req.body.buyerName;
  const buyerRole = req.body.buyerRole;
  // console.log(req.body.seatID);

  const addTemporaryPassengerSuccess = await addTemporaryPassenger(seatID, passengerName, passengerID, passengerContact, buyerName, buyerRole);

  if (addTemporaryPassengerSuccess){
    req.session.seatID = addTemporaryPassengerSuccess.seatID;
    req.session.passengerName = addTemporaryPassengerSuccess.passengerName;
    req.session.passengerContact = addTemporaryPassengerSuccess.passengerContact;
    req.session.passagerID = addTemporaryPassengerSuccess.passengerID;
    req.session.buyerName = addTemporaryPassengerSuccess.buyerName;
    req.session.buyerRole = addTemporaryPassengerSuccess.buyerRole;
    res.json({
        status: 'success',
        temporaryPassenger: {
          seatID: addTemporaryPassengerSuccess.seatID,
          passengerName: addTemporaryPassengerSuccess.passengerName,
          passengerID: addTemporaryPassengerSuccess.passagerID,
          passengerContact: addTemporaryPassengerSuccess.passengerContact,
          buyerName: addTemporaryPassengerSuccess.buyerName,
          buyerRole: addTemporaryPassengerSuccess.buyerRole
        }
    });
    // console.log(res.status());
} else {
    res.status(500).json({
        status: 'failed',
        message: 'Temporary passenger uploaded but unable to save into the database',
    })
}
})

route.post('/payment',form.none(), async(req, res) => {
  // if (users.size == 0){
  //     await init_userdb();
  // }
  const payerName = req.body.payerName;
  const cardNumber = req.body.cardNumber;
  const vaildMonth = req.body.vaildMonth;
  const vaildYear = req.body.vaildYear;
  const cvv = req.body.cvv;
  const trainID = req.body.trainID;
  const total_price = req.body.total_price;
  const selectedSeats = req.body.selectedSeats;
  const selectedClass = req.body.selectedClass;
  const buyerName =req.body.buyerName;
  // console.log("buyerName",buyerName);
  // console.log(totalPrice);
  
  if (!payerName){
    res.status(400).json({
      status: 'failled',
      message: 'Name on the Card Cannot be Empty!',
    });
    return;
  } else if (!cardNumber){
    res.status(400).json({
      status: 'failled',
      message: 'Card Number Cannot be Empty!',
    });
    return;
  } else if (cardNumber.length<16){
    res.status(400).json({
      status: 'failled',
      message: 'Wrong Card Number!',
    });
    return;
  } else if (!vaildMonth){
    res.status(400).json({
      status: 'failled',
      message: 'Vaild Month Cannot be Empty!',
    });
    return;
  } else if (vaildMonth.length !== 2){
    res.status(400).json({
      status: 'failled',
      message: 'Please Input 2 Digits Vaild Month!',
    });
    return;
  } else if (!vaildYear){
    res.status(400).json({
      status: 'failled',
      message: 'Vaild Year Cannot be Empty!',
    });
    return; 
  } else if (vaildYear.length !== 2){
    res.status(400).json({
      status: 'failled',
      message: 'Please Input 2 Digits Vaild Year!',
    });
    return;
  } else if (!cvv){
    res.status(400).json({
      status: 'failled',
      message: 'Card Verification Value Cannot Be Empty!',
    });
    return;
  } else if (cvv.length !== 3){
    res.status(400).json({
      status: 'failled',
      message: 'Card Verification Value Must Be 3 Digits!',
    });
    return;
  };

  const paymentSuccess = await update_payment(payerName, cardNumber, trainID, total_price, selectedSeats, selectedClass, buyerName);

  if (paymentSuccess){
      res.json({
          status: 'success',
          payment: {
            payerName: payerName,
            cardNumber: cardNumber,
            trainID: trainID,
            total_price: total_price,
            selectedSeats: selectedSeats,
            selectedClass: selectedClass,
            buyerName: buyerName
          },
      });
      console.log("res",res.status());
    } else {
      res.status(500).json({
          status: 'failed',
          message: 'Account created but unable to save into the database',
      })
  }

})

route.post('/selectSeat',form.none(), async(req, res) => {
    const trainID = req.body.trainID;
    const price = req.body.price;
    // console.log(trainID);
    const train = await get_bookedSeats(trainID);
    if (train) {
      // console.log(train.bookedSeats);
      res.json({
        status: 'success',
        seats: {
          trainID: train.trainID,
          bookedSeats: train.bookedSeats
        } 
    });
  } else {
    res.status(500).json({
        status: 'failed',
        message: 'Account created but unable to save into the database',
    });
  }
})

route.post('/bookSeat',form.none(), async(req, res) => {
  const trainID = req.body.trainID;
  const seatID = req.body.seatID;
  const passengerName = req.body.passengerName;
  const passengerID = req.body.passengerID;
  const passengerContact = req.body.passengerContact;
  const buyer = req.body.buyer;
  const seatClass = req.body.seatClass;
  // console.log(seat_information);
  const seatUpdateSuccess = await update_seat(trainID, seatID, passengerName, passengerID, passengerContact, buyer, seatClass);
  if (seatUpdateSuccess){
    res.json({
        status: 'success',
    });
    // console.log("res",res.status());
  } else {
    res.status(500).json({
        status: 'failed',
        message: 'Account created but unable to save into the database',
    })
}

});

route.post('/viewPassengers',form.none(), async(req, res) => {
  const trainID = req.body.trainID
  const getSeatsSuccess = await allSeats(trainID);
  res.json(getSeatsSuccess);
})


// route.get('/getTemporaryPassengers', async(req, res) => {
//   const temporaryPassenger = await fetchTemporaryPassenger(req.session.seatID);
//   if (temporaryPassenger) {
//     res.json({
//       status: 'success',
//       temporaryPassenger: {
//         passengerName: temporaryPassenger.passengerName,
//         passengerID: temporaryPassenger.passengerID,
//         passengerContact: temporaryPassenger.passengerContact,
//         buyerName: temporaryPassenger.buyerName,
//         buyerRole: temporaryPassenger.buyerRole
//       }
//     });
//   } else {
//     res.status(401).json({
//       status: 'failed',
//       message: 'Unauthorized',
//     });
//   }
  
// })

export default route;
import express from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import bodyParser from 'body-parser';
import {
    update_train,
    get_train,
    addTemporaryPassenger,
    allTrain,
    fetchTemporaryPassenger
  } from './traindb.js';
import { existsSync } from 'fs';

const users = new Map();
const route = express.Router();
const form = multer();


route.use(bodyParser.urlencoded({ extended: false }));
route.use(bodyParser.json());

route.post('/dashboard', form.none(), async (req, res) => {

});


route.post('/train_upload',form.none(), async(req, res) => {

  const _id = req.body._id
  const trainInput = req.body.train;
  const startInput = req.body.start;
  const endInput = req.body.end;
  const startdateInput = req.body.startdate;
  const enddateInput = req.body.enddate;
  const starttimeInput = req.body.starttime;
  const endtimeInput = req.body.endtime;
  const timeInput = req.body.time;
  const priceInput = req.body.price;

  // const traingetSuccess = await get_train();
  // console.log(traingetSuccess);
  
  const trainuploadSuccess = await update_train(trainInput, startInput, endInput, startdateInput, enddateInput, starttimeInput, endtimeInput, timeInput, priceInput);
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
  const traingetSuccess = await allTrain();
  //const allticket = JSON.stringify(traingetSuccess);
  res.json(traingetSuccess);
})

route.post('/payment', async(req, res) => {
  const total_price =req.body.total_price;
  console.log(total_price);
  // const getTrin = await get_train(req.session.trainID);
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
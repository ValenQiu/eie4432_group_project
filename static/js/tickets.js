$(document).ready(function () { 
    const train_information = JSON.parse(localStorage.getItem('train_information'));
    const buyerName = JSON.parse(localStorage.getItem('buyerName'));
    // console.log(train_information);
    const total_price = train_information.total_price;
    const trainID = train_information.trainID;
    const selectedSeats = train_information.selectedSeats;
    const selectedClass = train_information.selectedClass;
    const price = train_information.price;
    const passengerNumber = selectedSeats.length;

    const formData = new FormData();
    formData.append("train_id", trainID);
    formData.append("total_price", total_price);
    formData.append("seat_selected", selectedSeats);
    console.log(formData);

    $.ajax({
        url: '/event/eventDetails',
        method: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (data) {
            // alert(data);            // Check the status of the response
            if (data.status === 'success') {
                // success
                // console.log("data.train", data.train);
                const depart = data.train.depart;
                const arrive = data.train.arrive;
                const startdate = data.train.startdate;
                const starttime = data.train.starttime;
                const enddate = data.train.enddate;
                const endtime = data.train.endtime;
                const time = data.train.time;
                var train = {
                    depart: depart,
                    arrive: arrive,
                    startdate:startdate,
                    starttime: starttime,
                    enddate: enddate,
                    endtime: endtime,
                    time: time
                };
                localStorage.setItem("train", JSON.stringify(train));
            }
        }
    });

    const train = JSON.parse(localStorage.getItem("train"));
    // console.log(train);
    for (var i=0; i<passengerNumber;i++){
        const seat_information = JSON.parse(localStorage.getItem(selectedSeats[i]));
        console.log(seat_information);
        const passengerName = seat_information[0];
        const seatID = selectedSeats[i];

        localStorage.removeItem(selectedSeats[i]);

        var ticket = 
        `
        <div class="card bg-dark text-white my-2 col" stype="width: 350px;">
                <form class="m-3" method="POST" action="/event/eventDetails">
                    <div class="auth-form-header text-lg-start p-3">
                        <h2>Ticket</h1>
                    </div>
                    <div class="mx-3 row-4">
                        <label class="px-1 col fw-bold">Price</label>
                        <input class="col text-start bg-dark text-white" id="price" name="price" value="${price} HKD" readonly />
                        <label class="px-1 col fw-bold">Passenger Name: </label>
                        <input class="col text-start bg-dark text-white" id="passenger_name" name="passenger_name" value="${passengerName}" readonly />
                    </div>
                    <div class="mx-3 row">
                        <label class="px-1 col fw-bold">Train ID</label>
                        <input class="col text-start bg-dark text-white" id="train_id" name="train_id" value="${trainID}" readonly />
                    </div>
                    <div class="mx-3 row">
                        <label class="px-1 col fw-bold">Seat Selected</label>
                        <div id="seat_selected" class="col px-1">${seatID}</div>
                    </div>
                    <div class="mx-2 py-3 row" id="eventDetails">
                        <h4>Details</h4>
                        <div>
                            <div class="mx-3 row">
                                <label class="px-1 col fw-bold">Depart</label>
                                <input class="col text-start bg-dark text-white", value="${train.depart}" readonly/>
                                <label class="px-1 col fw-bold">Arrive</label>
                                <input class="col text-start bg-dark text-white", value="${train.arrive}" readonly/>
                            </div>
                            <div class="mx-2 row">
                                <label class="px-1 col fw-bold">Start Date</label>
                                <input class="col text-start bg-dark text-white", value="${train.startdate}" readonly/>
                                <label class="px-1 col fw-bold">Start Time</label>
                                <input class="col text-start bg-dark text-white", value="${train.starttime}" readonly/>
                            </div>
                            <div class="mx-3 row">
                                <label class="px-1 col fw-bold">End Date</label>
                                <input class="col text-start bg-dark text-white", value="${train.enddate}" readonly/>
                                <label class="px-1 col fw-bold">End Time</label>
                                <input class="col text-start bg-dark text-white", value="${train.endtime}" readonly/>
                            </div>
                            <div class="mx-3 row">
                                <label class="px-1 col fw-bold">Time</label>
                                <input class="col text-start bg-dark text-white", value="${train.time}" readonly/>
                            </div>
                        </div>
                    </div>
                </form> 
            </div> 
        `;
        $("#tickets").append(ticket);
    }
    
});
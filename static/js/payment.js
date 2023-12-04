$(document).ready(function () { 
    const train_information = JSON.parse(localStorage.getItem('train_information'));
    // console.log(train_information);
    const buyerName = JSON.parse(localStorage.getItem('buyerName'));
    // console.log(train_information);
    const total_price = train_information.total_price;
    const trainID = train_information.trainID;
    const selectedSeats = train_information.selectedSeats;
    const selectedClass = train_information.selectedClass;

    // console.log(selectedClass );
    $("#total_price").val(total_price + "HKD");
    $("#train_id").text(trainID).val(trainID);

    const seatNumber = selectedSeats.length;
    // console.log(seatNumber);

    var seat_text = {};
    seat_text.seat = [];

    // Loop through the selectedSeats and selectedClass arrays
    for (var i = 0; i < seatNumber; i++) {
        // Concatenate the seat number and class with parentheses and assign it to the seat property
        seat_text.seat[i] = selectedSeats[i] + "(" + selectedClass[i] + ")";
        var seatElement = 
        `
        <input class="row text-start bg-dark text-white " value="${seat_text.seat[i]}" readonly />
        `
        $("#seat_selected").append(seatElement);
    }
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
                var eventDetails = 
                `
                <div>
                    <div class="mx-3 row">
                        <label class="px-1 col fw-bold">Depart</label>
                        <input class="col text-start bg-dark text-white", value="${data.train.depart}" readonly/>
                        <label class="px-1 col fw-bold">Arrive</label>
                        <input class="col text-start bg-dark text-white", value="${data.train.arrive}" readonly/>
                    </div>
                    <div class="mx-2 row">
                        <label class="px-1 col fw-bold">Start Date</label>
                        <input class="col text-start bg-dark text-white", value="${data.train.startdate}" readonly/>
                        <label class="px-1 col fw-bold">Start Time</label>
                        <input class="col text-start bg-dark text-white", value="${data.train.starttime}" readonly/>
                    </div>
                    <div class="mx-3 row">
                        <label class="px-1 col fw-bold">End Date</label>
                        <input class="col text-start bg-dark text-white", value="${data.train.enddate}" readonly/>
                        <label class="px-1 col fw-bold">End Time</label>
                        <input class="col text-start bg-dark text-white", value="${data.train.endtime}" readonly/>
                    </div>
                    <div class="mx-3 row">
                        <label class="px-1 col fw-bold">Time</label>
                        <input class="col text-start bg-dark text-white", value="${data.train.time}" readonly/>
                    </div>
                </div>
                `
                $("#eventDetails").append(eventDetails);
            } else {
                // Registration failed
                alert(data.message);
            }
        }, error: function (xhr) {
            if (xhr.status === 400) {
              const errorMessage = xhr.responseJSON.message;
              alert(errorMessage);
            } else if (xhr.status === 500) {
                const errorMessage = xhr.responseJSON.message;
                alert(errorMessage);
            } else {
              alert('Unknown error');
            }
          },
    });

    $("#payButton").click(function(){
        const payerName = $("#name_on_card").val();
        // console.log(payerName);
        const cardNumber = $("#card_number").val();
        // console.log(cardNumber);
        const vaildMonth = $("#vaild_month").val();
        // console.log(vaildMonth);
        const vaildYear = $("#vaild_year").val();
        // console.log(vaildYear);
        const cvv = $("#cvv").val();
        console.log("cvv",cvv);
        console.log("buyerName", buyerName);

        if (!payerName){
            alert("Name on the Card Cannot be Empty!");
            return;
        } else if (!cardNumber){
            alert("Card Number Cannot be Empty");
            return;
        } else if (cardNumber.length<16){
            alert("Wrong Card Number!");
            return;
        } else if (!vaildMonth){
            alert("Vaild Month Cannot be Empty!");
            return;
        } else if (vaildMonth.length !== 2){
            alert("Please Input 2 Digits Vaild Month!");
            return;
        } else if (!vaildYear){
            alert("Vaild Year Cannot be Empty!");
            return; 
        } else if (vaildYear.length !== 2){
            alert("Please Input 2 Digits Vaild Year!");
            return;
        } else if (!cvv){
            alert("Card Verification Value Cannot Be Empty!");
            return;
        } else if (cvv.length !== 3){
            alert("Card Verification Value Must Be 3 Digits!")
            return;
        }

        const formData = new FormData();
        formData.append('payerName', payerName);
        formData.append('cardNumber', cardNumber);
        formData.append('vaildMonth', vaildMonth);
        formData.append('vaildYear', vaildYear);
        formData.append("cvv", cvv);
        formData.append('trainID', trainID);
        formData.append('total_price', total_price);
        formData.append('selectedSeats', selectedSeats);
        formData.append('selectedClass', selectedClass);
        formData.append("buyerName", buyerName);
        // console.log(formData);

        $.ajax({
            url: '/event/payment',
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (data) {
                // alert(data);            // Check the status of the response
                if (data.status === 'success') {
                // Registration succeeded
                    alert(`Payment Success! You have paid ${total_price} HKD, for the train ${trainID}. Thank you, ${buyerName}! Save trip!`);
                    // var bookedSeats = JSON.parse(localStorage.getItem("bookedSeats"));
                    // bookedSeats.push(data.selectedSeats);
                    // localStorage.setItem("bookedSeats", bookedSeats);
                    window.open('/tickets.html', '_self');
                } else {
                    // Registration failed
                    alert(data.message);
                }
            }, error: function (xhr) {
                if (xhr.status === 400) {
                  const errorMessage = xhr.responseJSON.message;
                  alert(errorMessage);
                } else if (xhr.status === 500) {
                    const errorMessage = xhr.responseJSON.message;
                    alert(errorMessage);
                } else {
                  alert('Unknown error');
                }
              },
        });
        console.log(selectedSeats);
        const l = selectedSeats.length;
        for (var i = 0; i<selectedSeats.length;i++){
            var seat_information =JSON.parse(localStorage.getItem(selectedSeats[i]));
            console.log(seat_information[0]);
            const passnegerName = seat_information[0];
            const passengerID = seat_information[1];
            const passengerContact = seat_information[2];
            const buyer = seat_information[3];
            const seatClass = seat_information[5];
            var seatID = selectedSeats[i];

            // localStorage.removeItem(selectedSeats[i]);
            // console.log(seatID);
            // console.log(seat_information);
            // console.log(trainID);
            const formData = new FormData();
            formData.append('trainID', trainID);
            formData.append("seatID", seatID);
            formData.append("seat_information", seat_information);
            formData.append("passengerName", passnegerName);
            formData.append("passengerID", passengerID);
            formData.append("passengerContact",passengerContact);
            formData.append("buyer",buyer);
            formData.append("seatClass", seatClass);
            
            $.ajax({
                url: '/event/bookSeat',
                method: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function (data) {
                    // alert(data);            // Check the status of the response
                    if (data.status === 'success') {
                        console.log(data.status);
                    } else {
                        // Registration failed
                        alert(data.message);
                    }
                }, error: function (xhr) {
                    if (xhr.status === 400) {
                      const errorMessage = xhr.responseJSON.message;
                      alert(errorMessage);
                    } else if (xhr.status === 500) {
                        const errorMessage = xhr.responseJSON.message;
                        alert(errorMessage);
                    } else {
                      alert('Unknown error');
                    }
                  },
            });
        }

    })


    
 })


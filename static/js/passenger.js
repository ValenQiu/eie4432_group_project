
$(document).ready(function(){

    // var train_information =  JSON.parse(localStorage.getItem('train_information'));
    var train_information =  JSON.parse(localStorage.getItem('train_information'));
    var selectedSeats = train_information.selectedSeats;
    console.log(selectedSeats);

    // When updating the passenger information, we will also record the buyer information,
    // Such that in the following functions, the admin will be able to check who pay for the ticket
    // However, the system allows visiters to input passenger information even when they are not log in
    // thus, in the following step, we will check whether the visiter has log in or not
    // if not, the visiter will be redirected to the login page
    $.ajax({
        url: '/auth/me',
        method: 'GET',
        success: function (data) {
          // API call successful
          const username = data.user.username;
          const role = data.user.role;
          localStorage.setItem("buyerName", JSON.stringify(username));
          localStorage.setItem("buyerRole", JSON.stringify(role));
        },
        error: function () {
          // API call failed
          alert('Please login');
          window.open('/login.html', '_self');
        },
      });

    if (localStorage.getItem('selectedSeats')){
        selectedSeats = JSON.parse(localStorage.getItem('selectedSeats'));
        console.log(selectedSeats);
    };
    // console.log(selectedSeats);

    var update_flag = false;

    selectedSeats.forEach((seatID) => {
        const $seat = $('#'+seatID);
        if ($seat) {
            $seat.addClass("selected").removeClass("unavailable");
        };

        ($seat).click(function(){
            $("#seatID_text").text(seatID);
            $("#passengerName").val('');
            $("#passengerID").val('');
            $("#passengerContact").val('');

            if (localStorage.getItem(`${seatID}`)){
                const temporaryPassenger = JSON.parse(localStorage.getItem(`${seatID}`));
                const passengerName = temporaryPassenger[0];
                const passengerID = temporaryPassenger[1];
                const passengerContact = temporaryPassenger[2];
                const buyerName = temporaryPassenger[3];
                const buyerRole = temporaryPassenger[4];
                const seatClass = temporaryPassenger[5];
                alert(`You can update the passenger ${passengerName}'s information`); 
                update_flag = true; 
                $("#passengerName").val(passengerName);
                $("#passengerID").val(passengerID);
                $("#passengerContact").val(passengerContact);
            };

            if (update_flag){
                $("#addPassenger").text("Update Passenger");
            };
            // $.ajax({
            //     url: '/event/getTemporaryPassengers',
            //     method: 'GET',
            //     success: function (data) {
            //         const passengerName = data.user.passengerName;
            //         const passengerID = data.user.passengerID;
            //         const passengerContact = data.user.passengerContact;
            //         // Check the status of the response
            //         if (data.status === 'success') {
            //             alert(`You can update the passenger ${passengerName}'s information`);  
            //             $("#passengerName").val(passengerName);
            //             $("#passengerID").val(passengerID);
            //             $("#passengerContact").val(passengerContact);
            //         };
            //     }, error: function (xhr) {
            //         if (xhr.status === 400) {
            //         const errorMessage = xhr.responseJSON.message;
            //         alert(errorMessage);
            //         } else if (xhr.status === 500) {
            //             const errorMessage = xhr.responseJSON.message;
            //             alert(errorMessage);
            //         } else {
            //         alert('Unknown error');
            //         }
            //     },
            // });
        })
    });

    $("#addPassenger").click(function(){

        // const Seats = localStorage.getItem('selectedSeats');
        // const selectedSeats = JSON.parse(Seats);
        const passengerNumber = selectedSeats.length;
        console.log(passengerNumber);
        
        const buyerName = JSON.parse(localStorage.getItem("buyerName"));
        const buyerRole = JSON.parse(localStorage.getItem("buyerRole"));
        const seatID = $("#seatID_text").text();
        const passengerName = $("#passengerName").val();
        const passengerID = $("#passengerID").val();
        const passengerContact = $("#passengerContact").val();
        const seatClass = $('#'+seatID).attr('name');

        if (!passengerName){
            alert("Passenger Name cannot be empty!");
            return;
        } else if (!passengerID){
            alert("Passenger ID cannot be empty!");
            return;
        } else if (!passengerContact){
            alert("Passenger Contact cannot be empty!");;
            return;
        } else if (seatID === 'Please Select'){
            alert("Please select a seat!");
            return;
        }

        localStorage.setItem(`${seatID}`, JSON.stringify([passengerName, passengerID, passengerContact, buyerName, buyerRole, seatClass]));
        alert("Passenger information saved!");
        $("#seatID_text").text("Please Select");
        $("#passengerName").val("");
        $("#passengerID").val("");
        $("#passengerContact").val("");

        update_flag = false;
        $("#addPassenger").text("Add Passenger");
    })

    $("#comfirmSeats").click(function(){

        // Check whether all selected seats have passenger information
        selectedSeats.forEach((seatID) => {
            if (!localStorage.getItem(`${seatID}`)){
                alert("Please fill in all passenger information!");
                return;
            };
        });

        var seat_information = {};
        // console.log("selectedSeats");
        // console.log(selectedSeats);
        var seats = selectedSeats;
        // console.log("seats");
        // console.log(seats.length);
        for (var i = 0; i < seats.length; i++){
            var seat = seats[i];
            var value = JSON.parse(localStorage.getItem(seat));
            seat_information [seat] = value;
        };
        // console.log(seat_information["7C"]);
        train_information.seat_information = seat_information;
        localStorage.setItem('train_information', JSON.stringify(train_information));

        alert("Passenger Information Comfirm Success! Will Direct to the Payment Page.");
        window.open('/payment.html', '_self');

        // var passengersNumber = selectedSeats.length;
        // console.log(passengersNumber);
        // // Update the data to MongoDB
        // selectedSeats.forEach((seatID) => {
        //     const temporaryPassenger = JSON.parse(localStorage.getItem(`${seatID}`));
        //     const passengerName = temporaryPassenger[0];
        //     const passengerID = temporaryPassenger[1];
        //     const passengerContact = temporaryPassenger[2];
        //     const buyerName = temporaryPassenger[3];
        //     const buyerRole = temporaryPassenger[4];
        //     const formData = new FormData();
        //     formData.append('seatID', seatID);
        //     formData.append('passengerName', passengerName);
        //     formData.append('passengerID', passengerID);
        //     formData.append('passengerContact', passengerContact);
        //     formData.append('buyerName', buyerName);
        //     formData.append('buyerRole',buyerRole);
        //     // console.log(formData);

        //     $.ajax({
        //         url: '/event/postTemporaryPassengers',
        //         method: 'POST',
        //         data: formData,
        //         processData: false,
        //         contentType: false,
        //         success: function (data) {
        //             // alert(`Add Passenger ${passengerName} Success!`);            // Check the status of the response
        //             if (data.status === 'success') {
        //             // Add passenger succeeded
        //             // window.location.href = 'login.html';
        //                 passengersNumber -= 1;
        //                 console.log(passengersNumber);
        //                 if (passengersNumber === 0){
        //                     alert("Passenger Information Comfirm Success! Will Direct to the Payment Page.");
        //                     localStorage.removeItem('selectedSeats');
        //                     localStorage.removeItem('buyerName');
        //                     localStorage.removeItem('buyerRole');
        //                     selectedSeats.forEach((seatID) => {
        //                         localStorage.removeItem(`${seatID}`);
        //                     });
        //                 }
        //             } else {
        //                 // Add passenger failed
        //                 alert(data.message);
        //             }
        //             }, error: function (xhr) {
        //                 if (xhr.status === 400) {
        //                 const errorMessage = xhr.responseJSON.message;
        //                 alert(errorMessage);
        //                 } else if (xhr.status === 500) {
        //                     const errorMessage = xhr.responseJSON.message;
        //                     alert(errorMessage);
        //                 } else {
        //                 alert('Unknown error');
        //                 }
        //             },
        //         });

        // });
    })

})
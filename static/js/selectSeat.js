$(document).ready(function(){
    $.ajax({
        url: '/auth/me',
        method: 'GET',
        success: function (data) {
          // API call successful
          const username = data.user.username;
          const role = data.user.role;
          localStorage.setItem('role', role);
          $('#greeting').text(`Welcome, ${username} (${role})`);
          $("#login_Buttons").addClass("d-none");
          $("#login_state").removeClass("d-none");
          if(role === 'user'){
            $("#showSeats").removeClass("d-none");
            $("#showPrice").removeClass("d-none");
            $('#comfirmSeat').removeClass("d-none");
            $("#reset").removeClass("d-none");
          } else if (role === 'admin'){
            $("#showSeats").addClass("d-none");
            $("#showPrice").addClass("d-none");
            $('#comfirmSeat').addClass("d-none");
            $("#reset").addClass("d-none");
          };
        },
        error: function () {
          // API call failed
          // alert('Please login');
          // window.open('/login.html', '_self');
          $("#login_Buttons").removeClass("d-none");
          $("#profile_Button").addClass("d-none");
        },
      });


    var train_information =  JSON.parse(localStorage.getItem('train_information'));
    // console.log(train_information.trainID);
    const trainID = train_information.trainID;
    const price = train_information.price;
    // console.log(trainID);
    
    console.log(trainID);
    const formData = new FormData();
    formData.append("trainID",trainID);
    formData.append("price",price);
    console.log(formData);

    
    $.ajax({
        url: '/event/selectSeat',
        method: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (data) {
            if (data.status === 'success') {
                // console.log(data);
                const bookedSeats = data.seats.bookedSeats;
                console.log(bookedSeats);
                localStorage.setItem('bookedSeats',bookedSeats);
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

    // const bookedSeats = ["1A", "2A", "5A"];
    // localStorage.setItem("bookedSeats", JSON.stringify(bookedSeats));
    // const bookedSeats = localStorage.getItem('bookedSeats');
    var selectedSeats = [];
    var selectedClass = [];
    
    const bookedSeat =  localStorage.getItem('bookedSeats');
    console.log(bookedSeat);
    const bookedSeats = JSON.parse(bookedSeat);
    console.log(bookedSeats);

    bookedSeats.forEach((seatID) => {
        const $seat = $('#'+seatID);
        if ($seat) {
            $seat.addClass("occupied").removeClass("available");
        }
    });

    $("#bussinessButton").click(function(){
        $(this).removeClass("btn-secondary").addClass("btn-primary");
        $("#economyButton").addClass("btn-secondary").removeClass("btn-primary");
        $("[name='bussiness']").addClass("available").removeClass("unavailable occupied selected");
        $("[name='economy']").addClass("unavailable").removeClass("available occupied selected");
        
        bookedSeats.forEach((seatID) => {
            const $seat = $('#'+seatID);
            console.log($seat);
            if ($seat) {
                if ($seat.attr('name') === 'bussiness') {
                    $seat.addClass("occupied").removeClass("available");
                }  
            }
        });

        selectedSeats.forEach((seatID) => {
            const $seat = $('#'+seatID);
            if ($seat) {
                if ($seat.attr('name') === 'bussiness') {
                    $seat.addClass("selected").removeClass("available");
                }  
            }
        });
    });

    $("#economyButton").click(function(){
        $(this).removeClass("btn-secondary").addClass("btn-primary");
        $("#bussinessButton").addClass("btn-secondary").removeClass("btn-primary");
        $("[name='economy']").addClass("available").removeClass("unavailable occupied selected");
        $("[name='bussiness']").addClass("unavailable").removeClass("available occupied selected");
        
        bookedSeats.forEach((seatID) => {
            const $seat = $('#'+seatID);
            if ($seat) {
                if ($seat.attr('name') === 'economy') {
                    $seat.addClass("occupied").removeClass("available");
                }  
            }
        });
        selectedSeats.forEach((seatID) => {
            const $seat = $('#'+seatID);
            if ($seat) {
                if ($seat.attr('name') === 'economy') {
                    $seat.addClass("selected").removeClass("available");
                }  
            }
        });
    });

    var total_price = 0;
    const role = localStorage.getItem('role');


    $.ajax({
        url: '/event/viewPassengers',
        method: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (data) {
            console.log(data);
            localStorage.setItem("allSeats", JSON.stringify(data));
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

    var allSeats = localStorage.getItem('allSeats');
    allSeats = JSON.parse(allSeats);
    console.log(allSeats);

    $("[name='economy'], [name='bussiness']").click(function(){
        if (role === 'user') {
            const seatID = $(this).attr('value');
            const seatClass = $(this).attr('name');
            if (bookedSeats.includes(seatID)){
                alert("This seat is not available for booking.");
            } else if (selectedSeats.includes('7B')){
                alert("You have already selected this seat.");
            } else {
                selectedSeats.push(seatID);
                $(this).addClass("selected").removeClass('available');
                selectedClass.push(seatClass);
                console.log(selectedSeats);
                console.log(selectedClass);

                // Update the selected seat
                $("#selectedSeats_text").text(selectedSeats);

                // Calculate the ticket price, where the bussicness will be 40% more expensive than economy class
                var price = 0;
                const ticket_price = JSON.parse(train_information.price);
                selectedClass.forEach((seatClass) => {
                    if (seatClass === 'economy'){
                        price += ticket_price;
                    } else if (seatClass === 'bussiness'){
                        price += ticket_price * 1.4;
                    };
                    $("#price").text(price);
                    total_price = price;    // Update the total price
                    })
                }
            } else if (role === 'admin'){
                $(".occupied").css("cursor", "pointer");
                // alert('admin mode');
                const seatID = $(this).attr('value');
                const seatClass = $(this).attr('name');
                if (bookedSeats.includes(seatID)){
                    const passengerData = allSeats[0][seatID];
                    const passengerName = passengerData.passengerName;
                    const passengerID = passengerData.passengerID;
                    const passengerContact = passengerData.passengerContact;
                    const buyer = passengerData.buyer;
                    const seatClass = passengerData.seatClass;
                    var ticket_price = train_information.price;
                    if (seatClass === 'bussiness'){
                        ticket_price = ticket_price * 1.4;
                    };
                    alert(`
                    Seat No.: ${seatID}.
                    Passenger Name: ${passengerName},
                    Passenger ID: ${passengerID},
                    passenger Contact: ${passengerContact}.
                    The buyer of this ticket is user ${buyer}.
                    ${seatClass} Class, the price is ${ticket_price} HKD.`);
                }

            }
    })

    $("#reset").click(function(){
        // console.log("testing");
        selectedSeats.forEach((seatID) => {
            const $seat = $('#'+seatID);
            if ($seat) {
                if ($seat.attr('name') === 'economy') {
                    $seat.addClass("available").removeClass("selected");
                }  
            }
        });
        selectedSeats = [];
        selectedClass = [];
        total_price = 0;
        $("#selectedSeats_text").text('');
        $("#price").text(total_price);
        // console.log(selectedSeat);
    })

    $("#comfirmSeat").click(function(){
        if (selectedSeats.length !== 0){
            train_information.selectedSeats = selectedSeats;
            train_information.selectedClass = selectedClass;
            train_information.total_price = total_price;
            localStorage.setItem("train_information", JSON.stringify(train_information));
            // localStorage.removeItem('bookedSeats');
            window.location.href='passenger.html';
        } else {
            alert("Please select at least one seat!");
            return;
        }
        
    })
})



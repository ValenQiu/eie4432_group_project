$(document).ready(function(){
    $.ajax({
        url: '/auth/me',
        method: 'GET',
        success: function (data) {
          // API call successful
          const username = data.user.username;
          const role = data.user.role;
          $('#greeting').text(`Welcome, ${username} (${role})`);
          $("#login_Buttons").addClass("d-none");
          $("#login_state").removeClass("d-none");
          if(role === 'user'){
            $("#profile_Button").removeClass("d-none");
            $("#admin_Button").addClass("d-none");
            $('#userManagement').addClass("d-none");
            $("#transaction").addClass("d-none");
          } else if (role === 'admin'){
            $("#profile_Button").addClass("d-none");
            $("#admin_Button").removeClass("d-none");
            $('#userManagement').removeClass("d-none");
            $("#transaction").removeClass("d-none");
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

    $.ajax({
        url: '/auth/transaction',
        method: 'GET',
        success: function(data){
            data.forEach(function(transaction){
                var transactionComponents = 
                `
                <div class="row mx-3 border border-info rounded ">
                        <p class="w-auto">Username: ${transaction.buyerName}</p>
                        <p class="w-auto">CardNumber: ${transaction.cardNumber}</p>
                        <p class="w-auto">Train ID: ${transaction.trainID}</p>
                        <p class="w-auto">Price: ${transaction.total_price}</p>
                        <p class="w-auto">SelectedSeat: ${transaction.selectedSeats}</p>
                        <p class="w-auto">SelectedClass: ${transaction.selectedClass}</p>
                        <p class="w-auto">Date & Time: ${transaction.dateAndTime}</p>
                </div>
                `;
                $("#transactionHistory").append(transactionComponents);
            });
        }, error: function () {
            // API call failed
            // alert('Please login');
            // window.open('/login.html', '_self');
            console.log("fail");
          },
    });
})
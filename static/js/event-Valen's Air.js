$(document).ready(function() {
    $.ajax({
        url:'/auth/me',
        method:'GET',
        success: function (data) {
            // API call successful           
            const role = data.user.role;
            $(".modify").removeClass("d-none");
            if(role=="admin"){
                $("#modify").removeClass("d-none");
            }
          },
          error: function () {

          }

    });

    $.ajax({
        url: '/event/dashboard',
        method: 'GET',
        success: function(allticket){
            allticket.forEach(function(event){
                var eventComponents = 
                    `
                    <div class="event-img my-5" id="${event._id}">
                        <a class="nav-link" href="selectSeat.html"></a>
                        <div class="event-mask">
                            <div class="d-flex justify-content-center align-items-center h-100 w-100">
                                <svg width="660px" height="225px">
                                    <line x1="200" y1="100" x2="460" y2="100" stroke="#D3D3D3" 
                                    stroke-width="4" stroke-linecap="round"" />
                                </svg>
                                <div class="d-flex flex-column justify-content-center align-items-center translate-middle" style="position: absolute; color: #D3D3D3; left: 125px; top: 100px;">
                                    <h1 class="">${event.starttime}</h1>
                                    <h6>${event.startdate}</h6>
                                    <h4>${event.depart}</h4>
                                </div>
                                
                                <div class="d-flex flex-column justify-content-center align-items-center translate-middle" style="position: absolute; color: #D3D3D3; right: 0px; top: 100px;">
                                    <h1>${event.endtime}</h1>
                                    <h6>${event.enddate}</h6>
                                    <h4>${event.arrive}</h4>
                                </div>
        
                                <div class="d-flex flex-column justify-content-center align-items-center translate-middle" style="position: absolute; color: #D3D3D3; left: 50%; top: 75px;">
                                    <h2>${event.time}</h2>
                                </div>
        
                                <div class="d-flex flex-column justify-content-center align-items-center translate-middle" style="position: absolute; color: #D3D3D3; left: 50%; top: 125px;">
                                    <h2>${event.trainID}</h2>
                                </div>
        
                                <div class="d-flex flex-column justify-content-center align-items-center translate-middle" style="position: absolute; color: #D3D3D3; left: 50%; top: 170px;">
                                    <h3>${event.price}</h3>
                                </div>
        
                                <div class="d-flex flex-column justify-content-center align-items-center" style="position: absolute; color: #D3D3D3; right: 0%; top: 95px;">
                                    <botton class="btn btn-outline-secondary" id="${event.trainID}" onclick="buyTicket('${event.trainID}', '${event.price}')"><h1>></h1></botton>
                                </div>

                                <div class="d-flex flex-column justify-content-center align-items-center" style="position: absolute; right: 5%; top: 170px;">
                                    <button class="btn btn-secondary d-none modify" type="button">Modify Ticket</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;                    
                $("#event").append(eventComponents);
            });
        }
    });


  });

function buyTicket(train_ID, price){
    // console.log(train_ID);
    // console.log(price);
    localStorage.setItem('trainID', train_ID);
    localStorage.setItem('price', price)
}

  
$(document).ready(function() {
    $.ajax({
        url: '/event/dashboard',
        method: 'GET',
        success: function(allticket){
            allticket.forEach(function(event){
                var eventComponents = 
                    `
                    <div class="event-img my-5" action="/event/train_upload" method="POST">
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
                                    <h3>${event.price}HKD</h3>
                                </div>
        
                                <div class="d-flex flex-column justify-content-center align-items-center" style="position: absolute; color: #D3D3D3; right: 0%; top: 95px;">
                                    <botton class="btn btn-outline-secondary" id="${event.trainID}" onclick="buyTicket('${event.trainID}', '${event.price}')"><h1>></h1></botton>
                                </div>

                                <div class="d-flex flex-column justify-content-center align-items-center" style="position: absolute; right: 5%; top: 170px;">
                                    <button class="btn btn-secondary ticket_modify d-none" id="ticket_modify" onclick="modify('${event.trainID}','${event.depart}','${event.arrive}','${event.startdate}','${event.enddate}','${event.starttime}','${event.endtime}','${event.time}','${event.price}','${event.description}')">Modify Train</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;                    
                $("#event").append(eventComponents);
            });
        }
    });

    $.ajax({
        url:'/auth/me',
        method:'GET',
        success: function (data) {
            // API call successful           
            const role = data.user.role;
            $(".ticket_modify").addClass("d-none");
            if(role==="admin"){
                $(".ticket_modify").removeClass("d-none");
            } else if (role === 'user') {
                $(".ticket_modify").addClass("d-none");
            }
          },
          error: function () {

          }

    });
  });


function modify(trainID,depart,arrive,startdate,enddate,starttime,endtime,time,price,description){
    // var trainSelected = {
    //     trainID: trainID,
    //     depart: depart,
    // }   
    localStorage.setItem('trainID', trainID);
    localStorage.setItem('start', depart);
    localStorage.setItem('end', arrive);
    localStorage.setItem('startdate', startdate);
    localStorage.setItem('enddate', enddate);
    localStorage.setItem('starttime', starttime);
    localStorage.setItem('endtime', endtime);
    localStorage.setItem('time', time);
    localStorage.setItem('price', price);
    localStorage.setItem('description', description);
    window.location.href = 'train_upload.html';
}

function filter(event){
    $("#filter-form").removeClass("d-none");
    $("#filter-button").addClass("d-none");
}

function showall(event){
    $("#filter-form").addClass("d-none");
    $("#filter-button").removeClass("d-none");
}

function search(event){
    //store the filter input
    const train_filter = $('#train_filter').val();
    const start_filter = $('#start_filter').val();
    const end_filter = $('#end_filter').val();
    const startdate_filter = $('#startdate_filter').val();
    const enddate_filter = $('#enddate_filter').val();
    const starttime_filter = $('#starttime_filter').val();
    const endtime_filter = $('#endtime_filter').val();
    const description_filter = $('#description_filter').val();

    // localStorage.setItem('trainID_filter', train_filter);
    // localStorage.setItem('start_filter', start_filter);
    // localStorage.setItem('end_filter', end_filter);
    // localStorage.setItem('startdate_filter', startdate_filter);
    // localStorage.setItem('enddate_filter', enddate_filter);
    // localStorage.setItem('starttime_filter', starttime_filter);
    // localStorage.setItem('endtime_filter', endtime_filter);
    // localStorage.setItem('description_filter', description_filter);

    const formData = new FormData();

    formData.append('train_filter', train_filter);
    formData.append('start_filter', start_filter);
    formData.append('end_filter', end_filter);
    formData.append('startdate_filter', startdate_filter);
    formData.append('enddate_filter', enddate_filter);
    formData.append('starttime_filter', starttime_filter);
    formData.append('endtime_filter', endtime_filter);
    formData.append('description_filter', description_filter);
    $.ajax({
        url: '/event/dashboard',
        method: 'POST',
        data:formData
    });

}

function buyTicket(train_ID, price){
    // console.log(train_ID);
    // console.log(price);
    const train_information = {
        trainID: train_ID,
        price: price
    }
    localStorage.setItem('train_information', JSON.stringify(train_information));
    window.location.href = '../selectSeat.html';
}

  
$(document).ready(function() {
    $.get("scripts/event.json", function(data) {
      // Success Case Handling
      
  
      data.forEach(function(event){
        var eventComponents = 
            `
            <div class="event-img my-5">
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
                            <h4>${event.start}</h4>
                        </div>
                        
                        <div class="d-flex flex-column justify-content-center align-items-center translate-middle" style="position: absolute; color: #D3D3D3; right: 0px; top: 100px;">
                            <h1>${event.endtime}</h1>
                            <h6>${event.enddate}</h6>
                            <h4>${event.end}</h4>
                        </div>

                        <div class="d-flex flex-column justify-content-center align-items-center translate-middle" style="position: absolute; color: #D3D3D3; left: 50%; top: 75px;">
                            <h2>${event.time}</h2>
                        </div>

                        <div class="d-flex flex-column justify-content-center align-items-center translate-middle" style="position: absolute; color: #D3D3D3; left: 50%; top: 125px;">
                            <h2>${event.train}</h2>
                        </div>

                        <div class="d-flex flex-column justify-content-center align-items-center translate-middle" style="position: absolute; color: #D3D3D3; left: 50%; top: 170px;">
                            <h3>${event.price}</h3>
                        </div>

                        <div class="d-flex flex-column justify-content-center align-items-center" style="position: absolute; color: #D3D3D3; right: 0%; top: 95px;">
                            <a class="link-info link-underline-opacity-0" href="selectSeat.html"><h1>></h1></a>
                        </div>
                    </div>
                </div>
            </div>
            `;
            
        $("#event").append(eventComponents);
      });
    })
  });
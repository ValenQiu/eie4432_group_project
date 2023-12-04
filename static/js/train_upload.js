$(document).ready(function (event) {
// $.ajax({
//     url: '/event/train_update',
//     method: 'POST',
//     success: function (data) {

//     },
//     error: function () {
//         console.log('fail');
//     }
//   });

  const trainID = localStorage.getItem("trainID");
  const start = localStorage.getItem("start");
  const end= localStorage.getItem("end");
  const startdate = localStorage.getItem("startdate");
  const enddate = localStorage.getItem("enddate");
  const starttime = localStorage.getItem("starttime");
  const endtime = localStorage.getItem("endtime");
  const time = localStorage.getItem("time");
  const price= localStorage.getItem("price");
  const description= localStorage.getItem("description");


  $("#train").attr("value",trainID);
  $("#start").attr("value",start);
  $("#end").attr("value",end);
  $("#startdate").attr("value",startdate);
  $("#enddate").attr("value",enddate);
  $("#starttime").attr("value",starttime);
  $("#endtime").attr("value",endtime);
  $("#time").attr("value",time);
  $("#price").attr("value",price);
  $("#description").attr("value",description);
});

function ticketupload(event){
    event.preventDefault();

    const train = $('#train').val();
    const start = $('#start').val();
    const end = $('#end').val();
    const startdate = $('#startdate').val();
    const enddate = $('#enddate').val();
    const starttime = $('#starttime').val();
    const endtime = $('#endtime').val();
    const time = $('#time').val();
    const price = $('#price').val();
    const description = $('#description').val();
    
    if (!train){
        // Check if the user inputs both username and password. If not, show an alert box with
        // the message “Username and password cannot be empty”
        alert("Train Number cannot be empty.");
        return;
    } else if(!start){
        alert("Origin cannot be empty.");
        return;
    } else if(!end){
        alert("Destination cannot be empty.");
        return;
    } else if(!startdate){
        alert("Start Date cannot be empty.");
        return;
    } else if(!enddate){
        alert("Arrival Date cannot be empty.");
        return;
    } else if(!starttime){
        alert("Start Time cannot be empty.");
        return;
    } else if(!endtime){
        alert("End Time cannot be empty.");
        return;
    } else if(!time){
        alert("Journey Time cannot be empty.");
        return;
    } else if(!price){
        alert("Price cannot be empty.");
        return;
    };

    const formData = new FormData();
    // passwords are matched
    formData.append('train', train);
    formData.append('start', start);
    formData.append('end', end);
    formData.append('startdate', startdate);
    formData.append('enddate', enddate);
    formData.append('starttime', starttime);
    formData.append('endtime', endtime);
    formData.append('time', time);
    formData.append('price', price);
    formData.append('description', description);

    $.ajax({
        url: '/event/train_upload',
        method: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (data) {
            alert(data);            // Check the status of the response
            if (data.status === 'success') {
            // Registration succeeded
            alert(`Travel Upload Successfully!`);
            localStorage.removeItem("trainID");
            localStorage.removeItem("start");
            localStorage.removeItem("end");
            localStorage.removeItem("startdate");
            localStorage.removeItem("enddate");
            localStorage.removeItem("starttime");
            localStorage.removeItem("endtime");
            localStorage.removeItem("time");
            localStorage.removeItem("price");
            localStorage.removeItem("description");
            window.location.href = 'dashboard.html';
            } else {
                alert(data.message);
            }
        }, error: function (xhr) {
            console.log(xhr.status);
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
};

function ticketdelete(event){
    event.preventDefault();
    const train = $('#train').val();
    const formData = new FormData();
    // passwords are matched
    formData.append('train', train);

    
    $.ajax({
        url: '/event/train_delete',
        method: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (data) {
            alert(data);            // Check the status of the response
            if (data.status === 'success') {
            // Registration succeeded
            alert(`Travel delete Successfully!`);
            localStorage.removeItem("trainID");
            localStorage.removeItem("start");
            localStorage.removeItem("end");
            localStorage.removeItem("startdate");
            localStorage.removeItem("enddate");
            localStorage.removeItem("starttime");
            localStorage.removeItem("endtime");
            localStorage.removeItem("time");
            localStorage.removeItem("price");
            localStorage.removeItem("description");
            window.location.href = 'dashboard.html';
            } else {
                alert(data.message);
            }
        }, error: function (xhr) {
            console.log(xhr.status);
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
};
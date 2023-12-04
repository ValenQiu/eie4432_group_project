$(document).ready(function (event) {
    $.ajax({
      url: '/auth/me',
      method: 'GET',
      success: function (data) {
        // API call successful
        const username = data.user.username;
        const role = data.user.role;
        localStorage.setItem("username", username);
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

    localStorage.removeItem("train_information");

    $('#logout').click(function () {
        const confirmLogout = confirm('Confirm to logout?');
        if (confirmLogout) {

          $.ajax({
            url: '/auth/logout',
            method: 'POST',
            success: function () {

              window.location.href = '/index.html';
            },
            error: function () {
              alert('Logout failed');
            },
          });
        }
      });
  });
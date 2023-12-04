$(document).ready(function (event) {

  $.ajax({
    url: '/auth/me',
    method: 'GET',
    success: function (data) {
      // API call successful
      const username = data.user.username;
      const firstname = data.user.firstname;
      const lastname = data.user.lastname;
      const birthday = data.user.birthday;
      const nickname = data.user.nickname;
      const gender = data.user.gender;
      const role = data.user.role;
      const email = data.user.email;
      const lastLogintime=data.user.lastLogintime;
      $("#profile_username").text(username);
      $("#profile_username").attr("value",username);
      $("#profile_name").text(`${firstname} ${lastname}`);
      $("#profile_nickname").text(nickname);
      $("#profile_birthday").text(birthday);
      $("#profile_gender").text(gender);
      $("#profile_role").text(role);
      $("#profile_email").text(email);
      $("#profile_lastLogintime").text(lastLogintime);
      


      $("#change").click(function(){
        $('#profile_table').addClass("d-none");
        $('#profile_change_table').removeClass("d-none");
        $("#profile_change_username").text(username);
        //$("#profile_change_username").attr("value",username);
        $("#profile_change_firstname").attr("value",firstname);
        $("#profile_change_lastname").attr("value",lastname);
        $("#profile_change_nickname").attr("value",nickname);
        $("#profile_change_birthday").attr("value",birthday);
        $("#profile_change_gender").attr("value",gender);
        $("#profile_change_email").attr("value",email);
      })
    },
    error: function () {
      // API call failed
      // alert('Please login');
      // window.open('/login.html', '_self');
      $("#login_Buttons").removeClass("d-none");
      $("#profile_Button").addClass("d-none");
    },
  });

  $("#finish").click(function(){
    $('#profile_table').removeClass("d-none");
    $('#profile_change_table').addClass("d-none");

    const username_change = $('#profile_change_username').text();
    const gender_change = $('#profile_change_gender').val();
    const nickname_change = $('#profile_change_nickname').val();
    const birthday_change = $('#profile_change_birthday').val();
    const firstname_change = $('#profile_change_firstname').val();
    const lastname_change = $('#profile_change_lastname').val();
    const email_change = $('#profile_change_email').val();

    
    const formData = new FormData();
    // passwords are matched
    formData.append('username', username_change);
    formData.append('firstname', firstname_change);
    formData.append('lastname', lastname_change);
    formData.append('birthday', birthday_change);
    formData.append('nickname', nickname_change);
    formData.append('gender', gender_change);
    formData.append('email', email_change);

    $.ajax({
      url: '/auth/profile',
      method: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function (data) {
          // alert(data);            // Check the status of the response
          if (data.status === 'success') {
          // Registration succeeded
          alert('Profile changed!');
          
          window.location.href = '/profile.html';
          } else {
              // Registration failed
              alert(data.message);
          }
      }, error: function (xhr) {
        //console.log(data);
        alert('Unknown error');
      },
    });
  })

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
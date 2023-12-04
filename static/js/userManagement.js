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
        url: '/auth/usersData',
        method: 'GET',
        success:   function(data){
            // console.log(data);
            data.forEach(function(user){
                var userComponents = 
                `
                <div class="row mx-3 border border-secondary rounded ">
                        <p class="w-auto">Username: ${user.username}</p>
                        <p class="w-auto">Firstname: ${user.firstname}</p>
                        <p class="w-auto">Lastname: ${user.lastname}</p>
                        <p class="w-auto">Nickname: ${user.nickname}</p>
                        <p class="w-auto">Birthday: ${user.birthday}</p>
                        <p class="w-auto">Gender: ${user.gender}</p>
                        <p class="w-auto">email: ${user.email}</p>
                        <p class="w-auto">Role: ${user.role}</p>
                        <p class="w-auto">Password: ${user.password}</p>
                        <p class="w-auto">Last Login Time: ${user.lastLoginTime}</p>
                </div>
                `;
                $("#userAccounts").append(userComponents);
            });
        }, error: function () {
            // API call failed
            // alert('Please login');
            // window.open('/login.html', '_self');
            console.log("fail");
          },
    });
})
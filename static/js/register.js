function register(event){
    event.preventDefault();
  
    const usernameInput = $('#username');
    const passwordInput1 = $('#password1');
    const passwordInput2 = $('#password2');
    const genderInput = $('#gender');
    const nicknameInput = $('#nickname');
    const birthdayInput = $('#birthday');
    const firstnameInput = $('#firstname');
    const lastnameInput = $('#lastname');
    const emailInput = $('#email');
    // const profileImg = null;

    const username = usernameInput.val();
    const password1 = passwordInput1.val();
    const password2 = passwordInput2.val();
    const gender = genderInput.val();
    const nickname = nicknameInput.val();
    const birthday = birthdayInput.val();
    const firstname = firstnameInput.val();
    const lastname = lastnameInput.val();
    const email = emailInput.val();

    // alert("password1: "+ password1 + " passwork2:" + password2);
    // console.log(res.body);
    
    if (!username || !password1 || !password2){
        // Check if the user inputs both username and password. If not, show an alert box with
        // the message “Username and password cannot be empty”
        alert("Username and password cannot be empty.");
        return;
    } else if(!nickname){
        alert("Nickname cannot be empty.");
        return;
    } else if(!birthday){
        alert("Birthday cannot be empty.");
        return;
    } else if(!firstname){
        alert("Firstname cannot be empty.");
        return;
    } else if(!lastname){
        alert("Lastname cannot be empty.");
        return;
    } else if(!email){
        alert("E mail cannot be empty.");
        return;
    }else if (password1 !== password2){
        // Check if the user repeats the same password twice. If not, show an alert box with the
        // message “Password mismatch!”
        alert("Password mismatch!");
        return;
    } else if (gender === "default"){
        // Check if the user selects the gender. If not, show an alert box with the message “Please
        // select your gender”
        alert('Please select your gender.');
        return;
    };

    const formData = new FormData();
    // passwords are matched
    var password = password1;
    formData.append('username', username);
    formData.append('password', password);
    formData.append('role', 'user');
    formData.append('firstname', firstname);
    formData.append('lastname', lastname);
    formData.append('birthday', birthday);
    formData.append('nickname', nickname);
    formData.append('gender', gender);
    formData.append('email', email);
    console.log(formData);
    $.ajax({
        url: '/auth/register',
        method: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (data) {
            // alert(data);            // Check the status of the response
            if (data.status === 'success') {
            // Registration succeeded
            alert(`Welcome, ${data.user.username}!\nYou can login with your account now!`);
            
            window.location.href = 'login.html';
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
};
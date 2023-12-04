function login(event) {
  event.preventDefault();

  const usernameInput = $('#username');
  const passwordInput = $('#password');

  const username = usernameInput.val();
  const password = passwordInput.val();
  const rememberMe = $("#rememberMe").prop("checked");

  if (username && password) {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    $.ajax({
      url: '/auth/login',
      method: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function (data) {
        if (data.status === 'success') {
          alert(`Logged in as ${data.user.username} (${data.user.role})`);
          if (rememberMe){
            localStorage.setItem("username", username);
            localStorage.setItem("password", password);
            localStorage.setItem("rememberMe", rememberMe);
          } else {
            localStorage.removeItem("username");
            localStorage.removeItem("password");
            localStorage.removeItem("rememberMe");
          }
          window.location.href = '/index.html';
        } else if (data.status === 'failed') {
          alert(data.message);
        } else {
          alert('Unknown error');
        }
      },
      error: function (xhr) {
        if (xhr.status === 401) {
          const errorMessage = xhr.responseJSON.message;
          alert(errorMessage);
        } else {
          alert('Unknown error');
        }
      },
    });
  } else {
    alert('Username and password cannot be empty');
  }
}

window.onload = function () {
  var storedUsername = localStorage.getItem("username");
      var storedPassword = localStorage.getItem("password");
      var storedRememberMe = localStorage.getItem("rememberMe");

      if (storedRememberMe && storedUsername && storedPassword) {
        document.getElementById("username").value = storedUsername;
        document.getElementById("password").value = storedPassword;
        document.getElementById("rememberMe").checked = true;
      }
}
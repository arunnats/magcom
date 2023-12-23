$(document).ready(function () {
    $('#login-form').submit(function (e) {
        e.preventDefault();

        const username = $('#username').val();
        const password = $('#password').val();

        // Call the handleAction function with the appropriate action and input data
        handleAction('Login', { username, password });
    });

    function sendPostRequest(url, data) {
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .catch(error => console.error(error));
    }

    function handleAction(action, inputData) {
        // Adjust the URL based on your server setup
        const apiUrl = 'http://localhost:3000/admin/login';
        console.log(apiUrl);
      
        // Send a POST request with the input data
        sendPostRequest(apiUrl, inputData)
          .then(response => {
            console.log('Server response:', response);
      
            // Check for success and redirect
            if (response.success) {
              window.location.href = response.redirect;
            } else {
              // Show an alert with the error message if the login is unsuccessful
              alert(response.message || 'Invalid credentials. Try again.');
            }
          });
      }
      
});

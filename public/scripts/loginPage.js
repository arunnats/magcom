// Wait for the document to be ready
$(document).ready(function () {
    // Attach a submit event listener to the login form
    $('#login-form').submit(function (e) {
        // Prevent the default form submission
        e.preventDefault();

        // Get the values of username and password from the form
        const username = $('#username').val();
        const password = $('#password').val();

        // Make an AJAX POST request to the server
        $.ajax({
            type: 'POST',
            url: '/admin/login', // Server-side route handling login logic
            data: { username, password }, // Send username and password to the server
            success: function (data) {
                // Log success message to the console
                console.log('Success:', data);
                
                // Redirect to the specified URL on success
                window.location.href = data.redirect;
            },
            error: function (error) {
                // Log error message to the console
                console.log('Error:', error);
                
                // Handle error response (e.g., show an alert)
                alert('Invalid username or password. Please try again.');
            },
        });
    });
});

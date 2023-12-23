$(document).ready(function () {
  $('.adminButton').click(function () {
      const action = $(this).text(); // Use button text as the action
      generateInputFields(action);
  });

  function generateInputFields(action) {
      // Clear previous dynamic content
      $('#dynamicContent').empty();

      switch (action) {
          case 'Add Magazine':
              addInputField('Magazine name*', 'name');
              addInputField('Publication Year*', 'publicationYear');
              addInputField('Image*', 'image');
              addInputField('File Name*', 'fileName');
              break;

          case 'Remove Magazine':
              addInputField('Magazine Name', 'name');
              break;

          case 'Add Article':
              addInputField('Article ID', 'articleID');
              addInputField('Title', 'title');
              addInputField('Publication Year', 'publicationYear');
              addInputField('Publication Month', 'publicationMonth');
              addInputField('Publication Date', 'publicationDate');
              addInputField('Author', 'author');
              addInputField('Designer', 'designer');
              addInputField('Cover Image Name', 'coverImgName');
              addInputField('Content', 'content', true);
              break;

          case 'Remove Article':
              addInputField('Article ID', 'articleID');
              break;

          case 'Reset Articles':
              break;

          case 'Reset Magazines':
              break;

          case 'Add User':
              addInputField('Username', 'username');
              addInputField('Password', 'password');
              break;

          case 'Remove User':
              addInputField('Username', 'username');
              addInputField('Password', 'password');
              break;

          default:
              break;
      }

      $('#dynamicContent').append('<button type="button" id="submitButton">Submit</button>');

      $('#submitButton').click(function () {
          const inputData = {};
          $('#dynamicContent input, #dynamicContent textarea').each(function () {
              inputData[$(this).data('fieldName')] = $(this).val();
          });

          handleAction(action, inputData);
      });
  }

  function addInputField(label, fieldName, isTextArea = false) {
      let inputField;

      if (isTextArea) {
          inputField = $(`<div><label>${label}</label><textarea data-field-name="${fieldName}"></textarea></div>`);
      } else {
          inputField = $(`<div><label>${label}</label><input type="text" data-field-name="${fieldName}"></div>`);
      }

      $('#dynamicContent').append(inputField);
  }
  
    function sendPostRequest(url, data) {
      console.log(JSON.stringify(data));
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
      console.log(`Action: ${action}`);
      console.log('Input Data:', inputData);

      if (inputData.content) {
        inputData.content = inputData.content.replace(/\n/g, '\n\n');
    }
      // Adjust the URL based on your server setup
      const apiUrl = 'http://localhost:3000/admin/dashboard/' + action.toLowerCase().replace(/\s/g, '');
      console.log(apiUrl);
      // Send a POST request with the input data
      sendPostRequest(apiUrl, inputData)
          .then(response => {
              console.log('Server response:', response);
              // Handle the response as needed
          });
    }

  });
  

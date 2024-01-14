$(document).ready(function () {
    $('.adminButton').click(function () {
        const action = $(this).text();
        console.log('Button clicked. Action:', action);
        generateInputFields(action);
    });

    function generateInputFields(action) {
        $('#dynamicContent').empty();
        const dynamicForm = $('<form enctype="multipart/form-data"></form>');

        switch (action) {
            case 'Add Magazine':
                addInputField('Magazine name*', 'name', dynamicForm);
                addInputField('Publication Year*', 'publicationYear', dynamicForm);
                addInputField('Cover Image*', 'image', dynamicForm, 'file', '.png, .jpg, .jpeg');
                addInputField('Magazine PDF*', 'pdfFile', dynamicForm, 'file', '.pdf');
                break;

            case 'Remove Magazine':
                addInputField('Magazine Name', 'name', dynamicForm);
                break;

            case 'Add Article':
                addInputField('Article ID', 'articleID', dynamicForm);
                addInputField('Title', 'title', dynamicForm);
                addInputField('Publication Year', 'publicationYear', dynamicForm);
                addInputField('Publication Month', 'publicationMonth', dynamicForm);
                addInputField('Publication Date', 'publicationDate', dynamicForm);
                addInputField('Author', 'author', dynamicForm);
                addInputField('Designer', 'designer', dynamicForm);
                addInputField('Cover Image*', 'image', dynamicForm, 'file', '.png, .jpg, .jpeg');
                addInputField('Content', 'content', dynamicForm, 'textarea');
                break;

            case 'Remove Article':
                addInputField('Article ID', 'articleID', dynamicForm);
                break;

            case 'Add SAC News':
                addInputField('SAC News ID', 'sacID', dynamicForm);
                addInputField('Title', 'title', dynamicForm);
                addInputField('Publication Year', 'publicationYear', dynamicForm);
                addInputField('Publication Month', 'publicationMonth', dynamicForm);
                addInputField('Publication Date', 'publicationDate', dynamicForm);
                addInputField('SAC PDF*', 'pdfFile', dynamicForm, 'file', '.pdf');
                break;

            case 'Remove SAC News':
                addInputField('SAC News ID*', 'sacID', dynamicForm);
                break;

            case 'Reset Articles':
                break;

            case 'Reset Magazines':
                break;
                
            case 'Reset SAC News':
                break;

            case 'Add User':
                addInputField('Username*', 'username', dynamicForm);
                addInputField('Password*', 'password', dynamicForm);
                break;
                
            case 'Remove User':
                addInputField('Username*', 'username', dynamicForm);
                addInputField('Password*', 'password', dynamicForm);
                break;

            default:
                break;
        }

        $('#dynamicContent').append(dynamicForm);
        dynamicForm.append('<button type="button" id="submitButton">Submit</button>');

        $('#submitButton').click(function () {
            const formData = new FormData(dynamicForm[0]);
            console.log('Submit button clicked. FormData:', formData);
            handleAction(action, formData);
        });
    }

    function addInputField(label, fieldName, form, fieldType = 'text', acceptedFileTypes = '') {
        let inputField;

        if (fieldType === 'textarea') {
            inputField = $(`<div><label>${label}</label><textarea name="${fieldName}" data-field-name="${fieldName}"></textarea></div>`);
        } else if (fieldType === 'file') {
            inputField = $(`<div><label>${label}</label><input type="file" name="${fieldName}" accept="${acceptedFileTypes}" data-field-name="${fieldName}"></div>`);
        } else {
            inputField = $(`<div><label>${label}</label><input type="${fieldType}" name="${fieldName}" data-field-name="${fieldName}"></div>`);
        }

        form.append(inputField);
    }

    async function sendPostRequest(url, data) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                body: data,
            });

            return await response.json();
        } catch (error) {
            console.error(error);
        }
    }

    function handleAction(action, formData) {
        
        if (formData.get('content')) {
            formData.set('content', formData.get('content').replace(/\n\n/g, '|||'));
        }
    
        const apiUrl = 'http://localhost:3000/admin/dashboard/' + action.toLowerCase().replace(/\s/g, '');
    
        sendPostRequest(apiUrl, formData)
            .then(response => {
                console.log('Server response:', response);
            });
    }
});

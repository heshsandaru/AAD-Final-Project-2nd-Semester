let baseUrl = "http://localhost:8080/springBoot/";
generateUserID();

function clearData(){
    $("#txtCusName").val("");
    $("#txtCusEmail").val("");
    $("#txtCustomerPassword").val("");
}


function generateUserID() {
    $("#txtCusId").val("U00-001");
    $.ajax({
        url: baseUrl + "auth/UserIdGenerate",
        method: "GET",
        success: function (resp) {
            let id = resp.value;
            let tempId = parseInt(id.split("-")[1]) + 1;
            let formattedId = `U00-${tempId.toString().padStart(3, '0')}`;
            $("#txtCusId").val(formattedId);
        },
        error: function (error) {
            console.error("Error generating ID", error);
        }
    });
}

$("#btnRegisterUser").click(function () {
    let formData = {
        "id": $("#txtCusId").val(),
        "username": $("#txtCusName").val(),
        "email": $("#txtCusEmail").val(),
        "password": $("#txtCustomerPassword").val()
    };

    $.ajax({
        url: baseUrl + "auth/register",
        method: "POST",
        contentType: "application/json",  // Send JSON
        data: JSON.stringify(formData),   // Convert to JSON
        dataType: "json",
        success: function (res) {
            saveUpdateAlert("User", res.message);
            clearData();
        },
        error: function (error) {
            handleError(error);
        }
    });
});

function handleError(error) {
    let message = "Unknown error occurred";
    if (error.responseText) {
        try {
            message = JSON.parse(error.responseText).message;
        } catch (e) {
            message = "Server error: Unable to process request";
        }
    }
    unSuccessUpdateAlert("User", message);
}

const regExCusID = /^(U00-)[0-9]{3,4}$/;
const regExCusName = /^[A-Za-z ]{3,20}$/;
const regExCusEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

let userValidations = [
    { reg: regExCusID, field: $('#txtCusId'), error: 'User ID Pattern is Wrong: U00-001' },
    { reg: regExCusName, field: $('#txtCusName'), error: 'User Name must be 3-20 letters' },
    { reg: regExCusEmail, field: $('#txtCusEmail'), error: 'Invalid Email (example@domain.com)' }
];

$("#txtCusId, #txtCusName, #txtCusEmail").on('keydown keyup blur', function () {
    checkValidity(userValidations);
});

// Focus Management
$("#txtCusId").on('keydown', function (event) {
    if (event.key === "Enter" && check(regExCusID, $("#txtCusId"))) $("#txtCusName").focus();
});
$("#txtCusName").on('keydown', function (event) {
    if (event.key === "Enter" && check(regExCusName, $("#txtCusName"))) $("#txtCusEmail").focus();
});
$("#txtCusEmail").on('keydown', function (event) {
    if (event.key === "Enter" && check(regExCusEmail, $("#txtCusEmail"))) $('#btnRegisterUser').focus();
});
let baseUrl = "http://localhost:8080/springBoot/";
const  token = localStorage.getItem('token');

// Disable buttons initially
// $("#btnSaveCustomer, #btnUpdateCustomer, #btnDeleteCustomer").attr('disabled', true);

// Load all customers on page load
loadAllCustomer();

function getToken() {
    return localStorage.getItem("token");
}

// Function to generate customer ID
function generateCustomerID() {
    $("#txtCusId").val("C00-001");
    $.ajax({
        url: baseUrl + "customer/CustomerIdGenerate",
        method: "GET",
        headers: { "Authorization": `Bearer ${getToken()}` },
        success: function (resp) {
            let id = resp.value;
            let tempId = parseInt(id.split("-")[1]) + 1;
            let formattedId = `C00-${tempId.toString().padStart(3, '0')}`;
            $("#txtCusId").val(formattedId);
        },
        error: function (error) {
            console.error("Error generating ID", error);
        }
    });
}
function clearData(){
    $("#txtCusName").val("");
    $("#txtCusAddress").val("");
    $("#txtCustomerEmail").val("");

}

$("#btnClearCustomer").click(function () {
    $("#txtCusName").val("");
    $("#txtCusAddress").val("");
    $("#txtCustomerEmail").val("");
});


// Save Customer
$("#btnSaveCustomer").click(function () {
    let formData = $("#customerForm").serialize();
    $.ajax({
        url: baseUrl + "customer",
        method: "POST",
        headers: { "Authorization": `Bearer ${getToken()}` },
        data: formData,
        dataType: "json",
        success: function (res) {
            saveUpdateAlert("Customer", res.message);
            loadAllCustomer();
            clearData();
        },
        error: function (error) {
            handleError(error);
        }
    });
});

// Load All Customers
function loadAllCustomer() {
    $("#customerTable").empty();
    $.ajax({
        url: baseUrl + "customer/loadAllCustomer",
        method: "GET",
        headers: { "Authorization": `Bearer ${getToken()}` },
        dataType: "json",
        success: function (res) {
            if (res.data.length === 0) {
                $("#customerTable").append("<tr><td colspan='4'>No customers found</td></tr>");
            } else {
                res.data.forEach(i => {
                    let row = `<tr>
                        <td>${i.id}</td>
                        <td>${i.name}</td>
                        <td>${i.address}</td>
                        <td>${i.emails}</td>
                    </tr>`;
                    $("#customerTable").append(row);
                });
            }
            bindClickEvents();
            generateCustomerID();
        },
        error: function (error) {
            console.error("Error loading customers", error);
        }
    });
}

// Bind Click Events
function bindClickEvents() {
    $("#customerTable>tr").on("click", function () {
        let id = $(this).children().eq(0).text();
        let name = $(this).children().eq(1).text();
        let address = $(this).children().eq(2).text();
        let emails = $(this).children().eq(3).text();
        $("#txtCusId").val(id);
        $("#txtCusName").val(name);
        $("#txtCusAddress").val(address);
        $("#txtCustomerEmail").val(emails);
        $("#btnUpdateCustomer, #btnDeleteCustomer").attr('disabled', false);
    });
}

// Update Customer
$("#btnUpdateCustomer").click(function () {
    let customerOb = {
        id: $("#txtCusId").val(),
        name: $("#txtCusName").val(),
        address: $("#txtCusAddress").val(),
        emails: $("#txtCustomerEmail").val()
    };
    $.ajax({
        url: baseUrl + "customer",
        method: "PUT",
        headers: { "Authorization": `Bearer ${getToken()}` },
        contentType: "application/json",
        data: JSON.stringify(customerOb),
        success: function (res) {
            saveUpdateAlert("Customer", res.message);
            loadAllCustomer();
            clearData();
        },
        error: function (error) {
            handleError(error);
        }
    });
});

// Delete Customer
$("#btnDeleteCustomer").click(function () {
    let cusId = $("#txtCusId").val();
    $.ajax({
        url: `${baseUrl}customer/${cusId}`,
        method: "DELETE",
        headers: { "Authorization": `Bearer ${getToken()}` },
        success: function (res) {
            saveUpdateAlert("Customer", res.message);
            loadAllCustomer();
            clearData();
        },
        error: function (error) {
            handleError(error);
        }
    });
});

// Search Customer by ID
$("#searchCusId").on("keypress", function (event) {
    if (event.which === 13) {
        let search = $("#searchCusId").val();
        $("#customerTable").empty();
        $.ajax({
            url: baseUrl + "customer/searchCusId/?id=" + search,
            method: "GET",
            headers: { "Authorization": `Bearer ${getToken()}` },
            dataType: "json",
            success: function (res) {
                if (res.id) {
                    let row = `<tr>
                        <td>${res.id}</td>
                        <td>${res.name}</td>
                        <td>${res.address}</td>
                        <td>${res.emails}</td>
                    </tr>`;
                    $("#customerTable").append(row);
                    bindClickEvents();
                } else {
                    $("#customerTable").append("<tr><td colspan='4'>No results found</td></tr>");
                }
            },
            error: function (error) {
                handleError(error);
            }
        });
    }
});

// Error Handling Function

// Form Validations
function handleError(error) {
    let message = "Unknown error occurred";
    if (error.responseText) {
        try {
            message = JSON.parse(error.responseText).message;
        } catch (e) {
            message = "Server error: Unable to process request";
        }
    }
    unSuccessUpdateAlert("Customer", message);
}
const regExCusID = /^(C00-)[0-9]{3,4}$/;
const regExCusName = /^[A-Za-z ]{3,20}$/;
const regExCusAddress = /^[A-Za-z0-9/ ]{4,30}$/;
const regExCusEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

let customerValidations = [
    { reg: regExCusID, field: $('#txtCusId'), error: 'Customer ID Pattern is Wrong: C00-001' },
    { reg: regExCusName, field: $('#txtCusName'), error: 'Customer Name must be 3-20 letters' },
    { reg: regExCusAddress, field: $('#txtCusAddress'), error: 'Invalid Address (A-z 0-9 ,/)' },
    { reg: regExCusEmail, field: $('#txtCustomerEmail'), error: 'Invalid Email (example@domain.com)' }
];

// Validation Events
$("#txtCusId, #txtCusName, #txtCusAddress, #txtCustomerEmail").on('keydown keyup blur', function () {
    checkValidity(customerValidations);
});

// Prevent tab key
$("#txtCusId, #txtCusName, #txtCusAddress, #txtCustomerEmail").on('keydown', function (event) {
    if (event.key === "Tab") event.preventDefault();
});

// Focus Management
$("#txtCusId").on('keydown', function (event) {
    if (event.key === "Enter" && check(regExCusID, $("#txtCusId"))) $("#txtCusName").focus();
});
$("#txtCusName").on('keydown', function (event) {
    if (event.key === "Enter" && check(regExCusName, $("#txtCusName"))) $("#txtCusAddress").focus();
});
$("#txtCusAddress").on('keydown', function (event) {
    if (event.key === "Enter" && check(regExCusAddress, $("#txtCusAddress"))) $("#txtCustomerEmail").focus();
});
$("#txtCustomerEmail").on('keydown', function (event) {
    if (event.key === "Enter" && check(regExCusEmail, $("#txtCustomerEmail"))) $('#btnSaveCustomer').focus();
});

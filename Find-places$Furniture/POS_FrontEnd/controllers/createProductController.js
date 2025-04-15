
    let baseUrl = "http://localhost:8080/springBoot/";

    loadAllPlace();

    function getToken() {
        return localStorage.getItem("token");
    }

    function generatePlaceID() {
        $("#txtCusId").val("P00-001");
        $.ajax({
            url: baseUrl + "products/PlaceIdGenerate",
            method: "GET",
            headers: { "Authorization": `Bearer ${getToken()}` },
            success: function (resp) {
                let id = resp.value;
                let tempId = parseInt(id.split("-")[1]) + 1;
                let formattedId = `P00-${tempId.toString().padStart(3, '0')}`;
                $("#txtCusId").val(formattedId);
            },
            error: function (error) {
                console.error("Error generating ID", error);
            }
        });
    }

    // Save Customer
    $("#btnSavePlace").click(function () {
        let formData = $("#placeForm").serialize();
        $.ajax({
            url: baseUrl + "products",
            method: "POST",
            headers: { "Authorization": `Bearer ${getToken()}` },
            data: formData,
            dataType: "json",
            success: function (res) {
                saveUpdateAlert("Place", res.message);
                loadAllPlace();
            },
            error: function (error) {
                handleError(error);
            }
        });
    });

    // Load All Customers
    function loadAllPlace() {
        $("#placeTable").empty();
        $.ajax({
            url: baseUrl + "products/loadAllPlace",
            method: "GET",
            headers: { "Authorization": `Bearer ${getToken()}` },
            dataType: "json",
            success: function (res) {
                if (res.data.length === 0) {
                    $("#placeTable").append("<tr><td colspan='6'>No place found</td></tr>");
                } else {
                    res.data.forEach(i => {
                        let row = `<tr>
                        <td>${i.id}</td>
                        <td>${i.location}</td>
                        <td>${i.category}</td>
                        <td>${i.phonenumber}</td>
                        <td>${i.price}</td>
                        <td>${i.action}</td>
                    </tr>`;
                        $("#placeTable").append(row);
                    });
                }
                bindClickEvents();
                generatePlaceID();
            },
            error: function (error) {
                console.error("Error loading places", error);
            }
        });
    }

    // Bind Click Events
    function bindClickEvents() {
        $("#placeTable>tr").on("click", function () {
            let id = $(this).children().eq(0).text();
            let location = $(this).children().eq(1).text();
            let category = $(this).children().eq(2).text();
            let number = $(this).children().eq(3).text();
            let price = $(this).children().eq(4).text();
            let action = $(this).children().eq(5).text();
            $("#txtCusId").val(id);
            $("#txtCusName").val(location);
            $("#txtCategory").val(category);
            $("#txtNumber").val(number);
            $("#txtPrice").val(price);
            $("#txtAction").val(action);
            $("#btnUpdatePlace, #btnDeletePlace").attr('disabled', false);
        });
    }

    // Update Customer
    $("#btnUpdatePlace").click(function () {
        let customerOb = {
            id: $("#txtCusId").val(),
            location: $("#txtCusName").val(),
            category: $("#txtCategory").val(),
            phonenumber: $("#txtNumber").val(),
            price: $("#txtPrice").val(),
            action: $("#txtAction").val()
        };
        $.ajax({
            url: baseUrl + "products",
            method: "PUT",
            headers: { "Authorization": `Bearer ${getToken()}` },
            contentType: "application/json",
            data: JSON.stringify(customerOb),
            success: function (res) {
                saveUpdateAlert("Place", res.message);
                loadAllPlace();
            },
            error: function (error) {
                handleError(error);
            }
        });
    });

    // Delete Customer
    $("#btnDeletePlace").click(function () {
        let placeId = $("#txtCusId").val();
        $.ajax({
            url: `${baseUrl}products/${placeId}`,
            method: "DELETE",
            headers: { "Authorization": `Bearer ${getToken()}` },
            success: function (res) {
                saveUpdateAlert("Place", res.message);
                loadAllPlace();
            },
            error: function (error) {
                handleError(error);
            }
        });
    });

    // Search Customer by ID
    $("#searchPlaceId").on("keypress", function (event) {
        if (event.which === 13) {
            let search = $("#searchPlaceId").val();
            $("#placeTable").empty();
            $.ajax({
                url: baseUrl + "products/searchPlaceId/?id=" + search,
                method: "GET",
                headers: { "Authorization": `Bearer ${getToken()}` },
                dataType: "json",
                success: function (res) {
                    if (res.id) {
                        let row = `<tr>
                        <td>${i.id}</td>
                        <td>${i.location}</td>
                        <td>${i.category}</td>
                        <td>${i.phonenumber}</td>
                        <td>${i.price}</td>
                        <td>${i.action}</td>
                    </tr>`;
                        $("#placeTable").append(row);
                        bindClickEvents();
                    } else {
                        $("#placeTable").append("<tr><td colspan='6'>No results found</td></tr>");
                    }
                },
                error: function (error) {
                    handleError(error);
                }
            });
        }
    });

    // Error Handling Function
    function handleError(error) {
        let message = "Unknown error occurred";
        if (error.responseText) {
            try {
                message = JSON.parse(error.responseText).message;
            } catch (e) {
                message = "Server error: Unable to process request";
            }
        }
        unSuccessUpdateAlert("Place", message);
    }

    // Form Validations
    const regExCusID = /^(P00-)[0-9]{3,4}$/;
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



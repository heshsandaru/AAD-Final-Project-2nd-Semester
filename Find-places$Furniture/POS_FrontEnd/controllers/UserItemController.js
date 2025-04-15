let baseUrl = "http://localhost:8080/springBoot/";


function getToken() {
    return localStorage.getItem("token");
}

LoadAllItems();

function LoadAllItems() {
    $("#ItemTable").empty();
    $.ajax({
        url: baseUrl + "item/loadAllItem",
        method: "GET",
        headers: { "Authorization": `Bearer ${getToken()}` },
        dataType: "json",
        success: function (res) {
            console.log(res);
            for (let i of res.data) {
                let code = i.code;
                let description = i.description;
                let qty = i.qty;
                let unitPrice = i.unitPrice;

                let row = "<tr><td>" + code + "</td><td>" + description + "</td><td>" + qty + "</td><td>" + unitPrice + "</td></tr>";
                $("#ItemTable").append(row);
            }
            blindClickEvents();
            generateItemID();
            setTextFieldValues("", "", "", "");
            console.log(res.message);
        },
        error: function (error) {
            let message = JSON.parse(error.responseText).message;
            console.log(message);
        }
    });
}

$("#ItemIdSearch").on("keypress", function (event) {
    if (event.which === 13) {
        var search = $("#ItemIdSearch").val();
        $("#ItemTable").empty();
        $.ajax({
            url: baseUrl + "item/searchItemCode/?code="+ search,
            method: "GET",
            headers: { "Authorization": `Bearer ${getToken()}` },
            contentType: "application/json",
            dataType: "json",
            success: function (res) {
                console.log(res);
                let row = "<tr><td>" + res.code + "</td><td>" + res.description + "</td><td>" + res.qty + "</td><td>" + res.unitPrice + "</td></tr>";
                $("#ItemTable").append(row);
                blindClickEvents();
            },
            error: function (error) {
                loadAllItems();
                let message = JSON.parse(error.responseText).message;
                emptyMassage(message);
            }
        })
    }
});

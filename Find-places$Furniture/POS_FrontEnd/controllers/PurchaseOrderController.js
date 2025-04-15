

let baseUrl = "http://localhost:8080/springBoot/";


function getToken() {
    return localStorage.getItem("token");
}
// $("#btnPurchase").attr('disabled', true);
// $("#btnAddToCart").attr('disabled', true);


function generateOrderID() {
    $("#orderId").val("ODI-001");
    $.ajax({
        url: baseUrl + "orders/OrderIdGenerate",
        method: "GET",
        headers: { "Authorization": `Bearer ${getToken()}` },
        contentType: "application/json",
        dataType: "json",
        success: function (resp) {
            let orderId = resp.value;
            let tempId = parseInt(orderId.split("-")[1]);
            tempId = tempId + 1;
            if (tempId <= 9) {
                $("#orderId").val("ODI-00" + tempId);
            } else if (tempId <= 99) {
                $("#orderId").val("ODI-0" + tempId);
            } else {
                $("#orderId").val("ODI-" + tempId);
            }
        },
        error: function (ob, statusText, error) {

        }
    });
}


$("#cmbCustomerId").empty();
$.ajax({
    url: baseUrl + "customer/loadAllCustomer",
    method: "GET",
    headers: { "Authorization": `Bearer ${getToken()}` },
    dataType: "json",
    success: function (res) {
        console.log(res);
        setDates();

        for (let i of res.data) {
            let id = i.id;

            $("#cmbCustomerId").append(`<option>${id}</option>`);
        }
        generateOrderID();
        console.log(res.message);
    },
    error: function (error) {
        let message = JSON.parse(error.responseText).message;
        console.log(message);
    }

});

/** Customer cmb Search */
$("#cmbCustomerId").click(function () {
    var search = $("#cmbCustomerId").val();
    $.ajax({
        url: baseUrl + "customer/searchCusId/?id="+ search,
        method: "GET",
        headers: { "Authorization": `Bearer ${getToken()}` },
        contentType: "application/json",
        dataType: "json",
        success: function (res) {
            console.log(res);
            $("#customerName").val(res.name);
            $("#customerAddress").val(res.address);
            $("#customerEmail").val(res.emails);
        },
        error: function (error) {
            let message = JSON.parse(error.responseText).message;
            console.log(message);
        }
    })

});


$("#cmbItemCode").empty();
$.ajax({
    url: baseUrl + "item/loadAllItem",
    method: "GET",
    headers: { "Authorization": `Bearer ${getToken()}` },
    dataType: "json",
    success: function (res) {
        console.log(res);
        for (let i of res.data) {
            let code = i.code;

            $("#cmbItemCode").append(`<option>${code}</option>`);
        }
        console.log(res.message);
    },
    error: function (error) {
        let message = JSON.parse(error.responseText).message;
        console.log(message);
    }
});

$("#cmbItemCode").click(function () {
    var search = $("#cmbItemCode").val();
    $.ajax({
        url: baseUrl + "item/searchItemCode/?code="+ search,
        method: "GET",
        headers: { "Authorization": `Bearer ${getToken()}` },
        contentType: "application/json",
        dataType: "json",
        success: function (res) {
            console.log(res);
            $("#itemName").val(res.description);
            $("#itemPrice").val(res.unitPrice);
            $("#qtyOnHand").val(res.qty);
        },
        error: function (error) {
            let message = JSON.parse(error.responseText).message;
            console.log(message);
        }
    })
});


let itemCode;
let itemName;
let itemPrice;
let itemQty;
let itemOrderQty;


let total = 0;
let discount = 0;
let subTotal = 0;


let tableRow = [];
$("#btnAddToCart").on("click", function () {

    let duplicate = false;
    for (let i = 0; i < $("#tblAddToCart tr").length; i++) {
        if ($("#cmbItemCode option:selected").text() === $("#tblAddToCart tr").children(':nth-child(1)')[i].innerText) {
            duplicate = true;

        }
    }
    if (duplicate !== true) {

        loadCartTableDetail();
        reduceQty($("#buyQty").val());
        calcTotal($("#buyQty").val() * $("#itemPrice").val());
        $('#cmbItemCode,#itemName,#itemPrice,#qtyOnHand,#buyQty').val("");
        $("#btnAddToCart").attr('disabled', true);
    } else if (duplicate === true) {

        manageQtyOnHand(tableRow.children(':nth-child(4)').text(), $("#buyQty").val());
        $(tableRow).children(':nth-child(4)').text($("#buyQty").val());

        manageTotal(tableRow.children(':nth-child(5)').text(), $("#buyQty").val() * $("#itemPrice").val());
        $(tableRow).children(':nth-child(5)').text($("#buyQty").val() * $("#itemPrice").val());

    }


    $("#tblAddToCart>tr").click('click', function () {

        tableRow = $(this);
        let itemCode = $(this).children(":eq(0)").text();
        let itemName = $(this).children(":eq(1)").text();
        let unitPrice = $(this).children(":eq(2)").text();
        let qty = $(this).children(":eq(3)").text();
        let total = $(this).children(":eq(4)").text();

        $("#cmbItemCode").val(itemCode);
        $("#itemName").val(itemName);
        $("#itemPrice").val(unitPrice);
        $("#buyQty").val(qty);
        $("#txtTotal").val(total);

    });
});


function reduceQty(orderQty) {
    let minQty = parseInt(orderQty);
    let reduceQty = parseInt($("#qtyOnHand").val());
    reduceQty = reduceQty - minQty;
    $("#qtyOnHand").val(reduceQty);
}



function calcTotal(amount) {
    total += amount;
    $("#txtTotal").val(total);
}


function manageQtyOnHand(preQty, nowQty) {
    var preQty = parseInt(preQty);
    var nowQty = parseInt(nowQty);
    let avaQty = parseInt($("#qtyOnHand").val());

    avaQty = avaQty + preQty;
    avaQty = avaQty - nowQty;

    $("#qtyOnHand").val(avaQty);
}



function manageTotal(preTotal, nowTotal) {
    total -= preTotal;
    total += nowTotal;

    $("#txtTotal").val(total);
}


$("#tblAddToCart").empty();
function loadCartTableDetail() {
    itemCode = $("#cmbItemCode").val();
    itemName = $("#itemName").val();
    itemPrice = $("#itemPrice").val();
    itemQty = $("#qtyOnHand").val();
    itemOrderQty = $("#buyQty").val();

    let total = itemPrice * itemOrderQty;
    let row = `<tr><td>${itemCode}</td><td>${itemName}</td><td>${itemPrice}</td><td>${itemOrderQty}</td><td>${total}</td></tr>`;

    $("#tblAddToCart").append(row);
}



$(document).on("change keyup blur", "#buyQty", function () {
    let qtyOnHand = $("#qtyOnHand").val();
    let buyQty = $("#buyQty").val();
    let buyOnHand = qtyOnHand - buyQty;
    if (buyOnHand < 0) {
        $("#lblCheckQty").parent().children('strong').text(qtyOnHand + " : Empty On Stock..!!");
        $("#btnAddToCart").attr('disabled', true);
    } else {
        $("#lblCheckQty").parent().children('strong').text("");
        $("#btnAddToCart").attr('disabled', false);
    }
});



$(document).on("change keyup blur", "#txtDiscount", function () {
    discount = $("#txtDiscount").val();
    discount = (total / 100) * discount;
    subTotal = total - discount;

    $("#txtSubTotal").val(subTotal);
});



$(document).on("change keyup blur", "#txtCash", function () {
    let cash = $("#txtCash").val();
    let balance = cash - subTotal;
    $("#txtBalance").val(balance);
    if (balance < 0) {
        $("#lblCheckSubtotal").parent().children('strong').text(balance + " : plz enter valid Balance");
        $("#btnPurchase").attr('disabled', true);
    } else {
        $("#lblCheckSubtotal").parent().children('strong').text("");
        $("#btnPurchase").attr('disabled', false);
    }
});


function setDates() {

    const date = new Date();

    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);

    const today = date.getFullYear() + "-" + (month) + "-" + (day);

    $('#orderDate').val(today);

}




$("#btnPurchase").click(function () {

    var orderDetails = [];
    for (let i = 0; i < $("#tblAddToCart tr").length; i++) {
        var detailOb = {
            oid: $("#orderId").val(),
            itemCode: $("#tblAddToCart tr").children(':nth-child(1)')[i].innerText,
            qty: $("#tblAddToCart tr").children(':nth-child(4)')[i].innerText,
            unitPrice: $("#tblAddToCart tr").children(':nth-child(5)')[i].innerText
        }
        orderDetails.push(detailOb);
    }
    var orderId = $("#orderId").val();
    var customerId = $("#cmbCustomerId option:selected").text();
    var date = $("#orderDate").val();

    var orderOb = {
        "oid": orderId,
        "date": date,
        "cusID": customerId,
        "orderDetails": orderDetails
    }
    console.log(orderOb)
    console.log(orderDetails)

    $.ajax({
        url: baseUrl + "orders",
        method: "POST",
        headers: { "Authorization": `Bearer ${getToken()}` },
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(orderOb),
        success: function (res) {
            saveUpdateAlert("Order", res.message);
            generateOrderID();

        },
        error: function (error) {
            let message = JSON.parse(error.responseText).message;
            unSuccessUpdateAlert("Order", message);
        }
    });

    clearDetails();
    $("#tblAddToCart").empty();
    // $("#btnPurchase").attr('disabled', true);
    // $("#btnAddToCart").attr('disabled', true);
    total = 0;
});


function clearDetails() {
    $('#cmbCustomerId,#customerName,#customerAddress,#customerSalary,#cmbItemCode,#itemName,#itemPrice,#qtyOnHand,#buyQty,#txtDiscount,#txtTotal,#txtDiscount,#txtSubTotal,#txtCash,#txtBalance').val("");
    $("#tblAddToCart").empty();
    // $("#btnPurchase").attr('disabled', true);
    // $("#btnAddToCart").attr('disabled', true);
}


$("#btnClearAll").click(function () {
    clearDetails();
});



$("#tblAddToCart").dblclick(function () {
    Swal.fire({
        title: 'Do you want to Delete the Select row?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: 'No',
        customClass: {
            actions: 'my-actions',
            cancelButton: 'order-1 right-gap',
            confirmButton: 'order-2',
            denyButton: 'order-3',
        }
    }).then((result) => {
        if (result.isConfirmed) {
            $(this).children('tr').eq(0).remove();
            Swal.fire('Delete!', '', 'success')
        } else if (result.isDenied) {
            Swal.fire('Select row are not Delete', '', 'info')
        }
    })

});
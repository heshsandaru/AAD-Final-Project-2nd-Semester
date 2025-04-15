let baseUrl = "http://localhost:8080/springBoot/";

function loadProducts() {
    $.ajax({
        url: baseUrl + "products/loadAllProduct",
        method: "GET",
        dataType: "json",
        success: function (products) {
            let tableBody = $("#productTableBody");
            tableBody.empty(); // Clear existing data

            products.forEach(product => {
                let row = `<tr>
                        <td>${product.id}</td>
                        <td>${product.name}</td>
                        <td>${product.brand}</td>
                        <td>${product.category}</td>
                        <td>${product.price} $</td>
                        <td><img src="/image/${product.imageFileName}" alt="Image" width="100"></td>
                        <td>${product.createdAt.substring(0, 10)}</td>
                        <td style="white-space:nowrap">
                            <a class="btn btn-primary btn-sm" href="/products/edit?id=${product.id}">Edit</a>
                            <a class="btn btn-danger btn-sm" href="/products/delete?id=${product.id}" onclick="return confirm('Are you sure?')">Delete</a>
                        </td>
                    </tr>`;
                tableBody.append(row);
            });
        },
        error: function (error) {
            console.error("Error fetching products:", error);
        }
    });
}

// Call loadProducts() when the page loads
$(document).ready(function () {
    loadProducts();
});
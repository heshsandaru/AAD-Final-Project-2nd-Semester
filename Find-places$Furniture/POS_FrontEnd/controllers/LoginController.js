document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const username = document.getElementById("name").value;
    const password = document.getElementById("password").value;

    console.log("Attempting login:", username, password);

    try {
        const response = await fetch("http://localhost:8080/springBoot/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();

        if (response.ok && result.state === "200") {
            console.log("Login successful:", result);

            // Save JWT token to localStorage
            localStorage.setItem("token", result.data);

            document.getElementById("message").textContent = "✅ " + result.message;

            /*const role = result.data.role; // assuming role is here, adjust if needed
            if (role === 0) {
                window.location.href = "../pages/place.html";
            } else if (role === 1) {
                window.location.href = "../index.html";
            } else {
                console.warn("Unknown role:", role);
                document.getElementById("message").textContent = "⚠️ Unknown role. Cannot redirect.";
            }*/


            // Redirect to products page after successful login
            window.location.href = "../index.html";
        } else {
            console.warn("Login failed:", result);
            document.getElementById("message").textContent = "❌ " + result.message;
        }
    } catch (error) {
        console.error("Error during login:", error);
        document.getElementById("message").textContent = "❌ Login failed. Please check your credentials and try again.";
    }
});

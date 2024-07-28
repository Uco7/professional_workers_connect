document.addEventListener("DOMContentLoaded", function(){
    const roleSelect = document.querySelector("#role");

    // Function to handle changes in the role select element
    function handleRoleChange() {
        const matric = document.querySelector("#matric");
        const email = document.querySelector("#email");

        const matricLabel = document.querySelector("label[for='matric']");
        const emailLabel = document.querySelector("label[for='email']");
     
        if (roleSelect.value === "admin" || roleSelect.value === "staff") {
            // Hide matric number input and its label
            matric.style.display = "none";
            matricLabel.style.display = "none";

            // Show email input and its label
            email.style.display = "block";
            emailLabel.style.display = "block";

            // Adjust required attributes
            matric.removeAttribute("required");
            email.setAttribute("required", "required");
        } else {
            // Show matric number input and its label
            matric.style.display = "block";
            matricLabel.style.display = "block";

            // Hide email input and its label
            email.style.display = "none";
            emailLabel.style.display = "none";

            // Adjust required attributes
            matric.setAttribute("required", "required");
            email.removeAttribute("required");
        }
    }

    // Add event listener for the role select element
    roleSelect.addEventListener("change", function(e) {
        e.preventDefault();
        handleRoleChange();
    });

    // Call handleRoleChange once on page load
    handleRoleChange();
});

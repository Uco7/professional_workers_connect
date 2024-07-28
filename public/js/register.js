document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("#registrationForm");
    const roleSelect = document.querySelector("#role");
    const phoneDiv= document.getElementById("phoneDiv");

    function handleRoleChange() {
        const fieldsToToggle = [
            "matric",
            "middle_name",
            "department",
            "profile_image"
        ];

        fieldsToToggle.forEach(field => {
            const fieldElement = document.querySelector(`#${field}`);
            const labelElement = document.querySelector(`label[for='${field}']`);

            if (roleSelect.value === "admin") {
                matric.style.display='none';
                fieldElement.style.display='none';
                labelElement.style.display='none';
                fieldElement.removeAttribute("required");
                phoneDiv.style.marginTop='-5rem'
            } else if (roleSelect.value === "staff") {
                if (field === "profile_image") {
                    fieldElement.style.display='block';
                    labelElement.style.display='block';
                    fieldElement.setAttribute("required", "required");
                } else if(field==='matric')   {
                    
                    fieldElement.style.display='none';
                    labelElement.style.display='none';
                    fieldElement.removeAttribute("required");
                }
                else{
                    fieldElement.style.display='block';
                    labelElement.style.display='block';

                }
            } else {
                fieldElement.style.display='block';
                labelElement.style.display='block';
                   phoneDiv.style.marginTop='0'
                fieldElement.setAttribute("required", "required");
            }
        });
    }

    roleSelect.addEventListener("change", handleRoleChange);
    handleRoleChange();

    const regexPatterns = {
        fnameRegex: /^[A-Za-z\s.'-]+$/,
        lnameRegex: /^[A-Za-z\s.'-]+$/,
        m_nameRegex: /^[A-Za-z\s.'-]*$/,
        depregex: /^[A-Za-z\s.\/'-]+$/,  // Adjusted regex
        emailRegex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        passwordRegex: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[\d])(?=.*[\W_]).{8,}$/,
        phone_numberRegex: /^\+?\d{1,4}[-\s]?\d{1,15}$/,
        stateRegex: /^[A-Za-z\s.'-]+$/,
        lgaRegex: /[A-Za-z\s\-'’]+/,
        matricRegex: /^\d{4}\/[A-Z]+\/\d+$/,
        dateRegex: /^\d{4}-\d{2}-\d{2}$/
    };

    const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg"];
    const imageSize = 1048576; // 1MB in bytes

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (validateFormInput()) {
            submitForm();
        }
    });

    function validateFormInput() {
        const errorMessageElements = document.querySelectorAll(".error-message");
        errorMessageElements.forEach(element => element.remove());
        let isValid = true;
        const role = roleSelect.value;

        if (role === "admin") {
            isValid = validateAdmin();
        } else if (role === "staff") {
            isValid = validateStaff();
        } else if (role === "student") {
            isValid = validateStudent();
        }
        return isValid;
    }

    function validateAdmin() {
        return validateCommonFields();
    }

    function validateStaff() {
        let isValid = validateCommonFields();
        isValid = validateProfileImage() && isValid;
        return isValid;
    }

    function validateStudent() {
        let isValid = validateCommonFields();
        const matricField = document.querySelector("#matric");
        const departmentField = document.querySelector("#department");
        const middleField = document.querySelector("#middle_name");

        // Debugging logs
        console.log("Matric Field Value:", matricField.value);
        console.log("Department Field Value:", departmentField.value);
        console.log("Middle Field Value:", middleField.value);

        if (matricField && !regexPatterns.matricRegex.test(matricField.value)) {
            showError(matricField, "Invalid matric number format");
            isValid = false;
        }
        if (departmentField) {
            console.log("Testing Department Regex:", regexPatterns.depregex.test(departmentField.value));
            if (!regexPatterns.depregex.test(departmentField.value)) {  // Using adjusted regex
                showError(departmentField, "Invalid department format");
                isValid = false;
            }
        }
        if (middleField && !regexPatterns.m_nameRegex.test(middleField.value)) {
            showError(middleField, "Invalid middle name format");
            isValid = false;
        }
        isValid = validateProfileImage() && isValid;
        return isValid;
    }

    function validateCommonFields() {
        let isValid = true;
        const fnameField = document.querySelector("#first_name");
        const lnameField = document.querySelector("#last_name");
        const email = document.querySelector("#email");
        const psw = document.querySelector("#password");
        const cpsw = document.querySelector("#cpassword").value;
        const stateOrigin = document.querySelector("#state_of_origin");
        const lga = document.querySelector("#LGA");
        const dob = document.querySelector("#date_of_birth");
        const phoneNumber = document.querySelector("#phone_no");

        if (fnameField && !regexPatterns.fnameRegex.test(fnameField.value)) {
            showError(fnameField, "Invalid first name format");
            isValid = false;
        }
        if (lnameField && !regexPatterns.lnameRegex.test(lnameField.value)) {
            showError(lnameField, "Invalid last name format");
            isValid = false;
        }
        if (email && !regexPatterns.emailRegex.test(email.value)) {
            showError(email, "Invalid email format");
            isValid = false;
        }
        if (psw && !regexPatterns.passwordRegex.test(psw.value)) {
            showError(psw, ` paasword must contain a lower caase latter
            upper case latter
            special character
             a number`);
            isValid = false;
        }
        if (cpsw && cpsw !== psw.value) {
            showError(psw, "Passwords do not match");
            isValid = false;
        }
        if (phoneNumber && !regexPatterns.phone_numberRegex.test(phoneNumber.value)) {
            showError(phoneNumber, "Invalid phone number format");
            isValid = false;
        }
        if (stateOrigin && !regexPatterns.stateRegex.test(stateOrigin.value)) {
            showError(stateOrigin, "Invalid state of origin format");
            isValid = false;
        }
        if (lga && !regexPatterns.lgaRegex.test(lga.value)) {
            showError(lga, "Invalid LGA format");
            isValid = false;
        }
        if (dob && isNaN(Date.parse(dob.value))) {
            showError(dob, "Invalid date format");
            isValid = false;
        } else if (dob && !isAgeValid(dob.value)) {
            showError(dob, "Age must be greater than 18");
            isValid = false;
        }

        return isValid;
    }

    function validateProfileImage() {
        const profileImage = document.querySelector("#profile_image");
        if (profileImage && profileImage.files.length > 0) {
            const file = profileImage.files[0];
            if (!allowedImageTypes.includes(file.type)) {
                showError(profileImage, "File type must be jpg, png, or jpeg");
                return false;
            }
            if (file.size > imageSize) {
                showError(profileImage, "File size must not be greater than 1MB");
                return false;
            }
        }
        return true;
    }

    function isAgeValid(dob) {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();

        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            age--;
        }

        return age > 18;
    }

    function showError(input, message) {
        const error = document.createElement("div");
        error.className = "error-message";
        error.innerText = message;
        input.parentElement.appendChild(error);
    }

    function submitForm() {
        const formData = new FormData(form);
        fetch(form.action, {
            method: "POST",
            body: formData
        })
        .then(response => {
            if (response.redirected) {
                window.location.href = response.url;
                return null;
            }
            return response.json();
        })
        .then(data => {
            if (data && data.error) {
                alert("Error: " + data.error);
            } else if (data) {
                alert("Registration successful");
                form.reset();
            }
        })
        .catch(error => {
            console.error("There was a problem with the fetch operation:", error);
            alert("There was a problem with the registration: " + error.message);
        });
    }
});


document.addEventListener("DOMContentLoaded", function() {
    const cpsw = document.querySelector("#cpassword");
    const psw = document.querySelector("#password");
    const show = document.querySelector("#show");

    show.addEventListener('click', function() {
        if (psw.type === "password") {
            psw.type = "text";
            cpsw.type = "text";
        } else {
            psw.type = "password";
            cpsw.type = "password";
        }
    });
});
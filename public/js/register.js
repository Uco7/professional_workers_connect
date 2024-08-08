document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("#registrationForm");
    const matric = document.querySelector("#matric");
    const middle_name = document.querySelector("#middle_name");
    const  image = document.querySelector("#profile_image");
    const department = document.querySelector("#department");
    const matricLabel = document.querySelector('label[for="matric"]');
    const imageLabel = document.querySelector('label[for="profile_image"]');
    const middle_nameLabel = document.querySelector('label[for="middle_name"]');
    const departmentLabel = document.querySelector('label[for="department"]');

    const roleSelect = document.querySelector("#role");
    const phoneDiv= document.getElementById("phoneDiv");
    const commonFieldInput={
        department,
        middle_name,
        matric,
        matricLabel,
        middle_nameLabel,
        departmentLabel ,
        image,
        imageLabel
    }

    function handleRoleChange() {
        if(roleSelect.value==='admin'){
            commonFieldInput.department.style.display='none';
            commonFieldInput.departmentLabel.style.display='none';
            commonFieldInput.matric.style.display='none';
            commonFieldInput.matricLabel.style.display='none';
            commonFieldInput.middle_name.style.display='none';
            commonFieldInput.middle_nameLabel.style.display='none';
            commonFieldInput.image.style.display='none';
            commonFieldInput.imageLabel.style.display='none';
            commonFieldInput.department.removeAttribute("required")
            commonFieldInput.matric.removeAttribute("required")
            commonFieldInput.department.removeAttribute("required")
            commonFieldInput.image.removeAttribute("required")
            phoneDiv.style.marginTop='-5rem'
         
            }else if(roleSelect.value==='staff'){
                commonFieldInput.department.style.display='none';
                commonFieldInput.departmentLabel.style.display='none';
                commonFieldInput.matric.style.display='none';
                commonFieldInput.matricLabel.style.display='none';
                commonFieldInput.middle_name.style.display='block';
                commonFieldInput.middle_nameLabel.style.display='block';
                commonFieldInput.image.style.display='block';
                commonFieldInput.imageLabel.style.display='block';
                commonFieldInput.department.removeAttribute("required")
                commonFieldInput.matric.removeAttribute("required")
                commonFieldInput.department.removeAttribute("required")
                commonFieldInput.image.setAttribute("required","required")
                 phoneDiv.style.marginTop='-5rem'

            }
            else{
                Object.values(commonFieldInput).forEach(element=>{
                    if(element){
                        element.style.display="block"
                        phoneDiv.style.marginTop='auto'
                        
                    }
                })
            }
            
            // phoneDiv.style.marginTop = '-5rem';
            
            
        
       
    }

    roleSelect.addEventListener("change", handleRoleChange);
    handleRoleChange();

    const regexPatterns = {
        fnameRegex:  /^[A-Za-z\s]{2,}$/,
        lnameRegex:  /^[A-Za-z\s]{2,}$/,
        m_nameRegex:  /^[A-Za-z\s]{2,}$/,
        depregex: /^[A-Za-z\s.\/'-]+$/,  // Adjusted regex
        emailRegex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
         passwordRegex : /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d@$!%*?&<>^.,:;[\]{}()|~`#\-_/\\+=]{4,}$/,
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
        // form.reset()
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
          if(middleField && middleField.value.trim()!==""){

              if (!regexPatterns.m_nameRegex.test(middleField.value)) {
              showError(middleField,`Invalid middle name format:
                    name field must contain at least two letters 
                    name field must not contain special characters.`);
              isValid = false;
          }
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
            showError(fnameField, `Invalid first name format:
                  name field must contain at least two letters 
                   name field must not contain special characters.`);
            isValid = false;
        }
        if (lnameField && !regexPatterns.lnameRegex.test(lnameField.value)) {
            showError(lnameField, `Invalid last name format:
                  name field must contain at least two letters 
                  name field must  not contain special characters.`);
            isValid = false;
        }
        if (email && !regexPatterns.emailRegex.test(email.value)) {
            showError(email, "Invalid email format");
            isValid = false;
        }
        if (psw && !regexPatterns.passwordRegex.test(psw.value)) {
            showError(psw, ` paasword must contain a lower case latter
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
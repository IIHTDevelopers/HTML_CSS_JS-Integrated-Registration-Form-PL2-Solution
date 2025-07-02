(function initializeRegistrationForm() {
  function getEl(id) {
    return typeof document !== "undefined" ? document.getElementById(id) : null;
  }

  const elements = {
    form: getEl('registerForm'),
    name: getEl('name'),
    email: getEl('email'),
    emailCheck: getEl('emailCheck'),
    dob: getEl('dob'),
    age: getEl('age'),
    password: getEl('password'),
    confirmPassword: getEl('confirmPassword'),
    terms: getEl('terms'),
    outputMessage: getEl('outputMessage'),
    submitBtn: getEl('submitBtn'),

    nameError: getEl('nameError'),
    emailError: getEl('emailError'),
    dobError: getEl('dobError'),
    passwordError: getEl('passwordError'),
    confirmPasswordError: getEl('confirmPasswordError'),
    termsError: getEl('termsError')
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const strongPassword = /^(?=.*[!@#$%^&*]).{6,}$/;

  function showFieldError(field, message) {
    const errorEl = elements[`${field.id}Error`];
    if (errorEl) {
      errorEl.textContent = message;
      field.classList.add("highlight-error");
    }
  }

  function clearFieldError(field) {
    const errorEl = elements[`${field.id}Error`];
    if (errorEl) {
      errorEl.textContent = "";
      field.classList.remove("highlight-error");
    }
  }

  function validateField(field) {
    const val = field.value.trim();

    if (field.id === "name") {
      val === "" ? showFieldError(field, "Name is required") : clearFieldError(field);
    }

    if (field.id === "email") {
      !emailRegex.test(val) ? showFieldError(field, "Invalid email") : clearFieldError(field);
    }

    if (field.id === "dob") {
      val === "" ? showFieldError(field, "Date of birth is required") : clearFieldError(field);
    }

    if (field.id === "password") {
      !strongPassword.test(val)
        ? showFieldError(field, "Password must be 6+ chars and include a special character")
        : clearFieldError(field);
    }

    if (field.id === "confirmPassword") {
      val !== elements.password.value
        ? showFieldError(field, "Passwords do not match")
        : clearFieldError(field);
    }
  }

  function calculateAge() {
    const dobVal = elements.dob.value;
    const dobDate = new Date(dobVal);
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const m = today.getMonth() - dobDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }
    elements.age.value = dobVal ? age : '';
  }

  function toggleVisibility(id) {
    const field = getEl(id);
    if (field) {
      field.type = field.type === "password" ? "text" : "password";
    }
  }

  function isFormCompletelyValid() {
    const isNameValid = elements.name.value.trim() !== "";
    const isEmailValid = emailRegex.test(elements.email.value.trim());
    const isDobValid = elements.dob.value.trim() !== "";
    const isPasswordValid = strongPassword.test(elements.password.value.trim());
    const isConfirmValid = elements.confirmPassword.value.trim() === elements.password.value.trim();
    const isTermsChecked = elements.terms.checked;

    return isNameValid && isEmailValid && isDobValid && isPasswordValid && isConfirmValid && isTermsChecked;
  }

  function updateSubmitState() {
    elements.submitBtn.disabled = !isFormCompletelyValid();
  }

  function validateForm() {
    validateField(elements.name);
    validateField(elements.email);
    validateField(elements.dob);
    validateField(elements.password);
    validateField(elements.confirmPassword);

    const hasError = document.querySelectorAll(".highlight-error").length > 0;
    if (!elements.terms.checked) {
      elements.termsError.textContent = "You must accept terms";
    } else {
      elements.termsError.textContent = "";
    }

    const valid = !hasError && elements.terms.checked;

    elements.outputMessage.textContent = valid
      ? "Registration successful!"
      : "Please fix the errors above.";
    elements.outputMessage.className = valid ? "success" : "error";

    updateSubmitState();
  }

  function clearForm() {
    elements.form.reset();
    elements.age.value = "";
    elements.outputMessage.textContent = "";
    elements.emailCheck.textContent = "";
    elements.submitBtn.disabled = true;

    Object.keys(elements).forEach(key => {
      if (key.endsWith('Error')) elements[key].textContent = "";
    });

    const inputElements = elements.form.querySelectorAll("input");
    inputElements.forEach(el => el.classList.remove("highlight-error"));
  }

  function setupEvents() {
    elements.form.addEventListener("submit", function (e) {
      e.preventDefault();
      validateForm();
    });

    elements.terms.addEventListener("change", updateSubmitState);

    ["name", "email", "dob", "password", "confirmPassword"].forEach((id) => {
      const field = elements[id];
      if (!field) return;

      field.addEventListener("blur", () => {
        validateField(field);
        updateSubmitState();
      });

      field.addEventListener("input", () => {
        validateField(field);
        updateSubmitState();

        if (id === "email") {
          elements.emailCheck.textContent = emailRegex.test(field.value) ? "✓" : "";
        }
      });
    });

    elements.dob.addEventListener("blur", calculateAge);

    if (typeof window !== "undefined") {
      window.toggleVisibility = toggleVisibility;
      window.clearForm = clearForm;
    }
  }

  function init() {
    setupEvents();
    updateSubmitState(); // disable on load
  }

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  }
})();

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("booking-form");
  
    const requiredFields = [
      { id: "name", type: "text" },
      { id: "email", type: "email" },
      { id: "address", type: "select" },
      { id: "apartmentNumber", type: "select" },
      { id: "startDate", type: "date" },
      { id: "endDate", type: "date" }
    ];
  
    function validateField(field) {
      const input = document.getElementById(field.id);
      const errorEl = document.getElementById(`${field.id}-error`);
      const value = input.value.trim();
  
      let isValid = true;
      let message = "";
  
      if (!value) {
        message = "This field is required.";
        isValid = false;
      } else if (field.type === "email") {
        const emailPattern = /^[^@]+@[^@]+\.[^@]+$/;
        if (!emailPattern.test(value)) {
          message = "Please enter a valid email.";
          isValid = false;
        }
      }
  
      if (!isValid) {
        input.classList.add("invalid");
        errorEl.textContent = message;
        errorEl.style.display = "block";
      } else {
        input.classList.remove("invalid");
        errorEl.textContent = "";
        errorEl.style.display = "none";
      }
  
      return isValid;
    }
  
    // Validate on submit
    form.addEventListener("submit", function (event) {
      let hasError = false;
  
      requiredFields.forEach(field => {
        if (!validateField(field)) {
          hasError = true;
        }
      });
  
      if (hasError) {
        event.preventDefault();
      }
    });
  
    // Real-time validation on input or change
    requiredFields.forEach(field => {
      const input = document.getElementById(field.id);
      const eventType = field.type === "select" ? "change" : "input";
  
      input.addEventListener(eventType, () => validateField(field));
    });

});
  
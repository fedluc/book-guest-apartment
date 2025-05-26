document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("booking-form");
    const messageBox = document.getElementById("message");
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      messageBox.textContent = "";
      messageBox.className = "";
  
      const formData = new FormData(form);
      const start = new Date(formData.get("startDate"));
      const end = new Date(formData.get("endDate"));
      const now = new Date();
  
      // Rule 1: Start date cannot be in the past
      if (start < now) {
        messageBox.textContent = "❌ The start date cannot be in the past.";
        messageBox.className = "error";
        return;
      }
  
      // Rule 2: Start date must be within three months
      const threeMonthsFromNow = new Date();
      threeMonthsFromNow.setMonth(now.getMonth() + 3);
      if (start > threeMonthsFromNow) {
        messageBox.textContent = "❌ The start date must be within three months from today.";
        messageBox.className = "error";
        return;
      }
  
      // Rule 3: End date cannot be earlier than start date
      if (end < start) {
        messageBox.textContent = "❌ The end date cannot be earlier than the start date.";
        messageBox.className = "error";
        return;
      }
  
      // Rule 4: Booking cannot be longer than four days
      const maxBookingLength = 4 * 24 * 60 * 60 * 1000;
      if (end.getTime() - start.getTime() > maxBookingLength) {
        messageBox.textContent = "❌ The booking cannot be longer than 4 days.";
        messageBox.className = "error";
        return;
      }
  
      try {
        const scriptUrl = window.ENV.SCRIPT_URL;
        const body = new URLSearchParams(formData);
        const response = await fetch(scriptUrl, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body
        });
  
        const text = await response.text();
  
        if (response.ok && text.includes("Booking confirmed")) {
          messageBox.textContent = "✅ Booking successfully submitted!";
          messageBox.className = "success";
          form.reset();
        } else {
          messageBox.textContent = "❌ Error from server: " + text;
          messageBox.className = "error";
        }
      } catch (err) {
        messageBox.textContent = "❌ Network error: " + err.message;
        messageBox.className = "error";
      }
    });
  });
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
  
      // Reject invalid bookings
      const honeypot = formData.get("website");
      if (honeypot) {
        messageBox.textContent = "❌ Submission blocked.";
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
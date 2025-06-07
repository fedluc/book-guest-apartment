function doPost(e) {
  // Validate recaptcha
  const recaptchaToken = e.parameter["g-recaptcha-response"];
  if (!verifyRecaptcha(recaptchaToken)) {
    return ContentService.createTextOutput("reCAPTCHA verification failed. Please try again.");
  } 
  // Log submission
  logSubmission(e);
  // Handle booking request
  const message = handleBookingRequest(e.parameter);
  // Return log message
  return ContentService.createTextOutput(message);
}

function doGet() {
  return getAllBookings();
}



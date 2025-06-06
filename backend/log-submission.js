function logSubmission(e) {
  const ip = (e.headers && e.headers["X-Forwarded-For"]) || "unknown";
  const email = e.parameter.email;
  const bookingLog = getBookingLog();
  const now = new Date();
  bookingLog.appendRow([now.toISOString(), ip, email]);
}
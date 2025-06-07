function getAllBookings() {
  const calendar = getCalendar();
  // Fetch events between today and three months from now
  const today = new Date();
  const threeMonthsFromNow = new Date();
  threeMonthsFromNow.setMonth(today.getMonth() + 3);
  const events = calendar.getEvents(today, threeMonthsFromNow);
  // Map the events to an array of booking objects with start and end times
  const bookings = events.map(event => ({
    start: event.getStartTime().toISOString(),
    end: event.getEndTime().toISOString()
  }));
  // Return the bookings as a JSON response
  return ContentService
    .createTextOutput(JSON.stringify(bookings))
    .setMimeType(ContentService.MimeType.JSON);
}

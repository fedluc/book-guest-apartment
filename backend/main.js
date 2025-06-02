function doPost(e) {
  const params = e.parameter;

  // Validate recaptcha
  const recaptchaToken = e.parameter["g-recaptcha-response"];
  if (!verifyRecaptcha(recaptchaToken)) {
    return ContentService.createTextOutput("reCAPTCHA verification failed. Please try again.");
  } 

  // Log submission
  logSubmission(e);

  // Extract inputs from custom form
  const name = params.name;
  const email = params.email;
  const address = params.address;
  const apartmentNumber = params.apartmentNumber;
  const startDate = new Date(params.startDate);
  const endDate = new Date(params.endDate);

  // Set start and end hours to 12:00 PM
  startDate.setHours(12, 0, 0, 0);
  endDate.setHours(12, 0, 0, 0);

  const calendarId = PropertiesService.getScriptProperties().getProperty("CALENDAR_ID");
  const calendar = CalendarApp.getCalendarById(calendarId);

  const bookingSummary = formatBookingSummary(startDate, endDate, address, apartmentNumber);
  const now = new Date();

  // Rule 1: Double bookings are not allowed
  const threeMonthsFromNow = new Date();
  threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
  const futureEvents = calendar.getEvents(now, threeMonthsFromNow);
  const userIdentifier = `${address.trim().toLowerCase()}|${apartmentNumber.trim().toLowerCase()}`;
  for (let event of futureEvents) {
    const desc = event.getDescription().toLowerCase();
    if (desc.includes(userIdentifier)) {
      return ContentService.createTextOutput("You already have a future booking. Only one booking is allowed at a time.");
    }
  }

  // Rule 2: The dates must be available
  const existingEvents = calendar.getEvents(startDate, endDate);
  if (existingEvents.length > 0) {
    return ContentService.createTextOutput("Sorry, the apartment is already booked for the selected dates.");
  }

  // Add to calendar
  calendar.createEvent("Guest apartment booking", startDate, endDate, {
    description: `Requested by: ${name}\nEmail: ${email}\nIdentifier: ${userIdentifier}`,
    guests: email,
    visibility: CalendarApp.Visibility.PRIVATE,
  });

  // Send confirmation
  const confirmationMessage =
    `Hello ${name},\n\n` +
    `Your booking is confirmed with the following details:\n\n` +
    bookingSummary +
    "\nBest regards,\nThe board";
  MailApp.sendEmail(email, "Booking Confirmed", confirmationMessage);

  return ContentService.createTextOutput("Booking confirmed");
}

function formatBookingSummary(startDate, endDate, address, apartmentNumber) {
  return (
    `📅 Dates: ${startDate.toDateString()} to ${endDate.toDateString()}\n` +
    `🏠 Address: ${address}\n` +
    `🔢 Apartment Number: ${apartmentNumber}\n`
  );
}


function doGet() {
  const calendarId = PropertiesService.getScriptProperties().getProperty("CALENDAR_ID");
  const calendar = CalendarApp.getCalendarById(calendarId);

  const today = new Date();
  const threeMonthsFromNow = new Date();
  threeMonthsFromNow.setMonth(today.getMonth() + 3);

  const events = calendar.getEvents(today, threeMonthsFromNow);
  const bookedDates = new Set();

  for (let event of events) {
    const start = new Date(event.getStartTime());
    const end = new Date(event.getEndTime());
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      bookedDates.add(`${yyyy}-${mm}-${dd}`);
    }
  }
  return ContentService
    .createTextOutput(JSON.stringify([...bookedDates]))
    .setMimeType(ContentService.MimeType.JSON);
}
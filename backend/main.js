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

   // Check the booking rules
   const now = new Date();

   // Rule 1: The start date cannot be earlier than one week from now
   const oneWeekFromToday = new Date();
   oneWeekFromToday.setDate(now.getDate() + 7);
   if (startDate < oneWeekFromToday) {
     return ContentService.createTextOutput("The start date cannot be in less than one week.");
   }
 
   // Rule 2: The start date must be within three months
   const threeMonthsFromNow = new Date();
   threeMonthsFromNow.setMonth(now.getMonth() + 3);
   if (startDate > threeMonthsFromNow) {
     return ContentService.createTextOutput("The start date must be within three months from today.");
   }
 
   // Rule 3: The end date cannot be earlier than the start date
   if (endDate < startDate) {
     return ContentService.createTextOutput("The end date cannot be earlier than the start date.");
   }
 
   // Rule 4: The booking cannot be longer than four days
   const maxBookingLength = 4 * 24 * 60 * 60 * 1000; // 4 days in milliseconds
   if (endDate.getTime() - startDate.getTime() > maxBookingLength) {
     return ContentService.createTextOutput("The booking cannot be longer than 4 days.");
   }

  // Rule 5: Double bookings are not allowed
  const futureEvents = calendar.getEvents(now, threeMonthsFromNow);
  const userIdentifier = `${address.trim().toLowerCase()}|${apartmentNumber.trim().toLowerCase()}`;
  for (let event of futureEvents) {
    const desc = event.getDescription().toLowerCase();
    if (desc.includes(userIdentifier)) {
      return ContentService.createTextOutput("You already have a future booking. Only one booking is allowed at a time.");
    }
  }

  // Rule 6: The dates must be available
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
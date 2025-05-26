function doPost(e) {
  const params = e.parameter;

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

  // Log to Google Sheet
  const spreadSheetId = PropertiesService.getScriptProperties().getProperty("SPREAD_SHEET_ID");
  const spreadsheet = SpreadsheetApp.openById(spreadSheetId);
  let sheet = spreadsheet.getSheetByName("Form Responses 1");
  if (!sheet) {
    sheet = spreadsheet.insertSheet("Form Responses 1");
    sheet.appendRow(["Timestamp", "Name", "Email", "Address", "Apartment Number", "Start Date", "End Date"]);
  }   
  sheet.appendRow([new Date(), name, email, address, apartmentNumber, startDate, endDate]);

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

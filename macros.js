function onFormSubmit(e) {
  // Inputs from the Google Form
  const responses = e.values;
  const name = responses[1];
  const email = responses[2];
  const address = responses[3];
  const apartmentNumber = responses[4];
  const startDate = new Date(responses[5]);
  const endDate = new Date(responses[6]);

  // Set start and end hours to 12:00 PM (midday)
  startDate.setHours(12, 0, 0, 0);
  endDate.setHours(12, 0, 0, 0);

  // Link to the shared calendar
  const calendar = CalendarApp.getCalendarById(
    "6d13e680a196fefdfba91905da8f438cecb101fad07c211c91c67e20f2c6d363@group.calendar.google.com"
  );

  // Booking summary to add to the email
  const bookingSummary = formatBookingSummary(startDate, endDate, address, apartmentNumber);

  // Check the booking rules
  const now = new Date();

  // Rule 1: The start date cannot be in the past
  if (startDate < now) {
    sendDenial(email, name, "The start date cannot be in the past.", bookingSummary);
    return;
  }

  // Rule 2: The start date must be within three months
  const threeMonthsFromNow = new Date();
  threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
  if (startDate > threeMonthsFromNow) {
    sendDenial(email, name, "The start date must be within three months from today.", bookingSummary);
    return;
  }

  // Rule 3: The end date cannot be earlier than the start date
  if (endDate < startDate) {
    sendDenial(email, name, "The end date cannot be earlier than the start date.", bookingSummary);
    return;
  }

  // Rule 4: The booking cannot be longer than four days
  const maxBookingLength = 4 * 24 * 60 * 60 * 1000; // 4 days in milliseconds
  if (endDate.getTime() - startDate.getTime() > maxBookingLength) {
    sendDenial(email, name, "The booking cannot be longer than 4 days.", bookingSummary);
    return;
  }

  // Rule 5: Double bookings are not allowed
  const futureEvents = calendar.getEvents(now, threeMonthsFromNow);
  const userIdentifier = `${address.trim().toLowerCase()}|${apartmentNumber.trim().toLowerCase()}`;
  for (let event of futureEvents) {
    const desc = event.getDescription().toLowerCase();
    if (desc.includes(userIdentifier)) {
      sendDenial(
        email,
        name,
        "You already have a future booking. Only one booking is allowed at a time.",
        bookingSummary
      );
      return;
    }
  }

  // Rule 6: The dates must be available
  const existingEvents = calendar.getEvents(startDate, endDate);
  if (existingEvents.length > 0) {
    sendDenial(email, name, "Sorry, the apartment is already booked for the selected dates.");
    return;
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
}

function sendDenial(email, name, reason, bookingSummary) {
  const denialMessage =
    `Hello ${name},\n\n` +
    `${reason}\n\n` +
    `Here’s a summary of your request:\n\n` +
    bookingSummary +
    "\nBest regards,\nThe board";
  MailApp.sendEmail(email, "Booking Request Denied", denialMessage);
}

function formatBookingSummary(startDate, endDate, address, apartmentNumber) {
  return (
    `📅 Dates: ${startDate.toDateString()} to ${endDate.toDateString()}\n` +
    `🏠 Address: ${address}\n` +
    `🔢 Apartment Number: ${apartmentNumber}\n`
  );
}

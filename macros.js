function onFormSubmit(e) {
  // Inputs from the google form
  const responses = e.values;
  const name = responses[1];
  const email = responses[2];
  const address = responses[3];
  const apartmentNumber = responses[4];
  const startDate = new Date(responses[5]);
  const endDate = new Date(responses[6]);
  
  // Set start and end hours to 12.00 pm (midday)
  startDate.setHours(12, 0, 0, 0);
  endDate.setHours(12, 0, 0, 0);

  // Link to the shared calendar
  const calendar = CalendarApp.getCalendarById("6d13e680a196fefdfba91905da8f438cecb101fad07c211c91c67e20f2c6d363@group.calendar.google.com");

  // Booking rules
  const now = new Date();
  const threeMonthsFromNow = new Date();
  threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
  const maxBookingLength = 4 * 24 * 60 * 60 * 1000; // 4 days in milliseconds
  if (startDate < now) {
    sendDenial(email, name, "The start date cannot be in the past.");
    return;
  }
  if (startDate > threeMonthsFromNow) {
    sendDenial(email, name, "The start date must be within three months from today.");
    return;
  }
  if (endDate < startDate) {
    sendDenial(email, name, "The end date cannot be earlier than the start date.");
    return;
  }
  if (endDate.getTime() - startDate.getTime() > maxBookingLength) {
    sendDenial(email, name, "The booking cannot be longer than 4 days.");
    return;
  }

  // Check if this address+apartmentNumber already has a future booking
  const futureEvents = calendar.getEvents(now, threeMonthsFromNow);
  const userIdentifier = `${address.trim().toLowerCase()}|${apartmentNumber.trim().toLowerCase()}`;
  for (let event of futureEvents) {
    const desc = event.getDescription().toLowerCase();
    if (desc.includes(userIdentifier)) {
      sendDenial(email, name, "You already have a future booking. Only one booking is allowed at a time.");
      return;
    }
  }

  // Check for overlapping events
  const existingEvents = calendar.getEvents(startDate, endDate);
  if (existingEvents.length > 0) {
    sendDenial(email, name, "Sorry, the apartment is already booked for the selected dates.");
    return;
  }

  // Add to calendar
  calendar.createEvent(
    `Guest apartment booking`,
    startDate,
    endDate,
    {
      description: `Requested by: ${name}\nEmail: ${email}\nIdentifier: ${userIdentifier}`,
      guests: email,
      visibility: CalendarApp.Visibility.PRIVATE
    }
  );


  // Send confirmation
  const confirmationMessage = 
    `Hello ${name},\n\n` +
    `Your booking from ${startDate.toDateString()} to ${endDate.toDateString()} is confirmed.\n\n` +
    "Best regards,\nThe board";
  MailApp.sendEmail(email, "Booking Confirmed", confirmationMessage);
}

function sendDenial(email, name, reason) {
  const denialMessage = 
    `Hello ${name},\n\n` +
    `${reason}\n\n` +
    "Best regards,\nThe board";
  MailApp.sendEmail(email, "Booking Request Denied", denialMessage);
}

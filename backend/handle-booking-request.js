class BookingInfo {
    constructor(params) {
        this.name = params.name;
        this.email = params.email;
        this.address = params.address;
        this.apartmentNumber = params.apartmentNumber;
        this.startDate = new Date(params.startDate);
        this.endDate = new Date(params.endDate);
        // Normalize times to 12:00 PM
        this.startDate.setHours(12, 0, 0, 0);
        this.endDate.setHours(12, 0, 0, 0);
    }

    getUserIdentifier() {
        return `${this.address.trim().toLowerCase()}|${this.apartmentNumber.trim().toLowerCase()}`;
    }
}

function handleBookingRequest(params) {
    // Extract parameters from the request
    const info = new BookingInfo(params);
    // Validate booking rules and return an error message if validation fails
    const validationError = validateBookingRules(info);
    if (validationError) {
        return validationError;
    }
    // Add event to the calendar
    createEvent(info);
    // Prepare and send a confirmation email to the user
    sendConfirmationEmail(info);
    // Return a success message
    return "Booking confirmed";
}

function validateBookingRules(info) {
    const startDate = info.startDate;
    const endDate = info.endDate;
    const calendar = getCalendar();
    const now = new Date();
    const oneWeekFromToday = new Date(now);
    oneWeekFromToday.setDate(now.getDate() + 7);
    oneWeekFromToday.setHours(12, 0, 0, 0);
    // Rule 1: The start date must be at least one week from today.
    if (info.startDate < oneWeekFromToday) {
        return "The start date cannot be in less than one week.";
    }
    // Rule 2: The start date must be within three months from today.
    const threeMonthsFromNow = new Date(now);
    threeMonthsFromNow.setMonth(now.getMonth() + 3);
    if (startDate > threeMonthsFromNow) {
        return "The start date must be within three months from today.";
    }
    // Rule 3: The end date cannot be earlier than the start date.
    if (endDate < startDate) {
        return "The end date cannot be earlier than the start date.";
    }
    // Rule 4: The booking duration cannot exceed 4 days.
    const MILLISECONDS_IN_A_DAY = 24 * 60 * 60 * 1000;
    const maxBookingLength = 4 * MILLISECONDS_IN_A_DAY;
    if (endDate.getTime() - startDate.getTime() > maxBookingLength) {
        return "The booking cannot be longer than 4 days.";
    }
    // Rule 5: A user can only have one future booking at a time.
    const futureEvents = calendar.getEvents(now, threeMonthsFromNow);
    const userIdentifier = info.getUserIdentifier();
    for (let event of futureEvents) {
        const desc = event.getDescription().toLowerCase();
        if (desc.includes(userIdentifier)) {
            return "You already have a future booking. Only one booking is allowed at a time.";
        }
    }
    // Rule 6: The apartment must not be already booked for the selected dates.
    const existingEvents = calendar.getEvents(startDate, endDate);
    if (existingEvents.length > 0) {
        return ContentService.createTextOutput("Sorry, the apartment is already booked for the selected dates.");
    }
    // If all rules are satisfied, return null (no validation errors).
    return null;
}

function createEvent(info) {
    const calendar = getCalendar();
    const userIdentifier = info.getUserIdentifier();
    // Create a calendar event for the booking
    calendar.createEvent("Guest apartment booking", info.startDate, info.endDate, {
        description: `Requested by: ${info.name}\nEmail: ${info.email}\nIdentifier: ${userIdentifier}`,
        guests: info.email,
        visibility: CalendarApp.Visibility.PRIVATE,
    });
}

function sendConfirmationEmail(info) {
    const bookingSummary = formatBookingSummary(info);
    const confirmationMessage = `Hello ${info.name},\n\n` +
        `Your booking is confirmed with the following details:\n\n` +
        bookingSummary +
        "\nBest regards,\nThe board";
    MailApp.sendEmail(info.email, "Booking Confirmed", confirmationMessage);
}

function formatBookingSummary(info) {
    return (
        `📅 Dates: ${info.startDate.toDateString()} to ${info.endDate.toDateString()}\n` +
        `🏠 Address: ${info.address}\n` +
        `🔢 Apartment Number: ${info.apartmentNumber}\n`
    );
}
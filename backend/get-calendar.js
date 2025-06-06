function getCalendar() {
    const calendarId = getProperty("CALENDAR_ID");
    const calendar = CalendarApp.getCalendarById(calendarId);
    return calendar;
}

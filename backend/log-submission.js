function logSubmission(e) {
  const email = e.parameter.email;
  const ip = e.headers["X-Forwarded-For"] || "unknown";
  const sheetId = PropertiesService.getScriptProperties().getProperty("BOOKING_LOG_SHEET_ID");
  const sheet = SpreadsheetApp.openById(sheetId).getSheets()[0];
  const now = new Date();
  sheet.appendRow([now.toISOString(), ip, email]);
}
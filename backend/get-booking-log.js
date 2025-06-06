function getBookingLog() {
  const sheetId = getProperty("BOOKING_LOG_SHEET_ID");
  const spreadsheet = SpreadsheetApp.openById(sheetId);
  const sheets = spreadsheet.getSheets();
  if (sheets.length === 0) {
    throw new Error("No sheets found in the spreadsheet.");
  }
  return sheets[0];
}

function isRateLimited(e, limitMinutes) {
  const ip = e.headers["X-Forwarded-For"] || "unknown";
  const sheetId = PropertiesService.getScriptProperties().getProperty("BOOKING_LOG_SHEET_ID");
  const sheet = SpreadsheetApp.openById(sheetId).getSheets()[0];
  const now = new Date();

  const rows = sheet.getDataRange().getValues().filter((row, i) => i !== 0); // Skip header

  for (let row of rows.reverse()) { // Newest first
    const [timestampStr, loggedIp] = row;
    if (loggedIp === ip) {
      const lastTime = new Date(timestampStr);
      const diffMinutes = (now - lastTime) / 1000 / 60;
      if (diffMinutes < limitMinutes) {
        return {
          limited: true,
          retryAfter: Math.ceil(limitMinutes - diffMinutes)
        };
      } else {
        break; // Found match, but it's old enough
      }
    }
  }
  return { limited: false };
}
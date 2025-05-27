function cleanupLogs(days = 30) {
    const sheetId = PropertiesService.getScriptProperties().getProperty("BOOKING_LOG_SHEET_ID");
    const sheet = SpreadsheetApp.openById(sheetId).getSheets()[0];
    const data = sheet.getDataRange().getValues();
    const now = new Date();
    const threshold = now.getTime() - days * 24 * 60 * 60 * 1000;
    const filtered = data.filter((row, i) => {
      if (i === 0) return true; // keep header
      const timestamp = new Date(row[0]);
      return timestamp.getTime() > threshold;
    });
    sheet.clear();
    sheet.getRange(1, 1, filtered.length, filtered[0].length).setValues(filtered);
  }
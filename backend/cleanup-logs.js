function cleanupLogs(days = 30) {
  //  Retrieve all data from the booking log
  const bookingLog = getBookingLog();
  const data = bookingLog.getDataRange().getValues();
  // Calculate the threshold timestamp for filtering logs
  const now = new Date();
  const MILLISECONDS_IN_A_DAY = 24 * 60 * 60 * 1000;
  const threshold = now.getTime() - days * MILLISECONDS_IN_A_DAY;
  // Filter the data to keep only rows with timestamps within the threshold
  const filtered = data.filter((row, i) => {
    if (i === 0) return true; // Keep the header row
    const timestamp = new Date(row[0]); // Assume the first column contains timestamps
    return timestamp.getTime() > threshold; // Keep rows with timestamps above the threshold
  });
  // Clear the existing booking log
  bookingLog.clear();
  // Write the filtered data back to the booking log
  bookingLog.getRange(1, 1, filtered.length, filtered[0].length).setValues(filtered);
}



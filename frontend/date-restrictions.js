document.addEventListener("DOMContentLoaded", async function () {
  // Get references to the start and end date input elements
  const startInput = document.getElementById("startDate");
  const endInput = document.getElementById("endDate");

  // Define date boundaries: today, one week from today, and three months from today
  const today = new Date();
  const oneWeekFromToday = new Date();
  oneWeekFromToday.setDate(today.getDate() + 7);
  const threeMonthsFromToday = new Date();
  threeMonthsFromToday.setMonth(today.getMonth() + 3);

  let disabledDates = [];

  try {
    // Fetch disabled dates from the server
    const response = await fetch(window.ENV.SCRIPT_URL);
    if (response.ok) {
      const original = await response.json(); // Example: ['2025-06-01', '2025-06-03', ...]
      const disabledSet = new Set(original);

      // Extend the disabled dates by adding intermediate "lonely" dates
      const extended = [...original.map(date => new Date(date))].sort((a, b) => a - b);

      for (let i = 1; i < extended.length; i++) {
        const prev = extended[i - 1];
        const next = extended[i];
        const gap = (next - prev) / (1000 * 60 * 60 * 24); // Calculate the gap in days

        // If the gap is exactly 2 days, add the intermediate date to the disabled set
        if (gap === 2) {
          const middle = new Date(prev);
          middle.setDate(middle.getDate() + 1);
          const iso = middle.toISOString().split('T')[0];
          disabledSet.add(iso);
        }
      }

      // Convert the set of disabled dates back to a sorted array
      disabledDates = Array.from(disabledSet).sort();
    }
  } catch (err) {
    // Log an error if fetching disabled dates fails
    console.error("Failed to fetch disabled dates", err);
  }

  // Initialize the start date picker
  const startPicker = flatpickr(startInput, {
    dateFormat: "Y-m-d", // Format for the date picker
    minDate: oneWeekFromToday, // Minimum selectable date
    maxDate: threeMonthsFromToday, // Maximum selectable date
    disable: disabledDates, // Dates to disable
    onChange: function (selectedDates) {
      // Handle changes to the start date
      if (selectedDates.length === 0) {
        // Clear and disable the end date picker if no start date is selected
        endInput._flatpickr.clear();
        endInput.disabled = true;
        return;
      }

      const selectedStart = selectedDates[0];
      const minEnd = new Date(selectedStart);
      minEnd.setDate(minEnd.getDate() + 1); // Minimum end date is one day after the start date

      const maxEnd = new Date(selectedStart);
      maxEnd.setDate(maxEnd.getDate() + 3); // Maximum end date is three days after the start date

      endInput.disabled = false; // Enable the end date picker

      // Update the end date picker's constraints
      endInput._flatpickr.set("minDate", minEnd);
      endInput._flatpickr.set("maxDate", maxEnd);
      endInput._flatpickr.set("disable", disabledDates);

      // Ensure the currently selected end date is within the valid range
      const currentEndDate = endInput._flatpickr.selectedDates[0];
      if (!currentEndDate || currentEndDate < minEnd || currentEndDate > maxEnd) {
        endInput._flatpickr.setDate(minEnd, true); // Set the end date to the minimum valid date
      }
    }
  });

  // Initialize the end date picker
  flatpickr(endInput, {
    dateFormat: "Y-m-d", // Format for the date picker
    disable: disabledDates // Dates to disable
  });

  // Initially disable the end date picker
  endInput.disabled = true;
});

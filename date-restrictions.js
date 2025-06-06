document.addEventListener("DOMContentLoaded", async function () {
  const startInput = document.getElementById("startDate");
  const endInput = document.getElementById("endDate");

  const today = new Date();
  const oneWeekFromToday = new Date(today);
  oneWeekFromToday.setDate(today.getDate() + 7);

  const threeMonthsFromToday = new Date(today);
  threeMonthsFromToday.setMonth(today.getMonth() + 3);

  let bookings = [];

  // ---------------------
  // Helper functions
  // ---------------------

  function parseDate(dateStr) {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
  }

  function formatISODate(date) {
    if (!(date instanceof Date) || isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  }

  function isOverlap(start1, end1, start2, end2) {
    return start1 < end2 && start2 < end1;
  }

  // ---------------------
  // Modular booking logic
  // ---------------------

  function getBlockedStartDates(bookings, minDate, maxDate) {
    const blocked = new Set();
    const cursor = new Date(minDate);

    while (cursor <= maxDate) {
      const start = new Date(cursor);
      start.setHours(12, 0, 0, 0);
      let valid = false;

      for (let d = 1; d <= 4; d++) {
        const end = new Date(start);
        end.setDate(end.getDate() + d);
        if (!bookings.some(b =>
          isOverlap(start, end, parseDate(b.start), parseDate(b.end))
        )) {
          valid = true;
          break;
        }
      }

      if (!valid) blocked.add(formatISODate(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }

    return blocked;
  }

  function getBlockedEndDates(startDate, bookings) {
    const blocked = new Set();
    const start = new Date(startDate);
    start.setHours(12, 0, 0, 0);

    for (let d = 1; d <= 4; d++) {
      const end = new Date(start);
      end.setDate(end.getDate() + d);
      end.setHours(12, 0, 0, 0);

      const hasConflict = bookings.some(b =>
        isOverlap(start, end, parseDate(b.start), parseDate(b.end))
      );

      if (hasConflict) {
        blocked.add(formatISODate(end));
      }
    }

    return blocked;
  }

  // ---------------------
  // Fetch bookings
  // ---------------------

  try {
    const response = await fetch(window.ENV.BACKEND_URL);
    if (response.ok) {
      bookings = await response.json(); // array of { start, end }
    }
  } catch (err) {
    console.error("Failed to fetch bookings", err);
  }

  const blockedStartDates = getBlockedStartDates(bookings, oneWeekFromToday, threeMonthsFromToday);

  // ---------------------
  // Init Start Picker
  // ---------------------

  const startPicker = flatpickr(startInput, {
    dateFormat: "Y-m-d",
    minDate: oneWeekFromToday,
    maxDate: threeMonthsFromToday,
    disable: [...blockedStartDates],
    disableMobile: true,
    onChange: function (selectedDates) {
      if (selectedDates.length === 0) {
        endInput._flatpickr.clear();
        endInput.disabled = true;
        return;
      }

      const selectedStart = selectedDates[0];
      const blockedEndDates = getBlockedEndDates(selectedStart, bookings);

      const noonStart = new Date(selectedStart);
      noonStart.setHours(12, 0, 0, 0);
      const minEnd = new Date(noonStart);
      minEnd.setDate(minEnd.getDate() + 1);
      const maxEnd = new Date(noonStart);
      maxEnd.setDate(maxEnd.getDate() + 4);

      endInput.disabled = false;

      endInput._flatpickr.set("minDate", minEnd);
      endInput._flatpickr.set("maxDate", maxEnd);
      endInput._flatpickr.set("disable", [...blockedEndDates]);

      const currentEndDate = endInput._flatpickr.selectedDates[0];
      const isValid = currentEndDate &&
        !blockedEndDates.has(formatISODate(currentEndDate));

      if (!isValid) {
        const defaultValid = new Date(minEnd);
        for (let i = 0; i <= 3; i++) {
          const tryDate = new Date(defaultValid);
          tryDate.setDate(defaultValid.getDate() + i);
          if (!blockedEndDates.has(formatISODate(tryDate))) {
            endInput._flatpickr.setDate(tryDate, true);
            return;
          }
        }
        endInput._flatpickr.clear();
      }
    }
  });

  // ---------------------
  // Init End Picker (disabled by default)
  // ---------------------

  flatpickr(endInput, {
    dateFormat: "Y-m-d",
    disableMobile: true
  });

  endInput.disabled = true;
});

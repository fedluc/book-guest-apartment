document.addEventListener("DOMContentLoaded", async function () {
  const startInput = document.getElementById("startDate");
  const endInput = document.getElementById("endDate");

  const today = new Date();
  const oneWeekFromToday = new Date(today);
  oneWeekFromToday.setDate(today.getDate() + 7);

  const threeMonthsFromToday = new Date(today);
  threeMonthsFromToday.setMonth(today.getMonth() + 3);

  let bookings = [];

  function parseDate(dateStr) {
    const parsed = new Date(dateStr);
    return isNaN(parsed.getTime()) ? null : parsed;
  }

  function formatISODate(date) {
    if (!(date instanceof Date) || isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  }

  function isOverlap(start1, end1, start2, end2) {
    return start1 < end2 && start2 < end1;
  }

  try {
    const response = await fetch(window.ENV.SCRIPT_URL);
    if (response.ok) {
      bookings = await response.json(); // [{start: ..., end: ...}, ...]
    }
  } catch (err) {
    console.error("Failed to fetch bookings", err);
  }

  const blockedStartDates = new Set();
  const startDateCursor = new Date(oneWeekFromToday);

  while (startDateCursor <= threeMonthsFromToday) {
    const candidateStart = new Date(startDateCursor);
    const noonStart = new Date(candidateStart);
    noonStart.setHours(12, 0, 0, 0);

    let valid = false;
    for (let duration = 1; duration <= 4; duration++) {
      const candidateEnd = new Date(noonStart);
      candidateEnd.setDate(candidateEnd.getDate() + duration);

      const overlap = bookings.some(b => {
        const bStart = parseDate(b.start);
        const bEnd = parseDate(b.end);
        return bStart && bEnd && isOverlap(noonStart, candidateEnd, bStart, bEnd);
      });

      if (!overlap) {
        valid = true;
        break;
      }
    }

    if (!valid) {
      blockedStartDates.add(formatISODate(candidateStart));
    }

    startDateCursor.setDate(startDateCursor.getDate() + 1);
  }

  const startPicker = flatpickr(startInput, {
    dateFormat: "Y-m-d",
    minDate: oneWeekFromToday,
    maxDate: threeMonthsFromToday,
    disable: [...blockedStartDates],
    onChange: function (selectedDates) {
      if (selectedDates.length === 0) {
        endInput._flatpickr.clear();
        endInput.disabled = true;
        return;
      }
    
      const selectedStart = selectedDates[0];
      const noonStart = new Date(selectedStart);
      noonStart.setHours(12, 0, 0, 0); // Start at 12:00 PM
    
      const minEnd = new Date(noonStart);
      minEnd.setDate(minEnd.getDate() + 1);
    
      const maxEnd = new Date(noonStart);
      maxEnd.setDate(maxEnd.getDate() + 4);
    
      const validEndDates = [];
    
      for (let d = new Date(minEnd); d <= maxEnd; d.setDate(d.getDate() + 1)) {
        const noonEnd = new Date(d);
        noonEnd.setHours(12, 0, 0, 0);
    
        // Check if the interval [noonStart, noonEnd) is completely free
        const overlaps = bookings.some(b => {
          const bStart = parseDate(b.start);
          const bEnd = parseDate(b.end);
          return bStart && bEnd && isOverlap(noonStart, noonEnd, bStart, bEnd);
        });
    
        if (!overlaps) {
          validEndDates.push(new Date(noonEnd));
        }
      }
    
      endInput.disabled = false;
    
      // Apply valid end dates only
      endInput._flatpickr.set("minDate", minEnd);
      endInput._flatpickr.set("maxDate", maxEnd);
      endInput._flatpickr.set("disable", [
        function (date) {
          return !validEndDates.some(valid => formatISODate(valid) === formatISODate(date));
        }
      ]);
    
      // Auto-set to first valid date if current selection is invalid
      const currentEndDate = endInput._flatpickr.selectedDates[0];
      const isValidSelection = currentEndDate &&
        validEndDates.some(d => formatISODate(d) === formatISODate(currentEndDate));
    
      if (!isValidSelection) {
        if (validEndDates.length > 0) {
          endInput._flatpickr.setDate(validEndDates[0], true);
        } else {
          endInput._flatpickr.clear();
        }
      }
    }
  });

  flatpickr(endInput, {
    dateFormat: "Y-m-d"
  });

  endInput.disabled = true;
});

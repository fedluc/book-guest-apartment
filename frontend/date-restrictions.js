document.addEventListener("DOMContentLoaded", async function () {
  const startInput = document.getElementById("startDate");
  const endInput = document.getElementById("endDate");

  const today = new Date();
  const threeMonthsFromToday = new Date();
  threeMonthsFromToday.setMonth(today.getMonth() + 3);

  let disabledDates = [];

  try {
    const response = await fetch(window.ENV.SCRIPT_URL);
    if (response.ok) {
      disabledDates = await response.json(); // ['2025-06-03', '2025-06-04', ...]
    }
  } catch (err) {
    console.error("Failed to fetch disabled dates", err);
  }

  const startPicker = flatpickr(startInput, {
    dateFormat: "Y-m-d",
    minDate: today,
    maxDate: threeMonthsFromToday,
    disable: disabledDates,
    onChange: function (selectedDates) {
      if (selectedDates.length === 0) {
        endInput._flatpickr.clear();
        endInput.disabled = true;
        return;
      }

      const selectedStart = selectedDates[0];
      const minEnd = new Date(selectedStart);
      minEnd.setDate(minEnd.getDate() + 1);

      const maxEnd = new Date(selectedStart);
      maxEnd.setDate(maxEnd.getDate() + 3);

      endInput.disabled = false;

      endInput._flatpickr.set("minDate", minEnd);
      endInput._flatpickr.set("maxDate", maxEnd);
      endInput._flatpickr.set("disable", disabledDates);

      const currentEndDate = endInput._flatpickr.selectedDates[0];
      if (!currentEndDate || currentEndDate < minEnd || currentEndDate > maxEnd) {
        endInput._flatpickr.setDate(minEnd, true);
      }
    }
  });

  flatpickr(endInput, {
    dateFormat: "Y-m-d",
    disable: disabledDates
  });

  endInput.disabled = true;
});

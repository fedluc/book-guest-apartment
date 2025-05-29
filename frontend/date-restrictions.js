const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
// Set minimum start date (today)
const today = new Date();
const todayStr = today.toISOString().split('T')[0];
startInput.min = todayStr;
// Set maximum start date (three months from today)
const maxStart = new Date(today);
maxStart.setMonth(maxStart.getMonth() + 3);
const maxStartStr = maxStart.toISOString().split('T')[0];
startInput.max = maxStartStr;
// Set end date
startInput.addEventListener('change', () => {
  const selectedStart = new Date(startInput.value);
  if (startInput.value) {
    // Allow selecting end date
    endInput.disabled = false;
    // Set minimum end date to today
    const minEnd = new Date(selectedStart);
    minEnd.setDate(minEnd.getDate() + 1);
    const minEndStr = minEnd.toISOString().split('T')[0];
    endInput.min = minEndStr;
    // Set maximum end date to 2 days after the start date
    const maxEnd = new Date(selectedStart);
    maxEnd.setDate(maxEnd.getDate() + 3);
    const maxEndStr = maxEnd.toISOString().split('T')[0];
    endInput.max = maxEndStr;
    // Reset the end date if it falls outside the bounding boxes
    if (!endInput.value || endInput.value < minEndStr || endInput.value > maxEndStr) {
      endInput.value = minEndStr;
    }
  } else {
    endInput.disabled = true;
    endInput.value = '';
  }
});
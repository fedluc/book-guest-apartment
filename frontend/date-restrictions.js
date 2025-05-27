const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const today = new Date();
const todayStr = today.toISOString().split('T')[0];
startInput.min = todayStr;
const maxStart = new Date(today);
maxStart.setMonth(maxStart.getMonth() + 3);
const maxStartStr = maxStart.toISOString().split('T')[0];
startInput.max = maxStartStr;
startInput.addEventListener('change', () => {
  const selectedStart = new Date(startInput.value);
  if (startInput.value) {
    endInput.disabled = false;
    const minEnd = new Date(selectedStart);
    const minEndStr = minEnd.toISOString().split('T')[0];
    endInput.min = minEndStr;
    const maxEnd = new Date(selectedStart);
    maxEnd.setDate(maxEnd.getDate() + 2);
    const maxEndStr = maxEnd.toISOString().split('T')[0];
    endInput.max = maxEndStr;
    if (!endInput.value || endInput.value < minEndStr || endInput.value > maxEndStr) {
      endInput.value = minEndStr;
    }
  } else {
    endInput.disabled = true;
    endInput.value = '';
  }
});
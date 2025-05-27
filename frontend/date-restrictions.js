document.addEventListener("DOMContentLoaded", () => {
    const startInput = document.getElementById("startDate");
    const endInput = document.getElementById("endDate");
  
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 16);
    startInput.min = todayStr;
  
    const threeMonthsLater = new Date(now);
    threeMonthsLater.setMonth(now.getMonth() + 3);
    startInput.max = threeMonthsLater.toISOString().slice(0, 16);
  
    startInput.addEventListener("change", () => {
      const startDate = new Date(startInput.value);
      const maxEnd = new Date(startDate.getTime() + 2 * 24 * 60 * 60 * 1000);
      endInput.min = startDate.toISOString().slice(0, 16);
      endInput.max = maxEnd.toISOString().slice(0, 16);
    });
  });
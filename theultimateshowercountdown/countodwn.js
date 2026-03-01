document.addEventListener("DOMContentLoaded", function () {

  // ✅ Use ISO format (more reliable)
  const targetDate = new Date("2063-01-01T00:00:00").getTime();

  function updateCountdown() {
    const now = Date.now();
    const difference = targetDate - now;

    if (difference <= 0) {
      document.getElementById("countdown").innerHTML = "Time's up!";
      clearInterval(timer);
      return;
    }

    const weeks = Math.floor(difference / (1000 * 60 * 60 * 24 * 7));
    const days = Math.floor((difference / (1000 * 60 * 60 * 24)) % 7);
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    document.getElementById("weeks").textContent = weeks;
    document.getElementById("days").textContent = days;
    document.getElementById("hours").textContent = hours;
    document.getElementById("minutes").textContent = minutes;
    document.getElementById("seconds").textContent = seconds;
  }

  updateCountdown();
  const timer = setInterval(updateCountdown, 1000);

});
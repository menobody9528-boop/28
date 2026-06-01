// 倒计时工具模块
const COUNTDOWN_DURATION_MS = 4 * 60 * 60 * 1000;
const ONE_HOUR_MS = 1000 * 60 * 60;
const ONE_MINUTE_MS = 1000 * 60;
const RESET_COUNTDOWN_TEXT = '04小时 00分 00秒';

let countdownTarget = null;
let countdownTimerId = null;

function formatCountdownValue(value) {
  return String(value).padStart(2, '0');
}

function getNextCountdownTarget(now) {
  return new Date(now.getTime() + COUNTDOWN_DURATION_MS);
}

function formatCountdown(diff) {
  const hours = Math.floor(diff / ONE_HOUR_MS);
  const minutes = Math.floor((diff % ONE_HOUR_MS) / ONE_MINUTE_MS);
  const seconds = Math.floor((diff % ONE_MINUTE_MS) / 1000);

  return `${formatCountdownValue(hours)}小时 ${formatCountdownValue(minutes)}分 ${formatCountdownValue(seconds)}秒`;
}

function getCountdown() {
  if (!countdownTarget) {
    const now = new Date();
    countdownTarget = getNextCountdownTarget(now);
  }
  
  const now = new Date();
  const diff = countdownTarget - now;
  
  if (diff <= 0) {
    countdownTarget = getNextCountdownTarget(now);
    return RESET_COUNTDOWN_TEXT;
  }
  
  return formatCountdown(diff);
}

function updateCountdown() {
  const countdownEl = document.getElementById('countdown-display');
  if (countdownEl) {
    countdownEl.textContent = getCountdown();
  }
}

export function stopCountdownTimer() {
  if (countdownTimerId) {
    clearInterval(countdownTimerId);
    countdownTimerId = null;
  }
}

export function startCountdownTimer() {
  stopCountdownTimer();
  updateCountdown();
  countdownTimerId = setInterval(updateCountdown, 1000);
}

const STORAGE_KEY = "window-study-room-v1";

const room = document.querySelector(".room");
const timerEl = document.querySelector("#timer");
const timerNote = document.querySelector("#timer-note");
const statusLabel = document.querySelector("#status-label");
const sessionLabel = document.querySelector("#session-label");
const primaryAction = document.querySelector("#primary-action");
const endAction = document.querySelector("#end-action");
const customMinutes = document.querySelector("#custom-minutes");
const presets = [...document.querySelectorAll(".preset")];
const completedCount = document.querySelector("#completed-count");
const focusedMinutes = document.querySelector("#focused-minutes");
const clock = document.querySelector("#clock");
const endDialog = document.querySelector("#end-dialog");
const confirmEnd = document.querySelector("#confirm-end");

const todayKey = () => new Date().toLocaleDateString("en-CA");

const initialState = {
  date: todayKey(),
  selectedMinutes: 25,
  totalSeconds: 25 * 60,
  remainingSeconds: 25 * 60,
  elapsedActiveSeconds: 0,
  status: "idle",
  endAt: null,
  completed: 0,
  focusedSeconds: 0,
};

let state = loadState();
let tickHandle;

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved) return { ...initialState };
    const restored = { ...initialState, ...saved };
    if (restored.date !== todayKey()) {
      restored.date = todayKey();
      restored.completed = 0;
      restored.focusedSeconds = 0;
    }
    if (restored.status === "running" && restored.endAt) {
      restored.remainingSeconds = Math.max(0, Math.ceil((restored.endAt - Date.now()) / 1000));
      if (restored.remainingSeconds === 0) {
        restored.completed += 1;
        restored.focusedSeconds += restored.totalSeconds;
        restored.status = "complete";
        restored.endAt = null;
      }
    }
    return restored;
  } catch {
    return { ...initialState };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function finishSession() {
  state.completed += 1;
  state.focusedSeconds += state.totalSeconds;
  state.remainingSeconds = 0;
  state.status = "complete";
  state.endAt = null;
  saveState();
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function updateClock() {
  clock.textContent = new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}

function setSelectedMinutes(minutes) {
  state.selectedMinutes = minutes;
  state.totalSeconds = minutes * 60;
  state.remainingSeconds = minutes * 60;
  customMinutes.value = minutes;
  presets.forEach((button) => {
    button.classList.toggle("is-active", Number(button.dataset.minutes) === minutes);
  });
  render();
  saveState();
}

function startSession() {
  if (state.status === "complete") {
    state.status = "idle";
    state.remainingSeconds = state.selectedMinutes * 60;
    state.totalSeconds = state.remainingSeconds;
    state.elapsedActiveSeconds = 0;
    render();
    saveState();
    return;
  }

  if (state.status === "running") {
    state.remainingSeconds = Math.max(0, Math.ceil((state.endAt - Date.now()) / 1000));
    state.elapsedActiveSeconds = state.totalSeconds - state.remainingSeconds;
    state.status = "paused";
    state.endAt = null;
  } else {
    if (state.status === "idle") {
      state.totalSeconds = state.selectedMinutes * 60;
      state.remainingSeconds = state.totalSeconds;
      state.elapsedActiveSeconds = 0;
    }
    state.status = "running";
    state.endAt = Date.now() + state.remainingSeconds * 1000;
  }
  render();
  saveState();
}

function endSession() {
  if (state.status === "running") {
    state.remainingSeconds = Math.max(0, Math.ceil((state.endAt - Date.now()) / 1000));
  }
  const elapsed = Math.max(0, state.totalSeconds - state.remainingSeconds);
  state.focusedSeconds += Math.floor(elapsed / 60) * 60;
  state.status = "idle";
  state.endAt = null;
  state.elapsedActiveSeconds = 0;
  state.remainingSeconds = state.selectedMinutes * 60;
  state.totalSeconds = state.remainingSeconds;
  render();
  saveState();
}

function tick() {
  if (state.status !== "running") return;
  state.remainingSeconds = Math.max(0, Math.ceil((state.endAt - Date.now()) / 1000));
  if (state.remainingSeconds === 0) {
    finishSession();
  }
  render();
}

function render() {
  clearInterval(tickHandle);
  customMinutes.value = state.selectedMinutes;
  timerEl.value = formatTime(state.remainingSeconds);
  timerEl.textContent = formatTime(state.remainingSeconds);
  completedCount.textContent = state.completed;
  focusedMinutes.textContent = Math.floor(state.focusedSeconds / 60);
  sessionLabel.textContent = `第 ${state.completed + 1} 次`;

  room.classList.toggle("is-running", state.status === "running" || state.status === "paused");
  endAction.hidden = state.status === "idle" || state.status === "complete";

  const copy = {
    idle: ["准备专注", "选一个时长，翻开今天的第一页。", "开始专注"],
    running: ["正在专注", "窗外有光，手边有书。", "暂停"],
    paused: ["已暂停", "休息一下，回来继续。", "继续"],
    complete: ["专注完成", `这一页，认真读了 ${state.selectedMinutes} 分钟。`, "再来一次"],
  }[state.status];

  statusLabel.textContent = copy[0];
  timerNote.textContent = copy[1];
  primaryAction.textContent = copy[2];

  if (state.status === "running") {
    tickHandle = setInterval(tick, 1000);
  }
}

presets.forEach((button) => {
  button.addEventListener("click", () => {
    customMinutes.value = "";
    setSelectedMinutes(Number(button.dataset.minutes));
  });
});

customMinutes.addEventListener("input", () => {
  const minutes = Number(customMinutes.value);
  if (Number.isInteger(minutes) && minutes >= 1 && minutes <= 180) {
    setSelectedMinutes(minutes);
  }
});

primaryAction.addEventListener("click", startSession);
endAction.addEventListener("click", () => endDialog.showModal());
confirmEnd.addEventListener("click", endSession);

updateClock();
setInterval(updateClock, 30_000);
customMinutes.value = state.selectedMinutes;
render();

const STORAGE_KEY = "window-study-room-v3";
const FOCUS_DEFAULT = 25;
const REST_MINUTES = 5;

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
const courseList = document.querySelector("#course-list");
const courseSummary = document.querySelector("#course-summary");
const showCourseForm = document.querySelector("#show-course-form");
const courseForm = document.querySelector("#course-form");
const courseName = document.querySelector("#course-name");
const clock = document.querySelector("#clock");
const endDialog = document.querySelector("#end-dialog");
const confirmEnd = document.querySelector("#confirm-end");

const todayKey = () => new Date().toLocaleDateString("en-CA");
const makeCourse = (name) => ({ id: crypto.randomUUID(), name, completed: 0 });

const initialState = {
  date: todayKey(),
  focusMinutes: FOCUS_DEFAULT,
  mode: "focus",
  totalSeconds: FOCUS_DEFAULT * 60,
  remainingSeconds: FOCUS_DEFAULT * 60,
  status: "idle",
  endAt: null,
  completed: 0,
  focusedSeconds: 0,
  courses: [makeCourse("默认课程")],
  selectedCourseId: null,
};

let state = loadState();
let tickHandle;

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const restored = saved ? { ...initialState, ...saved } : { ...initialState };
    if (!restored.courses?.length) restored.courses = [makeCourse("默认课程")];
    if (!restored.selectedCourseId || !restored.courses.some((course) => course.id === restored.selectedCourseId)) {
      restored.selectedCourseId = restored.courses[0].id;
    }
    if (restored.date !== todayKey()) {
      restored.date = todayKey();
      restored.completed = 0;
      restored.focusedSeconds = 0;
      restored.courses = restored.courses.map((course) => ({ ...course, completed: 0 }));
    }
    if (restored.status === "running" && restored.endAt) {
      restored.remainingSeconds = Math.max(0, Math.ceil((restored.endAt - Date.now()) / 1000));
      if (restored.remainingSeconds === 0) transitionPhase(restored, false);
    }
    return restored;
  } catch {
    const fallback = { ...initialState, courses: [makeCourse("默认课程")] };
    fallback.selectedCourseId = fallback.courses[0].id;
    return fallback;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getModeMinutes(mode = state.mode) {
  return mode === "focus" ? state.focusMinutes : REST_MINUTES;
}

function resetCurrentPhase(status = "idle") {
  state.totalSeconds = getModeMinutes() * 60;
  state.remainingSeconds = state.totalSeconds;
  state.status = status;
  state.endAt = status === "running" ? Date.now() + state.totalSeconds * 1000 : null;
}

function transitionPhase(target = state, shouldSave = true) {
  if (target.mode === "focus") {
    target.completed += 1;
    target.focusedSeconds += target.totalSeconds;
    target.courses = target.courses.map((course) =>
      course.id === target.selectedCourseId ? { ...course, completed: course.completed + 1 } : course,
    );
    target.mode = "rest";
    target.totalSeconds = REST_MINUTES * 60;
  } else {
    target.mode = "focus";
    target.totalSeconds = target.focusMinutes * 60;
  }
  target.remainingSeconds = target.totalSeconds;
  target.status = "running";
  target.endAt = Date.now() + target.totalSeconds * 1000;
  if (shouldSave) saveState();
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

function setFocusMinutes(minutes) {
  state.focusMinutes = minutes;
  if (state.mode === "focus" && state.status === "idle") resetCurrentPhase();
  presets.forEach((button) => {
    button.classList.toggle("is-active", Number(button.dataset.minutes) === minutes);
  });
  render();
  saveState();
}

function toggleTimer() {
  if (state.status === "running") {
    state.remainingSeconds = Math.max(0, Math.ceil((state.endAt - Date.now()) / 1000));
    state.status = "paused";
    state.endAt = null;
  } else {
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
  if (state.mode === "focus") {
    const elapsed = Math.max(0, state.totalSeconds - state.remainingSeconds);
    state.focusedSeconds += Math.floor(elapsed / 60) * 60;
  }
  resetCurrentPhase();
  render();
  saveState();
}

function tick() {
  if (state.status !== "running") return;
  state.remainingSeconds = Math.max(0, Math.ceil((state.endAt - Date.now()) / 1000));
  if (state.remainingSeconds === 0) transitionPhase();
  render();
}

function renderCourses() {
  courseList.replaceChildren();
  state.courses.forEach((course) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `course-chip${course.id === state.selectedCourseId ? " is-active" : ""}`;
    button.textContent = course.name;
    button.addEventListener("click", () => {
      state.selectedCourseId = course.id;
      render();
      saveState();
    });
    courseList.append(button);
  });

  courseSummary.replaceChildren();
  state.courses.forEach((course) => {
    const item = document.createElement("span");
    item.textContent = `${course.name} ${course.completed}`;
    courseSummary.append(item);
  });
}

function render() {
  clearInterval(tickHandle);
  customMinutes.value = state.focusMinutes;
  timerEl.value = formatTime(state.remainingSeconds);
  timerEl.textContent = formatTime(state.remainingSeconds);
  completedCount.textContent = state.completed;
  focusedMinutes.textContent = Math.floor(state.focusedSeconds / 60);
  sessionLabel.textContent = state.mode === "focus" ? `第 ${state.completed + 1} 次` : "休息 5 分钟";

  const isActive = state.status === "running" || state.status === "paused";
  room.classList.toggle("is-running", isActive);
  room.classList.toggle("is-resting", state.mode === "rest");
  endAction.hidden = !isActive;

  const selectedCourse = state.courses.find((course) => course.id === state.selectedCourseId);
  const modeLabel = state.mode === "focus" ? "专注" : "休息";
  statusLabel.textContent = state.status === "paused" ? `${modeLabel}已暂停` : `准备${modeLabel}`;
  if (state.status === "running") statusLabel.textContent = `正在${modeLabel}`;
  timerNote.textContent =
    state.mode === "focus" ? `这一轮属于「${selectedCourse?.name ?? "默认课程"}」。` : "放松眼睛，下一轮会自动开始。";
  primaryAction.textContent = state.status === "running" ? "暂停" : state.status === "paused" ? "继续" : `开始${modeLabel}`;

  presets.forEach((button) => {
    button.classList.toggle("is-active", Number(button.dataset.minutes) === state.focusMinutes);
  });
  renderCourses();

  if (state.status === "running") tickHandle = setInterval(tick, 1000);
}

presets.forEach((button) => {
  button.addEventListener("click", () => setFocusMinutes(Number(button.dataset.minutes)));
});

customMinutes.addEventListener("input", () => {
  const minutes = Number(customMinutes.value);
  if (Number.isInteger(minutes) && minutes >= 1 && minutes <= 180) setFocusMinutes(minutes);
});

showCourseForm.addEventListener("click", () => {
  courseForm.hidden = !courseForm.hidden;
  if (!courseForm.hidden) courseName.focus();
});

courseForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = courseName.value.trim();
  if (!name) return;
  const course = makeCourse(name);
  state.courses.push(course);
  state.selectedCourseId = course.id;
  courseName.value = "";
  courseForm.hidden = true;
  render();
  saveState();
});

primaryAction.addEventListener("click", toggleTimer);
endAction.addEventListener("click", () => endDialog.showModal());
confirmEnd.addEventListener("click", endSession);

updateClock();
setInterval(updateClock, 30_000);
render();

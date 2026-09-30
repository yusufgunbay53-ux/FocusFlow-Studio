const KEY = 'focusflow.v1'

const defaultState = {
  tasks: [],
  sessions: [],
  stats: {
    completedToday: 0,
    pomodorosToday: 0,
    lastActiveAt: Date.now(),
    dayKey: new Date().toDateString(),
  },
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return structuredClone(defaultState)
    const data = JSON.parse(raw)
    const dayKey = new Date().toDateString()
    if (data.stats?.dayKey !== dayKey) {
      data.stats = {
        completedToday: 0,
        pomodorosToday: 0,
        lastActiveAt: Date.now(),
        dayKey,
      }
    }
    return { ...structuredClone(defaultState), ...data }
  } catch {
    return structuredClone(defaultState)
  }
}

export function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state))
}

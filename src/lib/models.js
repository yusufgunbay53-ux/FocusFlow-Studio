/**
 * Clean JSON models ready for Supabase / Firebase later.
 */

export const COLUMNS = [
  { id: 'todo', title: 'Yapılacaklar' },
  { id: 'doing', title: 'Yapılıyor' },
  { id: 'done', title: 'Tamamlandı' },
]

export const PRIORITIES = [
  { id: 'low', label: 'Düşük', color: 'text-sky-300', ring: 'ring-sky-400/40' },
  { id: 'medium', label: 'Orta', color: 'text-amber-300', ring: 'ring-amber-400/40' },
  { id: 'high', label: 'Yüksek', color: 'text-rose-300', ring: 'ring-rose-400/40' },
]

export function createTask({ title, notes = '', priority = 'medium', status = 'todo' }) {
  const now = Date.now()
  return {
    id: crypto.randomUUID(),
    title: title.trim(),
    notes,
    priority,
    status,
    createdAt: now,
    updatedAt: now,
    completedAt: null,
  }
}

export function createSession(mode, durationSec) {
  return {
    id: crypto.randomUUID(),
    mode,
    durationSec,
    completedAt: Date.now(),
  }
}

export const emptyStats = () => ({
  completedToday: 0,
  pomodorosToday: 0,
  lastActiveAt: Date.now(),
})

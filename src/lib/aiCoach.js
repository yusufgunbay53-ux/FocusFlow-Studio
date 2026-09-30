export function mockCoach({ tasks, stats, timerMode, remainingSec, running }) {
  const done = tasks.filter((t) => t.status === 'done').length
  const doing = tasks.filter((t) => t.status === 'doing').length
  const todo = tasks.filter((t) => t.status === 'todo').length
  const highOpen = tasks.filter((t) => t.priority === 'high' && t.status !== 'done').length

  if (running && timerMode === 'focus' && remainingSec < 60) {
    return { tone: 'focus', text: 'Son bir dakika. Derin bir nefes al, bitiş çizgisine odaklan.' }
  }
  if (running && timerMode === 'break') {
    return { tone: 'calm', text: 'Mola zamanı. Ekrandan uzaklaş, 5 dakikalık reset işe yarar.' }
  }
  if (stats.pomodorosToday >= 4 && stats.completedToday >= 3) {
    return { tone: 'good', text: 'Bugün harika gidiyorsun! Ritmin güçlü, bir tur daha basabilirsin.' }
  }
  if (stats.completedToday === 0 && todo > 3 && !running) {
    return { tone: 'nudge', text: 'Biraz yavaşladın. En küçük görevi seçip 25 dakikalık bir sprint başlatmak ister misin?' }
  }
  if (highOpen > 0) {
    return { tone: 'focus', text: `${highOpen} yüksek öncelikli görev bekliyor. Önce onları Yapılıyor'a al.` }
  }
  if (doing > 2) {
    return { tone: 'nudge', text: 'Aynı anda çok iş açık. Tek karta inmek odağı ikiye katlar.' }
  }
  if (done > 0 && todo === 0) {
    return { tone: 'good', text: 'Liste temiz. Yeni bir hedef ekle veya ödül olarak kısa bir mola ver.' }
  }
  return { tone: 'calm', text: 'Hazırsın. Bir görev seç, Pomodoro’yu başlat, gerisini akışa bırak.' }
}

export async function coachFromApi(payload) {
  return mockCoach(payload)
}

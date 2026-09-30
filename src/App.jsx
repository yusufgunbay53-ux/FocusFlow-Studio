import { useCallback, useEffect, useMemo, useState } from 'react'
import { Timer, LayoutGrid } from 'lucide-react'
import Kanban from './components/Kanban'
import Pomodoro from './components/Pomodoro'
import AmbientPlayer from './components/AmbientPlayer'
import AiCoach from './components/AiCoach'
import { loadState, saveState } from './lib/storage'
import { mockCoach } from './lib/aiCoach'

export default function App() {
  const initial = loadState()
  const [tasks, setTasks] = useState(initial.tasks)
  const [sessions, setSessions] = useState(initial.sessions)
  const [stats, setStats] = useState(initial.stats)
  const [timerMeta, setTimerMeta] = useState({ mode: 'focus', remaining: 25 * 60, running: false })

  useEffect(() => {
    saveState({ tasks, sessions, stats })
  }, [tasks, sessions, stats])

  const onTickMeta = useCallback((meta) => setTimerMeta(meta), [])

  function onPomodoroComplete(session) {
    setSessions((prev) => [session, ...prev].slice(0, 200))
    if (session.mode === 'focus') {
      setStats((s) => ({
        ...s,
        pomodorosToday: s.pomodorosToday + 1,
        lastActiveAt: Date.now(),
      }))
    }
  }

  useEffect(() => {
    const doneToday = tasks.filter((t) => t.status === 'done' && isToday(t.completedAt)).length
    setStats((s) => ({ ...s, completedToday: doneToday, lastActiveAt: Date.now() }))
  }, [tasks])

  const insight = useMemo(
    () =>
      mockCoach({
        tasks,
        stats,
        timerMode: timerMeta.mode,
        remainingSec: timerMeta.remaining,
        running: timerMeta.running,
      }),
    [tasks, stats, timerMeta]
  )

  return (
    <div className="mx-auto min-h-screen max-w-7xl px-4 py-6 md:px-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-neon">FocusFlow</p>
          <h1 className="text-2xl font-semibold md:text-3xl">Odak stüdyosu</h1>
        </div>
        <div className="flex gap-2 text-xs text-slate-300">
          <span className="glass rounded-full px-3 py-1">
            <LayoutGrid size={12} className="mr-1 inline text-neon" />
            {stats.completedToday} tamamlandı
          </span>
          <span className="glass rounded-full px-3 py-1">
            <Timer size={12} className="mr-1 inline text-neon" />
            {stats.pomodorosToday} pomodoro
          </span>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Kanban tasks={tasks} setTasks={setTasks} />
        <aside className="space-y-4 lg:sticky lg:top-4 lg:self-start">
          <Pomodoro onComplete={onPomodoroComplete} onTickMeta={onTickMeta} />
          <AmbientPlayer />
          <AiCoach insight={insight} />
        </aside>
      </div>
    </div>
  )
}

function isToday(ts) {
  if (!ts) return false
  return new Date(ts).toDateString() === new Date().toDateString()
}

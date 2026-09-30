import { useEffect, useMemo, useRef, useState } from 'react'
import { Pause, Play, RotateCcw } from 'lucide-react'
import { playChime } from '../lib/audio'
import { createSession } from '../lib/models'

const FOCUS = 25 * 60
const BREAK = 5 * 60

export default function Pomodoro({ onComplete, onTickMeta }) {
  const [mode, setMode] = useState('focus')
  const [remaining, setRemaining] = useState(FOCUS)
  const [running, setRunning] = useState(false)
  const tick = useRef(null)

  const total = mode === 'focus' ? FOCUS : BREAK
  const progress = 1 - remaining / total

  useEffect(() => {
    onTickMeta?.({ mode, remaining, running })
  }, [mode, remaining, running, onTickMeta])

  useEffect(() => {
    if (!running) return
    tick.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(tick.current)
          finish()
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => clearInterval(tick.current)
  }, [running, mode])

  async function finish() {
    setRunning(false)
    playChime()
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(mode === 'focus' ? 'Odak bitti' : 'Mola bitti', {
        body: mode === 'focus' ? '5 dakikalık mola zamanı.' : 'Yeni bir 25 dakikalık sprint başlayabilir.',
      })
    }
    onComplete?.(createSession(mode, total))
    const next = mode === 'focus' ? 'break' : 'focus'
    setMode(next)
    setRemaining(next === 'focus' ? FOCUS : BREAK)
  }

  function switchMode(next) {
    setMode(next)
    setRunning(false)
    setRemaining(next === 'focus' ? FOCUS : BREAK)
  }

  const mmss = useMemo(() => {
    const m = String(Math.floor(remaining / 60)).padStart(2, '0')
    const s = String(remaining % 60).padStart(2, '0')
    return `${m}:${s}`
  }, [remaining])

  return (
    <div className="glass rounded-3xl p-5">
      <div className="mb-4 flex gap-2">
        {['focus', 'break'].map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={`rounded-full px-3 py-1 text-xs ${
              mode === m ? 'bg-neon/20 text-neon' : 'text-slate-400 hover:text-white'
            }`}
          >
            {m === 'focus' ? 'Odak 25' : 'Mola 5'}
          </button>
        ))}
      </div>
      <div className="relative mx-auto grid h-44 w-44 place-items-center">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(0,210,255,0.12)" strokeWidth="8" />
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="#00d2ff"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 52}`}
            strokeDashoffset={`${(1 - progress) * 2 * Math.PI * 52}`}
          />
        </svg>
        <div className="text-center">
          <div className="text-4xl font-semibold tracking-tight">{mmss}</div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-cyan-300/70">
            {mode === 'focus' ? 'odak' : 'mola'}
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-center gap-2">
        <button
          onClick={() => {
            if ('Notification' in window && Notification.permission === 'default') {
              Notification.requestPermission()
            }
            setRunning((v) => !v)
          }
          }
          className="glow-hover inline-flex items-center gap-2 rounded-xl bg-neon/15 px-4 py-2 text-sm text-neon ring-1 ring-neon/30"
        >
          {running ? <Pause size={16} /> : <Play size={16} />}
          {running ? 'Duraklat' : 'Başlat'}
        </button>
        <button
          onClick={() => {
            setRunning(false)
            setRemaining(total)
          }}
          className="rounded-xl px-3 py-2 text-slate-300 hover:bg-white/5"
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { CloudRain, Music2, Volume2 } from 'lucide-react'
import { setLofiVolume, setRainVolume, startLofi, startRain, stopAllAmbient } from '../lib/audio'

export default function AmbientPlayer() {
  const [mode, setMode] = useState('off')
  const [vol, setVol] = useState(0.35)

  useEffect(() => {
    return () => stopAllAmbient()
  }, [])

  useEffect(() => {
    if (mode === 'rain') setRainVolume(vol)
    if (mode === 'lofi') setLofiVolume(vol)
  }, [vol, mode])

  async function pick(next) {
    if (mode === next) {
      stopAllAmbient()
      setMode('off')
      return
    }
    stopAllAmbient()
    if (next === 'rain') await startRain(vol)
    if (next === 'lofi') await startLofi(vol)
    setMode(next)
  }

  return (
    <div className="glass rounded-3xl p-5">
      <div className="mb-3 flex items-center gap-2 text-sm text-cyan-100">
        <Volume2 size={16} className="text-neon" />
        Ambient
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => pick('lofi')}
          className={`glow-hover flex-1 rounded-xl px-3 py-2 text-xs ${
            mode === 'lofi' ? 'bg-neon/20 text-neon' : 'bg-white/5 text-slate-300'
          }`}
        >
          <Music2 size={14} className="mb-1 inline" /> Lo-Fi
        </button>
        <button
          onClick={() => pick('rain')}
          className={`glow-hover flex-1 rounded-xl px-3 py-2 text-xs ${
            mode === 'rain' ? 'bg-neon/20 text-neon' : 'bg-white/5 text-slate-300'
          }`}
        >
          <CloudRain size={14} className="mb-1 inline" /> Yağmur
        </button>
      </div>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={vol}
        onChange={(e) => setVol(Number(e.target.value))}
        className="mt-4 w-full accent-cyan-400"
      />
    </div>
  )
}

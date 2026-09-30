import { Sparkles } from 'lucide-react'

const tones = {
  good: 'from-cyan-400/20 to-emerald-400/10',
  nudge: 'from-amber-400/15 to-cyan-400/10',
  focus: 'from-sky-400/20 to-indigo-400/10',
  calm: 'from-slate-400/10 to-cyan-400/10',
}

export default function AiCoach({ insight }) {
  return (
    <div className={`glass rounded-3xl bg-gradient-to-br p-5 ${tones[insight.tone] || tones.calm}`}>
      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-cyan-100">
        <Sparkles size={16} className="text-neon" />
        AI Performans Koçu
      </div>
      <p className="text-sm leading-relaxed text-slate-200">{insight.text}</p>
      <p className="mt-3 text-[10px] uppercase tracking-wider text-slate-500">
        Mock motor · API bağlantısına hazır
      </p>
    </div>
  )
}

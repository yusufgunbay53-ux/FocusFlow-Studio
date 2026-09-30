import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Check, GripVertical, Pencil, Trash2 } from 'lucide-react'
import { PRIORITIES } from '../lib/models'

export default function TaskCard({ task, onEdit, onDelete, onToggle }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  const pri = PRIORITIES.find((p) => p.id === task.priority)

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`glass glow-hover rounded-2xl p-3 ${isDragging ? 'opacity-60' : ''} ${
        task.status === 'done' ? 'opacity-70' : ''
      }`}
    >
      <div className="flex items-start gap-2">
        <button
          className="mt-0.5 text-cyan-300/60 hover:text-neon cursor-grab"
          {...attributes}
          {...listeners}
          aria-label="Sürükle"
        >
          <GripVertical size={16} />
        </button>
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-medium ${task.status === 'done' ? 'line-through text-slate-400' : ''}`}>
            {task.title}
          </h4>
          {task.notes ? <p className="mt-1 text-xs text-slate-400 line-clamp-2">{task.notes}</p> : null}
          <span className={`mt-2 inline-block text-[10px] uppercase tracking-wider ${pri?.color}`}>
            {pri?.label}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <button onClick={() => onToggle(task)} className="rounded-lg p-1 text-cyan-200/70 hover:text-neon hover:bg-white/5" title="Tamamla">
            <Check size={15} />
          </button>
          <button onClick={() => onEdit(task)} className="rounded-lg p-1 text-cyan-200/70 hover:text-neon hover:bg-white/5">
            <Pencil size={14} />
          </button>
          <button onClick={() => onDelete(task.id)} className="rounded-lg p-1 text-rose-300/70 hover:text-rose-300 hover:bg-white/5">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </article>
  )
}

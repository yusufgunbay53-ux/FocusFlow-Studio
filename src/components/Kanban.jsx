import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import { COLUMNS, PRIORITIES, createTask } from '../lib/models'
import TaskCard from './TaskCard'

function Column({ column, tasks, children }) {
  const { setNodeRef } = useDroppable({ id: column.id })
  return (
    <section className="glass flex min-h-[280px] flex-col rounded-3xl p-4">
      <header className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-wide text-cyan-100">{column.title}</h3>
        <span className="rounded-full bg-cyan-400/10 px-2 py-0.5 text-[11px] text-neon">{tasks.length}</span>
      </header>
      <div ref={setNodeRef} className="flex flex-1 flex-col gap-2">
        {children}
      </div>
    </section>
  )
}

export default function Kanban({ tasks, setTasks }) {
  const [draft, setDraft] = useState({ title: '', notes: '', priority: 'medium' })
  const [editing, setEditing] = useState(null)
  const [activeId, setActiveId] = useState(null)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  const byCol = (id) => tasks.filter((t) => t.status === id)

  function upsert() {
    if (!draft.title.trim()) return
    if (editing) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editing ? { ...t, ...draft, title: draft.title.trim(), updatedAt: Date.now() } : t
        )
      )
      setEditing(null)
    } else {
      setTasks((prev) => [createTask(draft), ...prev])
    }
    setDraft({ title: '', notes: '', priority: 'medium' })
  }

  function onToggle(task) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id
          ? {
              ...t,
              status: t.status === 'done' ? 'todo' : 'done',
              completedAt: t.status === 'done' ? null : Date.now(),
              updatedAt: Date.now(),
            }
          : t
      )
    )
  }

  function onDragEnd(event) {
    setActiveId(null)
    const { active, over } = event
    if (!over) return
    const overId = over.id
    const overTask = tasks.find((t) => t.id === overId)
    const nextStatus = COLUMNS.some((c) => c.id === overId) ? overId : overTask?.status
    if (!nextStatus) return
    setTasks((prev) =>
      prev.map((t) =>
        t.id === active.id
          ? {
              ...t,
              status: nextStatus,
              completedAt: nextStatus === 'done' ? Date.now() : t.completedAt,
              updatedAt: Date.now(),
            }
          : t
      )
    )
  }

  const activeTask = tasks.find((t) => t.id === activeId)

  return (
    <div className="space-y-4">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          upsert()
        }}
        className="glass flex flex-col gap-3 rounded-3xl p-4 md:flex-row md:items-end"
      >
        <label className="flex-1 text-xs text-slate-400">
          Görev
          <input
            value={draft.title}
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
            placeholder="Ne üzerinde çalışıyorsun?"
            className="mt-1 w-full rounded-xl border border-cyan-400/15 bg-night/60 px-3 py-2 text-sm text-white outline-none focus:border-neon"
          />
        </label>
        <label className="flex-1 text-xs text-slate-400">
          Not
          <input
            value={draft.notes}
            onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
            placeholder="İsteğe bağlı"
            className="mt-1 w-full rounded-xl border border-cyan-400/15 bg-night/60 px-3 py-2 text-sm text-white outline-none focus:border-neon"
          />
        </label>
        <label className="text-xs text-slate-400">
          Öncelik
          <select
            value={draft.priority}
            onChange={(e) => setDraft((d) => ({ ...d, priority: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-cyan-400/15 bg-night/60 px-3 py-2 text-sm text-white outline-none"
          >
            {PRIORITIES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="glow-hover inline-flex items-center justify-center gap-2 rounded-xl bg-neon/15 px-4 py-2 text-sm font-medium text-neon ring-1 ring-neon/30"
        >
          <Plus size={16} />
          {editing ? 'Kaydet' : 'Ekle'}
        </button>
      </form>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={({ active }) => setActiveId(active.id)}
        onDragEnd={onDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <div className="grid gap-4 md:grid-cols-3">
          {COLUMNS.map((col) => {
            const items = byCol(col.id)
            return (
              <Column key={col.id} column={col} tasks={items}>
                <SortableContext items={items.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                  {items.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={(t) => {
                        setEditing(t.id)
                        setDraft({ title: t.title, notes: t.notes, priority: t.priority })
                      }}
                      onDelete={(id) => setTasks((prev) => prev.filter((t) => t.id !== id))}
                      onToggle={onToggle}
                    />
                  ))}
                </SortableContext>
              </Column>
            )
          })}
        </div>
        <DragOverlay>
          {activeTask ? (
            <div className="glass rounded-2xl px-4 py-3 text-sm shadow-neon">{activeTask.title}</div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

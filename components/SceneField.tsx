'use client'

type Props = {
  title: string
  items: string[]
}

export default function SceneField({ title, items }: Props) {
  return (
    <div className="mb-3">
      <div className="text-xs font-semibold text-zinc-400 mb-1">{title}</div>

      <div className="flex flex-wrap gap-1.5">
        {items?.length === 0 ? (
          <span className="text-xs text-zinc-600">—</span>
        ) : (
          items.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-100"
            >
              {item}
            </span>
          ))
        )}
      </div>
    </div>
  )
}

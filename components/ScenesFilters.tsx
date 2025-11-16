'use client'

type ScenesFiltersProps = {
  search: string
  onSearchChange: (value: string) => void
  characters: string[]
  selectedCharacters: string[]
  onToggleCharacter: (name: string) => void
}

export default function ScenesFilters({
  search,
  onSearchChange,
  characters,
  selectedCharacters,
  onToggleCharacter,
}: ScenesFiltersProps) {
  return (
    <div className="w-full max-w-4xl mb-6 space-y-4 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
      {/* SEARCH */}
      <div>
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Поиск по сценам, предметам, персонажам…"
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm
                     text-zinc-200 placeholder-zinc-500 focus:ring-2 focus:ring-orange-500 outline-none"
        />
      </div>

      {/* CHARACTERS FILTER */}
      {characters.length > 0 && (
        <div>
          <p className="text-xs text-zinc-400 mb-2">Персонажи</p>

          <div className="flex flex-wrap gap-2">
            {characters.map((c) => {
              const active = selectedCharacters.includes(c)
              return (
                <button
                  key={c}
                  onClick={() => onToggleCharacter(c)}
                  className={`px-3 py-1 rounded-full text-xs border transition
                    ${
                      active
                        ? 'bg-orange-600/20 border-orange-500 text-orange-300'
                        : 'bg-zinc-800/40 border-zinc-700 text-zinc-300 hover:border-zinc-500'
                    }`}
                >
                  {c}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

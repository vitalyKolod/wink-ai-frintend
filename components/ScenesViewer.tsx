'use client'

import { useState } from 'react'
import { Scene } from '@/types/scenario'
import SceneCard from './SceneCard'
import ScenesFilters from './ScenesFilters'
import { FunnelIcon } from '@heroicons/react/24/outline' // фильтр-иконка

export default function ScenesViewer() {
  const [file, setFile] = useState<File | null>(null)
  const [scenes, setScenes] = useState<Scene[]>([])
  const [loading, setLoading] = useState(false)

  // фильтры
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null
    setFile(f)
  }

  const handleSubmit = async () => {
    if (!file) return
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/parse', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      setScenes(data.scenes || [])
      setSearch('')
      setSelectedCharacters([])
      setFiltersOpen(true) // сразу открыть фильтры после разбора
    } finally {
      setLoading(false)
    }
  }

  // собираем всех персонажей
  const allCharacters: string[] = Array.from(
    new Set(
      scenes.flatMap((scene) => [
        ...(scene.analysis?.Персонажи || []),
        ...(scene.analysis?.Массовка || []),
      ])
    )
  )
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, 'ru'))

  const handleToggleCharacter = (name: string) => {
    setSelectedCharacters((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    )
  }

  // фильтрация сцен
  const filteredScenes = scenes.filter((scene) => {
    const query = search.trim().toLowerCase()

    const haystack = [
      scene.scene_header,
      ...(scene.analysis?.Персонажи || []),
      ...(scene.analysis?.Массовка || []),
      ...(scene.analysis?.Реквизит || []),
      ...(scene.analysis?.Костюмы || []),
      ...(scene.analysis?.Грим || []),
    ]
      .flat()
      .join(' ')
      .toLowerCase()

    const matchesSearch = query === '' || haystack.includes(query)

    const sceneChars = new Set([
      ...(scene.analysis?.Персонажи || []),
      ...(scene.analysis?.Массовка || []),
    ])

    const matchesCharacters =
      selectedCharacters.length === 0 || selectedCharacters.every((ch) => sceneChars.has(ch))

    return matchesSearch && matchesCharacters
  })

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* SIDEBAR */}
      <aside className="hidden md:flex w-64 border-r border-zinc-800 bg-zinc-950/80 p-4">
        <h2 className="text-sm font-semibold text-zinc-400">История</h2>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col items-center px-4 py-6 md:px-10 md:py-8">
        {/* Title + filter button */}
        <div className="w-full max-w-4xl flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
            Разбор сценария
          </h1>

          {scenes.length > 0 && (
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-orange-400 transition"
              title="Фильтры"
            >
              <FunnelIcon className="w-6 h-6 text-orange-400" />
            </button>
          )}
        </div>

        {/* UPLOAD */}
        <div className="w-full max-w-4xl border border-dashed border-zinc-700 rounded-2xl bg-zinc-950/70 p-6 mb-6">
          <input
            type="file"
            accept=".txt,.doc,.docx,.pdf"
            onChange={handleFileChange}
            className="text-xs text-zinc-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-xs file:font-semibold
              file:bg-orange-500 file:text-black
              hover:file:bg-orange-400"
          />

          <button
            onClick={handleSubmit}
            disabled={!file || loading}
            className="mt-4 px-5 py-2 rounded-full text-sm font-semibold
              bg-gradient-to-r from-orange-500 to-red-500
              text-black shadow-lg shadow-orange-500/30
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Парсим...' : 'Запустить разбор'}
          </button>
        </div>

        {/* FILTER PANEL */}
        {filtersOpen && scenes.length > 0 && (
          <div className="w-full max-w-4xl mb-6 animate-fade-in">
            <ScenesFilters
              search={search}
              onSearchChange={setSearch}
              characters={allCharacters}
              selectedCharacters={selectedCharacters}
              onToggleCharacter={handleToggleCharacter}
            />
          </div>
        )}

        {/* SCENES */}
        <div className="w-full max-w-4xl space-y-4">
          {filteredScenes.map((scene, index) => (
            <SceneCard key={index} scene={scene} />
          ))}
        </div>
      </main>
    </div>
  )
}

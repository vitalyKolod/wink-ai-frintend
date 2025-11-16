'use client'

import React, { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import FileUpload from '@/components/FileUpload'
import SceneCard from '@/components/SceneCard'
import Loader from '@/components/Loader'
import ScenesFilters from '@/components/ScenesFilters'

import { Scene, Scenario } from '@/types'
import {
  saveScenario,
  getCurrentScenarioId,
  setCurrentScenarioId,
  getScenarioById,
} from '@/lib/storage'

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [scenes, setScenes] = useState<Scene[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null)
  const [sidebarRefreshTrigger, setSidebarRefreshTrigger] = useState(0)

  // ---------------- ФИЛЬТРЫ ----------------
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([])

  // Все персонажи
  const allCharacters: string[] = Array.from(
    new Set(
      scenes.flatMap((s) => [...(s.analysis?.Персонажи || []), ...(s.analysis?.Массовка || [])])
    )
  ).filter(Boolean)

  const toggleCharacter = (name: string) => {
    setSelectedCharacters((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    )
  }

  // Фильтрация
  const filteredScenes = scenes.filter((scene) => {
    const haystack = [
      scene.scene_header,
      ...(scene.analysis?.Персонажи || []),
      ...(scene.analysis?.Массовка || []),
      ...(scene.analysis?.Реквизит || []),
    ]
      .join(' ')
      .toLowerCase()

    const searchOk = !search || haystack.includes(search.toLowerCase())

    const chars = new Set([
      ...(scene.analysis?.Персонажи || []),
      ...(scene.analysis?.Массовка || []),
    ])

    const charsOk =
      selectedCharacters.length === 0 || selectedCharacters.every((ch) => chars.has(ch))

    return searchOk && charsOk
  })

  // ---------------- ЛОГИКА СЦЕН ----------------

  useEffect(() => {
    const savedScenarioId = getCurrentScenarioId()
    if (savedScenarioId) {
      const scenario = getScenarioById(savedScenarioId)
      if (scenario) {
        setCurrentScenario(scenario)
        setScenes(scenario.result)
      } else {
        setCurrentScenarioId(null)
      }
    }
  }, [])

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file)
    setScenes([])
    setError(null)
    setCurrentScenario(null)
    if (file) setCurrentScenarioId(null)
  }

  const handleParse = async () => {
    if (!selectedFile) return

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const res = await fetch('/api/parse', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      const parsedScenes: Scene[] = data.scenes || data
      setScenes(parsedScenes)

      const newScenario: Scenario = {
        id: Date.now().toString(),
        name: selectedFile.name,
        date: new Date().toISOString(),
        result: parsedScenes,
      }

      saveScenario(newScenario)
      setCurrentScenario(newScenario)
      setCurrentScenarioId(newScenario.id)
      setSidebarRefreshTrigger((x) => x + 1)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectScenario = (scenario: Scenario) => {
    setCurrentScenario(scenario)
    setScenes(scenario.result)
    setSelectedFile(null)
    setError(null)
    setCurrentScenarioId(scenario.id)
  }

  const handleNewScenario = () => {
    setCurrentScenario(null)
    setScenes([])
    setSelectedFile(null)
    setError(null)
    setCurrentScenarioId(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* MOBILE HEADER */}
      <header className="lg:hidden sticky top-0 z-30 bg-white dark:bg-gray-900 border-b dark:border-gray-800">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => setSidebarOpen(true)}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-white">Wink AI</h1>
          <div className="w-6"></div>
        </div>
      </header>

      <div className="flex">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onSelectScenario={handleSelectScenario}
          onNewScenario={handleNewScenario}
          refreshTrigger={sidebarRefreshTrigger}
        />

        {/* MAIN CONTENT */}
        <main className={`${sidebarOpen ? 'lg:ml-0' : 'lg:ml-80'} flex-1 p-4 lg:p-8`}>
          <div className="max-w-4xl mx-auto">
            {/* TITLE */}
            <div className="hidden lg:block mb-8">
              <h1 className="text-3xl font-bold text-white">Wink AI</h1>
              <p className="text-gray-400">Парсинг и анализ сценариев</p>
            </div>

            {/* UPLOAD */}
            {!currentScenario && (
              <div className="mb-8">
                <FileUpload onFileSelect={handleFileSelect} selectedFile={selectedFile} />
                {selectedFile && (
                  <button
                    onClick={handleParse}
                    disabled={loading}
                    className="mt-4 bg-orange-500 px-6 py-3 text-white rounded-lg"
                  >
                    {loading ? 'Обработка…' : 'Парсить сценарий'}
                  </button>
                )}
              </div>
            )}

            {error && (
              <div className="p-4 mb-4 bg-red-500/20 border border-red-400 text-red-300 rounded-lg">
                {error}
              </div>
            )}

            {loading && <Loader />}

            {/* FILTER BUTTON */}
            {!loading && scenes.length > 0 && (
              <button
                onClick={() => setFiltersOpen((v) => !v)}
                className="mb-4 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg flex items-center gap-2"
              >
                <span>Фильтры</span>
                <svg width="18" height="18" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeWidth={2} d="M3 6h12M6 10h6M9 14h0" />
                </svg>
              </button>
            )}

            {/* FILTER PANEL */}
            {filtersOpen && scenes.length > 0 && (
              <ScenesFilters
                search={search}
                onSearchChange={setSearch}
                characters={allCharacters}
                selectedCharacters={selectedCharacters}
                onToggleCharacter={toggleCharacter}
              />
            )}

            {/* SCENE CARDS */}
            {!loading && (
              <div className="space-y-6">
                {filteredScenes.map((scene, index) => (
                  <SceneCard key={index} scene={scene} index={index} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

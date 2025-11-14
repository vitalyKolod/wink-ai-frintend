'use client'

import React, { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import FileUpload from '@/components/FileUpload'
import SceneCard from '@/components/SceneCard'
import Loader from '@/components/Loader'
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

  // Восстанавливаем сценарий при загрузке страницы
  useEffect(() => {
    const savedScenarioId = getCurrentScenarioId()
    if (savedScenarioId) {
      const scenario = getScenarioById(savedScenarioId)
      if (scenario) {
        setCurrentScenario(scenario)
        setScenes(scenario.result)
      } else {
        // Если сценарий не найден, очищаем сохраненный ID
        setCurrentScenarioId(null)
      }
    }
  }, [])

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file)
    setScenes([])
    setError(null)
    setCurrentScenario(null)
    // Если выбирается новый файл, очищаем сохраненный ID (но только если файл выбран)
    if (file) {
      setCurrentScenarioId(null)
    }
  }

  const handleParse = async () => {
    if (!selectedFile) {
      setError('Пожалуйста, выберите файл')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch('/api/parse', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Ошибка при парсинге файла')
      }

      const parsedScenes: Scene[] = await response.json()
      setScenes(parsedScenes)

      // Сохраняем в LocalStorage
      const newScenario: Scenario = {
        id: Date.now().toString(),
        name: selectedFile.name,
        date: new Date().toISOString(),
        result: parsedScenes,
      }
      saveScenario(newScenario)
      setCurrentScenario(newScenario)
      // Сохраняем ID текущего сценария
      setCurrentScenarioId(newScenario.id)
      // Обновляем историю в Sidebar
      setSidebarRefreshTrigger((prev) => prev + 1)
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка при обработке файла')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectScenario = (scenario: Scenario) => {
    setCurrentScenario(scenario)
    setScenes(scenario.result)
    setSelectedFile(null)
    setError(null)
    // Сохраняем ID выбранного сценария
    setCurrentScenarioId(scenario.id)
  }

  const handleNewScenario = () => {
    setCurrentScenario(null)
    setScenes([])
    setSelectedFile(null)
    setError(null)
    // Очищаем сохраненный ID текущего сценария
    setCurrentScenarioId(null)
    if (selectedFile && document.querySelector('input[type="file"]')) {
      ;(document.querySelector('input[type="file"]') as HTMLInputElement).value = ''
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header с бургер-меню */}
      <header className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 lg:hidden">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-900 dark:text-white hover:text-orange-500 dark:hover:text-orange-500 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Wink AI</h1>
          <div className="w-6"></div> {/* Spacer для центрирования */}
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onSelectScenario={handleSelectScenario}
          onNewScenario={handleNewScenario}
          refreshTrigger={sidebarRefreshTrigger}
        />

        {/* Main Content */}
        <main
          className={`
            flex-1 transition-all duration-300
            ${sidebarOpen ? 'lg:ml-0' : 'lg:ml-80'}
            p-4 lg:p-8
          `}
        >
          <div className="max-w-4xl mx-auto">
            {/* Desktop Header */}
            <div className="hidden lg:block mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Wink AI</h1>
              <p className="text-gray-600 dark:text-gray-400">Парсинг и анализ сценариев</p>
            </div>

            {/* File Upload Section */}
            {!currentScenario && (
              <div className="mb-8">
                <FileUpload onFileSelect={handleFileSelect} selectedFile={selectedFile} />

                {selectedFile && (
                  <button
                    onClick={handleParse}
                    disabled={loading}
                    className="mt-4 w-full lg:w-auto px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                  >
                    {loading ? 'Обработка...' : 'Парсить сценарий'}
                  </button>
                )}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-500 rounded-lg text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Loading State */}
            {loading && <Loader />}

            {/* Scenes Display */}
            {!loading && scenes.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Результаты парсинга
                  </h2>
                  {currentScenario && (
                    <button
                      onClick={handleNewScenario}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg transition-colors text-sm"
                    >
                      Новый сценарий
                    </button>
                  )}
                </div>
                {scenes.map((scene, index) => (
                  <SceneCard key={scene.id || index} scene={scene} index={index} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && scenes.length === 0 && !selectedFile && !currentScenario && (
              <div className="text-center py-12 text-gray-400 dark:text-gray-500">
                <p>Загрузите файл для начала работы</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

'use client'

import React, { useState, useEffect } from 'react'
import { Scenario } from '@/types'
import { getScenarios, deleteScenario } from '@/lib/storage'
import { useTheme } from '@/contexts/ThemeContext'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  onSelectScenario: (scenario: Scenario) => void
  onNewScenario: () => void
  refreshTrigger?: number
}

export default function Sidebar({
  isOpen,
  onClose,
  onSelectScenario,
  onNewScenario,
  refreshTrigger,
}: SidebarProps) {
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    setScenarios(getScenarios())
  }, [refreshTrigger])

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    deleteScenario(id)
    setScenarios(getScenarios())
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <>
      {/* Overlay для мобильной версии */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
          z-50 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">История</h2>
            <div className="flex items-center gap-2">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-500 transition-colors"
                title={
                  theme === 'dark' ? 'Переключить на светлую тему' : 'Переключить на темную тему'
                }
              >
                {theme === 'dark' ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                )}
              </button>
              <button
                onClick={onClose}
                className="lg:hidden text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* New Scenario Button */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <button
              onClick={() => {
                onNewScenario()
                onClose()
              }}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Создать новый
            </button>
          </div>

          {/* Scenarios List */}
          <div className="flex-1 overflow-y-auto">
            {scenarios.length === 0 ? (
              <div className="p-6 text-center text-gray-400 dark:text-gray-500">
                <p>Нет сохраненных сценариев</p>
              </div>
            ) : (
              <div className="p-2">
                {scenarios.map((scenario) => (
                  <div
                    key={scenario.id}
                    onClick={() => {
                      onSelectScenario(scenario)
                      onClose()
                    }}
                    className="p-4 mb-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-gray-900 dark:text-white font-medium truncate mb-1">
                          {scenario.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {formatDate(scenario.date)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {scenario.result.length} сцен
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleDelete(e, scenario.id)}
                        className="ml-2 text-gray-400 dark:text-gray-500 hover:text-red-400 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}

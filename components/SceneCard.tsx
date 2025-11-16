'use client'

import React from 'react'
import { Scene } from '@/types'

interface Props {
  scene: any
  index: number
}

export default function SceneCard({ scene }: Props) {
  const a = scene.analysis

  return (
    <div
      className="
        w-full p-8 mb-8 rounded-2xl
        bg-zinc-800/60 backdrop-blur-xl
        border border-zinc-700/70
        shadow-[0_0_25px_rgba(0,0,0,0.25)]
        transition duration-300 hover:shadow-[0_0_35px_rgba(0,0,0,0.45)]
      "
    >
      {/* Заголовок сцены */}
      <h2 className="text-2xl font-bold text-white tracking-wide mb-4">{scene.scene_header}</h2>

      <div className="h-px w-full bg-zinc-700/60 mb-6" />

      {/* ДИНАМИЧЕСКИЙ РЕНДЕР ВСЕХ КАТЕГОРИЙ */}
      {Object.entries(a).map(([key, value]) => {
        const items = Array.isArray(value) ? value : value ? [value] : []
        return <Category key={key} title={key} icon={ICONS[key] || '📌'} items={items} />
      })}
    </div>
  )
}

/* -------------------------
   ИКОНКИ ДЛЯ ВСЕХ КАТЕГОРИЙ
--------------------------- */
const ICONS: Record<string, string> = {
  Персонажи: '👥',
  Массовка: '🧍‍♀️',
  Реквизит: '📦',
  Грим: '🎭',
  Костюмы: '👗',
  Эффекты: '✨',
}

/* -------------------------
   КОМПОНЕНТ КАТЕГОРИИ
--------------------------- */
interface CatProps {
  title: string
  icon: string
  items: string[]
}

function Category({ title, icon, items }: CatProps) {
  const hasItems = items.length > 0

  return (
    <div className="mb-6">
      {/* Заголовок блока */}
      <div className="flex items-center space-x-2 mb-3">
        <span className="text-lg">{icon}</span>
        <span className="text-white font-semibold text-lg tracking-wide">{title}</span>
      </div>

      {/* Если пусто → один серый тег */}
      {!hasItems ? (
        <div className="pl-7">
          <span
            className="
              px-3 py-1 rounded-full
              text-xs font-medium
              bg-zinc-900/40 text-gray-500
              border border-zinc-700/40
            "
          >
            ничего не найдено
          </span>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2 pl-7">
          {items.map((item, idx) => (
            <span
              key={idx}
              className="
                px-3 py-1 rounded-full
                text-xs font-medium
                bg-zinc-900/80 text-gray-200
                border border-zinc-700/70
                backdrop-blur-sm
                shadow-sm
                hover:bg-zinc-700/50 transition
              "
            >
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

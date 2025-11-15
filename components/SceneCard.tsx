'use client'

import React from 'react'
import { Scene } from '@/types'

interface SceneCardProps {
  scene: Scene
  index: number
}

export default function SceneCard({ scene, index }: SceneCardProps) {
  const analysis = scene.analysis || {}

  const renderGroup = (title: string, items: any) => {
    if (!items) return null

    const normalized = Array.isArray(items) ? items : typeof items === 'string' ? [items] : []

    if (normalized.length === 0) return null

    return (
      <div className="mt-4">
        <h4 className="text-md font-semibold text-gray-300 mb-2">{title}</h4>

        <div className="flex flex-wrap gap-2">
          {normalized.map((item: string, i: number) => (
            <span
              key={i}
              className="inline-flex items-center text-xs px-2 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-zinc-800 rounded-xl shadow-md border border-zinc-700">
      <h3 className="text-xl font-bold text-white mb-2">
        {scene.scene_header || `Сцена ${index + 1}`}
      </h3>

      <p className="text-sm text-zinc-300 whitespace-pre-line mb-4">{scene.content || '—'}</p>

      {/* Блоки анализа */}
      {renderGroup('Персонажи', analysis['Персонажи'])}
      {renderGroup('Массовка', analysis['Массовка'])}
      {renderGroup('Реквизит', analysis['Реквизит'])}
      {renderGroup('Грим', analysis['Грим'])}
      {renderGroup('Костюмы', analysis['Костюмы'])}
      {renderGroup('Эффекты', analysis['Эффекты'])}
    </div>
  )
}

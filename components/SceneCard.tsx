import React from 'react'
import { Scene } from '@/types'

interface SceneCardProps {
  scene: Scene
  index: number
}

export default function SceneCard({ scene, index }: SceneCardProps) {
  return (
    <div
      className="bg-white dark:bg-gray-800 border-l-4 border-orange-500 rounded-lg p-6 shadow-lg animate-fade-in"
      style={{
        animationDelay: `${index * 0.1}s`,
      }}
    >
      {scene.title && (
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{scene.title}</h3>
      )}
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
        {scene.content}
      </p>
    </div>
  )
}

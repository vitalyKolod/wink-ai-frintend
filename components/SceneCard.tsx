'use client'

import SceneField from './SceneField'
import { Scene } from '@/types/scenario'

export default function SceneCard({ scene }: { scene: Scene }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black">
      <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-orange-500 to-red-500" />

      <div className="p-6">
        <h2 className="text-lg font-semibold text-orange-400 mb-3">{scene.scene_header}</h2>

        <SceneField title="Персонажи" items={scene.analysis.Персонажи} />
        <SceneField title="Массовка" items={scene.analysis.Массовка} />
        <SceneField title="Реквизит" items={scene.analysis.Реквизит} />
        <SceneField title="Эффекты" items={scene.analysis.Эффекты} />

        <div className="flex gap-4 mt-4 text-sm">
          <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700">
            Грим: <b>{scene.analysis.Грим}</b>
          </span>

          <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700">
            Костюмы: <b>{scene.analysis.Костюмы}</b>
          </span>
        </div>
      </div>
    </div>
  )
}

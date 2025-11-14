export type SceneAnalysis = {
  Персонажи: string[]
  Массовка: string[]
  Реквизит: string[]
  Грим: string
  Костюмы: string
  Эффекты: string[]
}

export type Scene = {
  scene_header: string
  analysis: SceneAnalysis
}

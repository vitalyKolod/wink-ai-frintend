export interface Scene {
  id?: string
  title?: string
  content: string
  [key: string]: any
}

export interface Scenario {
  id: string
  name: string
  date: string
  result: Scene[]
}

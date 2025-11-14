import { Scenario } from '@/types'

const STORAGE_KEY = 'wink-ai-scenarios'

export function getScenarios(): Scenario[] {
  if (typeof window === 'undefined') return []

  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Error reading scenarios from localStorage:', error)
    return []
  }
}

export function saveScenario(scenario: Scenario): void {
  if (typeof window === 'undefined') return

  try {
    const scenarios = getScenarios()
    scenarios.push(scenario)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios))
  } catch (error) {
    console.error('Error saving scenario to localStorage:', error)
  }
}

export function deleteScenario(id: string): void {
  if (typeof window === 'undefined') return

  try {
    const scenarios = getScenarios()
    const filtered = scenarios.filter((s) => s.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))

    // Если удаляемый сценарий был текущим, очищаем сохраненный ID
    const currentId = getCurrentScenarioId()
    if (currentId === id) {
      clearCurrentScenarioId()
    }
  } catch (error) {
    console.error('Error deleting scenario from localStorage:', error)
  }
}

const CURRENT_SCENARIO_KEY = 'wink-ai-current-scenario-id'

export function getCurrentScenarioId(): string | null {
  if (typeof window === 'undefined') return null

  try {
    return localStorage.getItem(CURRENT_SCENARIO_KEY)
  } catch (error) {
    console.error('Error reading current scenario ID from localStorage:', error)
    return null
  }
}

export function setCurrentScenarioId(id: string | null): void {
  if (typeof window === 'undefined') return

  try {
    if (id) {
      localStorage.setItem(CURRENT_SCENARIO_KEY, id)
    } else {
      localStorage.removeItem(CURRENT_SCENARIO_KEY)
    }
  } catch (error) {
    console.error('Error saving current scenario ID to localStorage:', error)
  }
}

export function clearCurrentScenarioId(): void {
  setCurrentScenarioId(null)
}

export function getScenarioById(id: string): Scenario | null {
  const scenarios = getScenarios()
  return scenarios.find((s) => s.id === id) || null
}

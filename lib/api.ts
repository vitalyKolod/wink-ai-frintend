import { Scene } from '@/types'

const PY_API = 'http://127.0.0.1:8000/parse'

export async function parseScenario(formData: FormData): Promise<Scene[]> {
  try {
    const response = await fetch(PY_API, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Error parsing scenario:', error)
    throw error
  }
}

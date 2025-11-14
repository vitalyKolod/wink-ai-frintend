import { NextRequest, NextResponse } from 'next/server'
import { parseScenario } from '@/lib/api'

export async function POST(request: NextRequest) {
  let file: File | null = null
  let text: string | null = null

  try {
    const formData = await request.formData()

    // Проверяем наличие файла или текста
    file = formData.get('file') as File | null
    text = formData.get('text') as string | null

    if (!file && !text) {
      return NextResponse.json({ error: 'Необходимо предоставить файл или текст' }, { status: 400 })
    }

    // Если есть файл, отправляем его на Python backend
    if (file) {
      const pythonFormData = new FormData()
      pythonFormData.append('file', file)

      const scenes = await parseScenario(pythonFormData)
      return NextResponse.json(scenes)
    }

    // Если есть только текст, отправляем его на Python backend
    if (text) {
      const pythonFormData = new FormData()
      pythonFormData.append('text', text)

      const scenes = await parseScenario(pythonFormData)
      return NextResponse.json(scenes)
    }

    return NextResponse.json({ error: 'Неизвестная ошибка' }, { status: 500 })
  } catch (error: any) {
    console.error('Error in /api/parse:', error)

    // Если Python backend недоступен, возвращаем заглушку
    if (error.message?.includes('fetch failed') || error.message?.includes('ECONNREFUSED')) {
      // Заглушка: возвращаем пример данных
      const mockScenes = [
        {
          id: '1',
          title: 'Сцена 1',
          content: text || (file ? `Содержимое файла ${file.name}` : 'Пример сцены'),
        },
        {
          id: '2',
          title: 'Сцена 2',
          content: 'Это заглушка. Python backend будет подключен позже.',
        },
      ]

      return NextResponse.json(mockScenes)
    }

    return NextResponse.json(
      { error: error.message || 'Ошибка при обработке запроса' },
      { status: 500 }
    )
  }
}

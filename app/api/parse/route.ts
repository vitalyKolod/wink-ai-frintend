import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const file = formData.get('file') as File | null
    const text = formData.get('text') as string | null

    if (!file && !text) {
      return NextResponse.json({ error: 'Необходимо предоставить файл или текст' }, { status: 400 })
    }

    // --- Если есть файл ---
    if (file) {
      const backendForm = new FormData()
      backendForm.append('file', file)

      const response = await fetch('http://127.0.0.1:8000/parse_file', {
        method: 'POST',
        body: backendForm,
      })

      const data = await response.json()
      return NextResponse.json(data)
    }

    // --- Если есть текст ---
    if (text) {
      const response = await fetch('http://127.0.0.1:8000/parse_text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })

      const data = await response.json()
      return NextResponse.json(data)
    }

    return NextResponse.json({ error: 'Неизвестная ошибка' }, { status: 500 })
  } catch (error: any) {
    console.error('Ошибка в /api/parse:', error)

    return NextResponse.json({ error: error.message || 'Ошибка сервера' }, { status: 500 })
  }
}

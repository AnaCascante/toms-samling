'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegistrerPage() {
  const router = useRouter()
  const [type, setType] = useState<'movie' | 'vinyl'>('movie')
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('saving')

    const formData = new FormData(e.currentTarget)
    const data: Record<string, string> = {}
    formData.forEach((val, key) => { data[key] = val as string })
    data._type = type

    const res = await fetch('/api/registrer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (res.ok) {
      setStatus('success')
      e.currentTarget.reset()
      setTimeout(() => {
        router.push(type === 'movie' ? '/filmer' : '/vinyl')
      }, 1000)
    } else {
      setStatus('error')
    }
  }

  const movieFields = [
    { name: 'title', label: 'Tittel', required: true },
    { name: 'studio', label: 'Studio' },
    { name: 'year', label: 'År' },
    { name: 'genre', label: 'Sjanger' },
    { name: 'mainActors', label: 'Skuespillere' },
    { name: 'format', label: 'Format' },
    { name: 'condition', label: 'Tilstand' },
    { name: 'language', label: 'Språk' },
    { name: 'duration', label: 'Varighet (min)' },
    { name: 'rating', label: 'Vurdering' },
    { name: 'price', label: 'Pris' },
    { name: 'coverUrl', label: 'Cover URL' },
    { name: 'notes', label: 'Notater' },
  ]

  const vinylFields = [
    { name: 'title', label: 'Tittel', required: true },
    { name: 'artist', label: 'Artist' },
    { name: 'year', label: 'År' },
    { name: 'genre', label: 'Sjanger' },
    { name: 'format', label: 'Format' },
    { name: 'condition', label: 'Tilstand' },
    { name: 'price', label: 'Pris' },
    { name: 'coverUrl', label: 'Cover URL' },
    { name: 'notes', label: 'Notater' },
  ]

  const fields = type === 'movie' ? movieFields : vinylFields

  return (
    <main className="min-h-screen bg-gray-950 text-white

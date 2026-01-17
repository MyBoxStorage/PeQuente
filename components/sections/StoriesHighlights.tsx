'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Story {
  id: string
  title: string
  emoji: string
  category: string
  bgImage: string
  link: string
}

export function StoriesHighlights() {
  const [stories, setStories] = useState<Story[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  useEffect(() => {
    fetch('/stories.json')
      .then((res) => res.json())
      .then((data) => setStories(data.stories))
      .catch((err) => console.error('Erro ao carregar stories:', err))
  }, [])

  useEffect(() => {
    const checkScroll = () => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
        setCanScrollLeft(scrollLeft > 0)
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
      }
    }

    checkScroll()
    const scrollElement = scrollRef.current
    scrollElement?.addEventListener('scroll', checkScroll)
    window.addEventListener('resize', checkScroll)

    return () => {
      scrollElement?.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [stories])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  if (stories.length === 0) return null

  return (
    <section className="relative w-full py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Descubra por Categoria</h2>
          <p className="text-base text-gray-600 mt-2">Navegue rápido pelo que você procura</p>
        </div>

        <div className="relative px-8 md:px-12">
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
              aria-label="Rolar para esquerda"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          <div
            ref={scrollRef}
            className="flex gap-6 md:gap-8 lg:gap-10 overflow-x-auto snap-x snap-mandatory justify-center md:justify-start pb-4"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {stories.map((story) => (
              <Link
                key={story.id}
                href={story.link}
                className="group relative flex-shrink-0 snap-center"
              >
                <div className="relative w-32 h-48 md:w-40 md:h-56 lg:w-44 lg:h-60 rounded-2xl overflow-hidden ring-2 ring-orange-500 shadow-lg group-hover:ring-4 group-hover:ring-orange-600 group-hover:shadow-2xl group-active:scale-95 transition-all duration-300 ease-out group-hover:scale-105">
                  <Image
                    src={story.bgImage}
                    alt={story.title}
                    fill
                    className="object-cover opacity-40"
                    sizes="(max-width: 768px) 128px, (max-width: 1024px) 160px, 176px"
                  />

                  <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />

                  <div className="relative h-full flex flex-col items-center justify-center p-4">
                    <div className="text-5xl md:text-6xl lg:text-7xl mb-3 group-hover:scale-110 transition-transform duration-300">
                      {story.emoji}
                    </div>
                    <p className="text-white text-sm md:text-base lg:text-lg font-semibold text-center leading-tight">
                      {story.title}
                    </p>
                  </div>

                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full" 
                    style={{ transition: 'transform 0.6s ease-in-out, opacity 0.3s' }} 
                  />
                </div>
              </Link>
            ))}
          </div>

          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
              aria-label="Rolar para direita"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        div[ref]::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}

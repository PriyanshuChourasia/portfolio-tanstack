import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'
import type { Testimonial, ColorTheme } from '../types'

interface TestimonialsSectionProps {
  testimonials: Array<Testimonial>
  theme: ColorTheme
}

export function TestimonialsSection({ testimonials, theme }: TestimonialsSectionProps) {
  const [current, setCurrent] = useState(0)

  if (testimonials.length === 0) return null

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length)
  const next = () => setCurrent((c) => (c + 1) % testimonials.length)

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden py-24 sm:py-32"
      style={{ backgroundColor: theme.background, color: theme.text }}
    >
      {/* Decorative background */}
      <div
        className="pointer-events-none absolute -right-40 -top-40 size-[500px] rounded-full opacity-5 blur-3xl"
        style={{ backgroundColor: theme.accent }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 -left-40 size-[500px] rounded-full opacity-5 blur-3xl"
        style={{ backgroundColor: theme.accent }}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p
            className="mb-3 inline-block rounded-full px-4 py-1.5 text-sm font-medium tracking-wide"
            style={{
              backgroundColor: `${theme.accent}15`,
              color: theme.accent,
            }}
          >
            Testimonials
          </p>
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            What Clients Say
          </h2>
          <div
            className="mx-auto mt-4 h-1 w-20 rounded-full"
            style={{ backgroundColor: theme.accent }}
          />
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="mx-auto max-w-2xl text-center"
            >
              {/* Quote icon */}
              <div
                className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full"
                style={{ backgroundColor: `${theme.accent}12` }}
              >
                <Quote className="size-6" style={{ color: theme.accent }} />
              </div>

              {/* Quote text */}
              <blockquote
                className="mb-8 text-lg leading-relaxed italic sm:text-xl"
                style={{ color: theme.textMuted }}
              >
                "{testimonials[current].quote}"
              </blockquote>

              {/* Avatar */}
              <div className="flex items-center justify-center gap-4">
                {testimonials[current].avatar ? (
                  <img
                    src={testimonials[current].avatar}
                    alt={testimonials[current].name}
                    className="size-14 rounded-full object-cover ring-2"
                    style={{ ringColor: theme.accent }}
                  />
                ) : (
                  <div
                    className="flex size-14 items-center justify-center rounded-full text-xl font-bold"
                    style={{ backgroundColor: `${theme.accent}20`, color: theme.accent }}
                  >
                    {testimonials[current].name.charAt(0)}
                  </div>
                )}
                <div className="text-left">
                  <p className="font-semibold">{testimonials[current].name}</p>
                  <p className="text-sm" style={{ color: theme.textMuted }}>
                    {testimonials[current].role} at {testimonials[current].company}
                  </p>
                </div>
              </div>

              {/* Stars */}
              <div className="mt-4 flex justify-center gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className="size-4"
                    fill={i < testimonials[current].rating ? theme.accent : 'none'}
                    stroke={i < testimonials[current].rating ? theme.accent : `${theme.textMuted}40`}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {testimonials.length > 1 && (
            <div className="mt-10 flex items-center justify-center gap-4">
              <button
                onClick={prev}
                className="flex size-10 items-center justify-center rounded-full transition-all duration-200 hover:-translate-x-1"
                style={{
                  backgroundColor: `${theme.accent}15`,
                  color: theme.accent,
                }}
              >
                <ChevronLeft className="size-5" />
              </button>

              {/* Dots */}
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: i === current ? 24 : 8,
                      height: 8,
                      backgroundColor: i === current ? theme.accent : `${theme.textMuted}30`,
                    }}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className="flex size-10 items-center justify-center rounded-full transition-all duration-200 hover:translate-x-1"
                style={{
                  backgroundColor: `${theme.accent}15`,
                  color: theme.accent,
                }}
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

import stackData from '@/data/stack-data.json'
import { cn } from '@/lib/utils'

type Layer = (typeof stackData.layers)[number]
type Tool = Layer['tools'][number]

const products: Array<string> = stackData.products
const layers: Array<Layer> = stackData.layers

// Violet deepens to pale going down the stack, so the rows read as one block
const LAYER_ACCENTS = [
  '#441573',
  '#5D3088',
  '#764A9D',
  '#8F65B3',
  '#A87FC8',
  '#C19ADD',
] as const

const TOOL_CHIP =
  'inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-800 transition-colors duration-200 hover:border-[#C19ADD] hover:bg-[#C19ADD]/10 focus-visible:ring-2 focus-visible:ring-[#C19ADD] focus-visible:outline-none'

export default function StackSection() {
  const reducedMotion = Boolean(useReducedMotion())

  // null = show everything at full strength
  const [activeProduct, setActiveProduct] = useState<string | null>(null)

  const isUsedIn = (tool: Tool) =>
    activeProduct === null || tool.products.includes(activeProduct)

  const layerIsUsed = (layer: Layer) => layer.tools.some(isUsedIn)

  const filterOptions = ['All', ...products]

  return (
    <section
      id="stack"
      className="relative w-full scroll-mt-24 border-t border-gray-200 bg-[#FAFAFA] pt-10 pb-20 md:pt-14 md:pb-28"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-10 lg:px-12">
        {/* =====================================================
            HEADER
        ===================================================== */}
        <motion.header
          initial={reducedMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-10"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-gray-500">
            04 / Stack
          </span>

          <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] text-gray-900 md:text-5xl lg:text-6xl">
            The stack behind the products
            <span className="text-gray-400">.</span>
          </h2>

          <p className="mt-4 max-w-xl text-gray-600">
            Every product is a stack of layers. Here&apos;s what sits in each
            one, and where it shipped.
          </p>
        </motion.header>

        {/* =====================================================
            PRODUCT FILTER
        ===================================================== */}
        <div className="mb-8 flex flex-wrap gap-2">
          {filterOptions.map((option) => {
            const isActive =
              option === 'All'
                ? activeProduct === null
                : activeProduct === option

            return (
              <button
                key={option}
                type="button"
                onClick={() =>
                  setActiveProduct(option === 'All' ? null : option)
                }
                aria-pressed={isActive}
                className={cn(
                  'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[#C19ADD] focus-visible:outline-none',
                  isActive
                    ? 'border-[#8353AD] bg-[#8353AD] text-white'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-[#C19ADD]',
                )}
              >
                {option}
              </button>
            )
          })}
        </div>

        {/* =====================================================
            THE STACK
        ===================================================== */}
        <div className="relative">
          {/* Soft light violet glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-16 -right-12 h-72 w-72 rounded-full bg-[#C19ADD]/20 blur-3xl"
          />

          <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_24px_64px_rgba(0,0,0,0.06)]">
            {layers.map((layer, i) => {
              const layerUsed = layerIsUsed(layer)
              const isDimmed = activeProduct !== null && !layerUsed

              return (
                <motion.div
                  key={layer.id}
                  initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.6,
                    ease: 'easeOut',
                    delay: reducedMotion ? 0 : i * 0.08,
                  }}
                  className={cn(
                    'relative grid grid-cols-1 gap-4 p-6 transition-opacity duration-200 md:grid-cols-[220px_1fr] md:p-8',
                    // First row sits flush with the rounded top edge
                    i > 0 && 'border-t border-gray-100',
                    isDimmed && 'opacity-50',
                  )}
                >
                  {/* Left accent bar */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-0 left-0 w-[3px]"
                    style={{
                      backgroundColor:
                        LAYER_ACCENTS[i % LAYER_ACCENTS.length],
                    }}
                  />

                  {/* Layer label */}
                  <div className="pl-3">
                    <span className="font-mono text-xs text-[#8353AD]">
                      L{i + 1}
                    </span>

                    <h3 className="mt-1 text-xl font-bold text-gray-900">
                      {layer.name}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {activeProduct !== null && !layerUsed
                        ? `Not used in ${activeProduct}`
                        : layer.caption}
                    </p>
                  </div>

                  {/* Tools */}
                  <div className="flex flex-wrap gap-2">
                    {layer.tools.map((tool) => (
                      <span
                        key={tool.name}
                        title={
                          tool.products.length > 0
                            ? `Used in: ${tool.products.join(', ')}`
                            : 'General skill'
                        }
                        className={cn(
                          TOOL_CHIP,
                          'transition-all duration-200',
                          !isUsedIn(tool) && 'opacity-30 grayscale',
                        )}
                      >
                        {tool.name}

                        {tool.products.length > 0 && (
                          <span className="font-mono text-[10px] text-gray-400">
                            {tool.products.length}
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
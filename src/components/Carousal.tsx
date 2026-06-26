import { motion } from 'framer-motion'

const DOT_POSITIONS = [
  { x: '4%', y: '14%' }, { x: '10%', y: '38%' }, { x: '7%', y: '65%' },
  { x: '18%', y: '9%' }, { x: '22%', y: '52%' }, { x: '16%', y: '80%' },
  { x: '30%', y: '20%' }, { x: '34%', y: '72%' }, { x: '42%', y: '11%' },
  { x: '39%', y: '45%' }, { x: '48%', y: '30%' }, { x: '36%', y: '88%' },
  { x: '52%', y: '58%' }, { x: '58%', y: '17%' }, { x: '2%', y: '28%' },
  { x: '26%', y: '93%' }, { x: '46%', y: '76%' }, { x: '14%', y: '96%' },
]

function ScatteredDots() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0" aria-hidden>
      {DOT_POSITIONS.map((pos, i) => (
        <div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-gray-300/70 dark:bg-gray-600/50"
          style={{ left: pos.x, top: pos.y }}
        />
      ))}
    </div>
  )
}

function ServerRackPanel() {
  const SHELF_Y = [100, 175, 250, 325, 395]
  const NUM_COLS = 14

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ background: '#07050300' }}
    >
      {/* Dark base */}
      <div
        className="absolute inset-0"
        style={{ background: '#08060400' }}
      />

      {/* Warm amber radial glow from pendant */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            'radial-gradient(ellipse 75% 60% at 50% -2%, rgba(251,191,36,0.42) 0%, rgba(217,119,6,0.22) 35%, rgba(120,60,0,0.08) 60%, transparent 75%)',
        }}
      />

      {/* SVG line art */}
      <svg
        viewBox="0 0 700 500"
        className="w-full h-full absolute inset-0"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        {/* Pendant lamp */}
        <line x1="350" y1="0" x2="350" y2="14" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" />
        <polygon
          points="316,14 384,14 368,32 332,32"
          fill="rgba(255,215,80,0.12)"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="1.5"
        />
        <circle cx="350" cy="23" r="3.5" fill="rgba(255,215,80,0.9)" />

        {/* Outer rack frame */}
        <rect x="18" y="42" width="664" height="448" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="2" />

        {/* Horizontal shelf dividers */}
        {SHELF_Y.map((y) => (
          <line
            key={y}
            x1="18"
            y1={y}
            x2="682"
            y2={y}
            stroke="rgba(255,255,255,0.32)"
            strokeWidth="1.5"
          />
        ))}

        {/* Server unit cells per row */}
        {[
          [42, 100],
          [100, 175],
          [175, 250],
          [250, 325],
          [325, 395],
          [395, 490],
        ].map(([y1, y2], rowIdx) => {
          const cellW = 664 / NUM_COLS
          return Array.from({ length: NUM_COLS }).map((_, colIdx) => (
            <rect
              key={`${rowIdx}-${colIdx}`}
              x={18 + colIdx * cellW + 1.5}
              y={y1 + 2}
              width={cellW - 3}
              height={y2 - y1 - 4}
              stroke="rgba(255,255,255,0.17)"
              strokeWidth="0.9"
            />
          ))
        })}
      </svg>

      {/* Dark gradient at bottom edge to blend */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(8,6,4,0.5))',
        }}
      />
    </div>
  )
}

function DeveloperDeskIllustration() {
  return (
    <svg
      viewBox="0 0 400 260"
      className="w-full max-w-[480px] mx-auto"
      fill="none"
      stroke="#2d2d2d"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ── Desk surface ── */}
      <line x1="30" y1="188" x2="370" y2="188" strokeWidth="2.5" />

      {/* ── Desk legs ── */}
      <line x1="48" y1="188" x2="48" y2="240" strokeWidth="2" />
      <line x1="352" y1="188" x2="352" y2="240" strokeWidth="2" />

      {/* ── Centre monitor (main / tallest) ── */}
      <rect x="165" y="110" width="70" height="50" rx="2" strokeWidth="1.8" />
      <line x1="200" y1="160" x2="200" y2="175" strokeWidth="1.5" />
      <line x1="187" y1="175" x2="213" y2="175" strokeWidth="1.5" />
      {/* screen content lines */}
      {[5, 10, 15, 20, 25, 30].map((dy) => (
        <line key={dy} x1="170" y1={110 + dy} x2="228" y2={110 + dy} stroke="#888" strokeWidth="0.6" />
      ))}

      {/* ── Left monitor ── */}
      <rect x="82" y="118" width="62" height="44" rx="2" strokeWidth="1.8" />
      <line x1="113" y1="162" x2="113" y2="174" strokeWidth="1.5" />
      <line x1="102" y1="174" x2="124" y2="174" strokeWidth="1.5" />
      {[5, 10, 15].map((dy) => (
        <line key={dy} x1="87" y1={118 + dy} x2="140" y2={118 + dy} stroke="#888" strokeWidth="0.6" />
      ))}

      {/* ── Right monitor ── */}
      <rect x="256" y="118" width="62" height="44" rx="2" strokeWidth="1.8" />
      <line x1="287" y1="162" x2="287" y2="174" strokeWidth="1.5" />
      <line x1="276" y1="174" x2="298" y2="174" strokeWidth="1.5" />
      {[5, 10, 15].map((dy) => (
        <line key={dy} x1="261" y1={118 + dy} x2="314" y2={118 + dy} stroke="#888" strokeWidth="0.6" />
      ))}

      {/* ── Small side screen (far left) ── */}
      <rect x="38" y="130" width="35" height="26" rx="2" strokeWidth="1.5" />
      <line x1="56" y1="156" x2="56" y2="164" strokeWidth="1.3" />

      {/* ── Keyboard ── */}
      <rect x="172" y="181" width="56" height="9" rx="2" strokeWidth="1.5" />

      {/* ── Chair back ── */}
      <path
        d="M162 226 Q162 195 172 192 L228 192 Q238 195 238 226 Z"
        strokeWidth="1.8"
      />

      {/* ── Person: body (hoodie shoulders) ── */}
      <path
        d="M168 210 C164 200 164 196 172 192 L228 192 C236 196 236 200 232 210 C226 222 174 222 168 210 Z"
        strokeWidth="1.8"
      />

      {/* ── Person: head ── */}
      <ellipse cx="200" cy="176" rx="20" ry="17" strokeWidth="1.8" />

      {/* ── Spiky hair ── */}
      <path
        d="M182,165 L179,155 L185,163 L183,150 L189,161 L188,148 L194,160 L195,146 L200,159 L205,147 L207,160 L213,150 L212,163 L217,155 L216,165"
        strokeWidth="1.4"
      />

      {/* ── Chair legs / wheels ── */}
      <line x1="180" y1="226" x2="170" y2="248" strokeWidth="1.5" />
      <line x1="220" y1="226" x2="230" y2="248" strokeWidth="1.5" />
      <line x1="200" y1="228" x2="200" y2="250" strokeWidth="1.5" />
      {/* wheel dots */}
      <circle cx="170" cy="249" r="3" stroke="#555" strokeWidth="1.2" />
      <circle cx="230" cy="249" r="3" stroke="#555" strokeWidth="1.2" />
      <circle cx="200" cy="251" r="3" stroke="#555" strokeWidth="1.2" />

      {/* ── Cables hanging below desk ── */}
      <path d="M200 188 Q202 200 198 210" stroke="#666" strokeWidth="1.2" />
      <path d="M240 188 Q244 198 242 208" stroke="#666" strokeWidth="1.2" />
    </svg>
  )
}

function HeroCTAs() {
  return (
    <div className="flex flex-wrap gap-4 pt-2">
      <a
        href="/resume.pdf"
        download
        className="px-6 py-3 rounded-full border border-gray-400 dark:border-gray-600 text-sm font-medium text-gray-600 dark:text-gray-300 hover:border-gray-600 dark:hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-200"
      >
        Download CV
      </a>
      <a
        href="#contact"
        className="px-6 py-3 rounded-full border border-gray-800 dark:border-gray-200 text-sm font-semibold text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-200"
      >
        Get in Touch
      </a>
    </div>
  )
}

function HeroContent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65 }}
      className="space-y-6 max-w-xl"
    >
      <p className="text-sm tracking-wide text-gray-400 dark:text-gray-500">
        Welcome to my portfolio
      </p>

      <h1 className="hero-heading leading-none">
        <span className="block">
          <span className="hero-text-outline">Hi I&apos;m </span>
          <span className="hero-text-outline-muted">Priyanshu</span>
        </span>
        <span className="block hero-text-outline">Chourasia</span>
      </h1>

      <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed max-w-sm">
        A Full-Stack Developer specializing in backend development
        and design-driven frontend solutions, with end-to-end project
        delivery and a pragmatic use of AI tools.
      </p>

      <HeroCTAs />
    </motion.div>
  )
}

export function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-white dark:bg-[#111111]"
    >
      {/* Scattered background dots */}
      <ScatteredDots />

      {/* ── Upper: left text + right dark panel ── */}
      <div className="relative flex min-h-[68vh] lg:min-h-[72vh]">
        {/* Left: content */}
        <div className="relative z-10 flex flex-1 items-center px-8 sm:px-12 lg:px-20 xl:px-28 py-24 pt-28 lg:max-w-[56%]">
          <HeroContent />
        </div>

        {/* Right: server-rack dark panel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="hidden lg:block relative flex-1 lg:max-w-[44%]"
          style={{ background: '#08060400' }}
        >
          {/* Dark background fill */}
          <div className="absolute inset-0" style={{ background: '#0a0805' }} />
          <ServerRackPanel />
        </motion.div>
      </div>

      {/* ── Lower: developer desk illustration ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.35 }}
        className="relative z-10 flex justify-center pb-12 -mt-4"
      >
        <DeveloperDeskIllustration />
      </motion.div>
    </section>
  )
}

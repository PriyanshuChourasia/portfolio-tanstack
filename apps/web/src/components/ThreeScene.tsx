import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import {
  FaGithub,
  FaJava,
  FaLinkedin,
  FaXTwitter,
} from 'react-icons/fa6'
import { GoMail } from 'react-icons/go'
import {
  SiAnthropic,
  SiCss,
  SiDocker,
  SiFlutter,
  SiGit,
  SiGo,
  SiHtml5,
  SiJavascript,
  SiLaravel,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenai,
  SiPostgresql,
  SiPython,
  SiReact,
  SiSpringboot,
  SiTailwindcss,
  SiTypescript,
} from 'react-icons/si'

interface ThreeSceneProps {
  isDark: boolean
}

type IconDef = {
  Icon: React.ComponentType<any>
  label: string
}

const SKILL_ICONS: Array<IconDef> = [
  { Icon: SiReact, label: 'React' },
  { Icon: SiTypescript, label: 'TypeScript' },
  { Icon: SiJavascript, label: 'JavaScript' },
  { Icon: SiNodedotjs, label: 'Node.js' },
  { Icon: SiPython, label: 'Python' },
  { Icon: SiNextdotjs, label: 'Next.js' },
  { Icon: SiTailwindcss, label: 'Tailwind' },
  { Icon: SiDocker, label: 'Docker' },
  { Icon: SiGit, label: 'Git' },
  { Icon: SiHtml5, label: 'HTML' },
  { Icon: SiCss, label: 'CSS' },
  { Icon: FaJava, label: 'Java' },
  { Icon: SiGo, label: 'Go' },
  { Icon: SiMongodb, label: 'MongoDB' },
  { Icon: SiMysql, label: 'MySQL' },
  { Icon: SiPostgresql, label: 'PostgreSQL' },
  { Icon: SiSpringboot, label: 'Spring Boot' },
  { Icon: SiLaravel, label: 'Laravel' },
  { Icon: SiFlutter, label: 'Flutter' },
  { Icon: SiOpenai, label: 'OpenAI' },
  { Icon: SiAnthropic, label: 'Anthropic' },
]

const SOCIAL_ICONS: Array<IconDef> = [
  { Icon: FaGithub, label: 'Github' },
  { Icon: FaLinkedin, label: 'LinkedIn' },
  { Icon: GoMail, label: 'Email' },
  { Icon: FaXTwitter, label: 'Twitter' },
]

const ALL_ICONS: Array<IconDef> = [...SKILL_ICONS, ...SOCIAL_ICONS]

// ---- seeded random (deterministic layout) ----
function seeded(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

// Compute deterministic position for each icon (percentage-based)
const ICON_POSITIONS: Array<{ x: number; y: number; amp: number; dur: number; delay: number }> = ALL_ICONS.map((_, i) => {
  const sx = seeded(i * 7.3 + 17.11)
  const sy = seeded(i * 2.13 + 5)
  const amp = 6 + seeded(i * 5.3 + 3) * 10
  const dur = 3.5 + seeded(i * 2.7 + 11) * 3
  const delay = seeded(i * 3.1 + 7) * 2
  return { x: sx * 100, y: sy * 100, amp, dur, delay }
})

// ---- shader sources ----
const vertexShader = `
  uniform float uTime;
  uniform float uAmplitude;
  uniform float uFrequency;
  uniform float uSpeed;

  varying float vElevation;
  varying vec2  vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float layeredNoise(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 3; i++) {
      vec2 g = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      float n00 = hash(g + vec2(0.0, 0.0));
      float n10 = hash(g + vec2(1.0, 0.0));
      float n01 = hash(g + vec2(0.0, 1.0));
      float n11 = hash(g + vec2(1.0, 1.0));
      float nx0 = mix(n00, n10, u.x);
      float nx1 = mix(n01, n11, u.x);
      float n = mix(nx0, nx1, u.y);
      v += a * n;
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vUv = uv;
    vec2 pos = uv * 3.0;
    float dist = length(uv - 0.5);
    float falloff = 1.0 - smoothstep(0.0, 0.7, dist);
    float wave  = layeredNoise(pos + uTime * uSpeed);
    float wave2 = sin(pos.x * uFrequency + uTime * uSpeed * 1.3)
                + cos(pos.y * uFrequency * 0.8 - uTime * uSpeed * 0.9);
    float elevation = (wave * 0.6 + wave2 * 0.4) * uAmplitude * falloff;
    vElevation = elevation;
    vec3 pos3 = position;
    pos3.z += elevation;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos3, 1.0);
  }
`

const fragmentShader = `
  uniform vec3  uDeepColor;
  uniform vec3  uShallowColor;
  uniform vec3  uHighlight;
  uniform float uTime;

  varying float vElevation;
  varying vec2  vUv;

  void main() {
    float t = clamp(vElevation * 6.0 + 0.5, 0.0, 1.0);
    vec3 base = mix(uDeepColor, uShallowColor, t);

    float dist = length(vUv - 0.5);
    float rim = 1.0 - smoothstep(0.0, 0.7, dist);
    float sparkle = sin(vUv.x * 120.0 + uTime * 1.5)
                  * sin(vUv.y * 120.0 - uTime * 1.2);
    sparkle = clamp(sparkle * 0.5 + 0.5, 0.0, 1.0);
    float glint = pow(sparkle, 3.0) * 0.6;

    vec3 col = mix(base, uHighlight, rim * 0.5 + glint);
    float spec = pow(max(0.0, sin(dist * 18.0 - uTime * 2.0)), 4.0) * 0.5;
    col += uHighlight * spec * rim;

    gl_FragColor = vec4(col, 0.92);
  }
`

// ---- Single floating icon (isolated component so hooks work) ----
function FloatingIcon({
  iconDef,
  position,
  pointer,
  iconSize,
  isActive,
}: {
  iconDef: IconDef
  position: (typeof ICON_POSITIONS)[number]
  pointer: { x: number; y: number }
  iconSize: number
  isActive: boolean
}) {
  const { Icon, label } = iconDef
  const { x: pctX, y: pctY, amp, dur, delay } = position

  // Resting position in pixels (percentage of viewport)
  const VIEW_W = typeof window !== 'undefined' ? window.innerWidth : 1200
  const VIEW_H = typeof window !== 'undefined' ? window.innerHeight : 800
  const restX = (pctX / 100) * VIEW_W
  const restY = (pctY / 100) * VIEW_H

  // Proximity-flight state: flee from cursor when within radius
  const PROXIMITY_RADIUS = 110
  const dx = pointer.x - restX
  const dy = pointer.y - restY
  const dist = Math.sqrt(dx * dx + dy * dy)
  const within = dist < PROXIMITY_RADIUS && dist > 0.01

  // flee vector (away from cursor), clamped magnitude
  let fleeOffX = 0
  let fleeOffY = 0
  if (within) {
    const t = Math.min(1, (PROXIMITY_RADIUS - dist) / PROXIMITY_RADIUS)
    const mag = t * t * 140  // quadratic falloff for a softer start
    fleeOffX = -(dx / dist) * mag
    fleeOffY = -(dy / dist) * mag
  }

  // Clamp the flight offset so the icon stays on screen
  const maxOffX = VIEW_W * 0.28
  const maxOffY = VIEW_H * 0.28
  const clampedOffX = Math.max(-maxOffX, Math.min(maxOffX, fleeOffX))
  const clampedOffY = Math.max(-maxOffY, Math.min(maxOffY, fleeOffY))

  return (
    <motion.div
      className="absolute pointer-events-auto flex items-center justify-center"
      style={{
        left: `${pctX}%`,
        top: `${pctY}%`,
        width: iconSize,
        height: iconSize,
        transform: 'translate(-50%, -50%)',
        opacity: isActive ? 0.9 : 0.55,
        filter: 'drop-shadow(0 0 8px rgba(125, 211, 252, 0.4))',
      }}
      animate={{
        x: within ? clampedOffX : 0,
        y: within ? clampedOffY : 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 180,
        damping: 14,
        mass: 1,
        restDelta: 0.001,
        // when cursor leaves, spring back to 0 quickly
        opacity: { duration: 0.3 },
      }}
      onHoverStart={() => {}}
      onHoverEnd={() => {}}
    >
      {/* Idle bob — only when not actively fleeing */}
      <motion.div
        animate={{
          y: within ? 0 : [0, -amp, 0, amp * 0.6, 0],
        }}
        transition={{
          duration: within ? 0 : dur,
          repeat: within ? 0 : Infinity,
          repeatType: 'loop',
          ease: 'easeInOut',
          delay,
        }}
      >
        <Icon
          className="h-8 w-8 text-white/40"
          title={label}
          aria-label={label}
        />
      </motion.div>
    </motion.div>
  )
}

// ---- Main scene ----
export function ThreeScene({ isDark }: ThreeSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)

  // Water color palette — switches with isDark
  const deepColor = useMemo(
    () => (isDark ? new THREE.Color('#0a1f3c') : new THREE.Color('#bae6fd')),
    [isDark],
  )
  const shallowColor = useMemo(
    () => (isDark ? new THREE.Color('#1e4a7a') : new THREE.Color('#7dd3fc')),
    [isDark],
  )
  const highlightColor = useMemo(
    () => new THREE.Color('#e0f2fe'),
    [],
  )

  // ---- WebGL water plane ----
  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    const canvas = canvasRef.current
    if (!canvas) return

    const w = mount.clientWidth || 1200
    const h = mount.clientHeight || 800

    const scene = new THREE.Scene()

    // Camera looking down at a slight angle onto the water surface
    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 1000)
    camera.position.set(0, -140, 200)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      canvas,
    })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)

    // Water plane — wide, moderately tall, high-resolution segments
    const geo = new THREE.PlaneGeometry(760, 440, 140, 90)
    const uniforms = {
      uTime: { value: 0 },
      uAmplitude: { value: 13.0 },
      uFrequency: { value: 0.9 },
      uSpeed: { value: 0.22 },
      uDeepColor: { value: deepColor },
      uShallowColor: { value: shallowColor },
      uHighlight: { value: highlightColor },
    }

    const mat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    })

    const mesh = new THREE.Mesh(geo, mat)
    mesh.rotation.x = -Math.PI / 6
    scene.add(mesh)

    // subtle ambient light so the plane has some base visibility
    const ambient = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambient)

    // Mouse parallax (gentle camera shift)
    const mouse = { tx: 0, ty: 0, cx: 0, cy: 0 }
    const onMouseMove = (e: MouseEvent) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 36
      mouse.ty = -(e.clientY / window.innerHeight - 0.5) * 36
    }
    window.addEventListener('mousemove', onMouseMove)

    const onResize = () => {
      const nw = mount.clientWidth || 1200
      const nh = mount.clientHeight || 800
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
      renderer.setSize(nw, nh)
    }
    window.addEventListener('resize', onResize)

    let running = true
    const animate = () => {
      if (!running) return
      rafRef.current = requestAnimationFrame(animate)
      uniforms.uTime.value += 0.016

      mouse.cx += (mouse.tx - mouse.cx) * 0.04
      mouse.cy += (mouse.ty - mouse.cy) * 0.04
      camera.position.x = mouse.cx
      camera.position.y = -140 + mouse.cy
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      running = false
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      geo.dispose()
      mat.dispose()
      scene.clear()
    }
    // Rebuild when theme (colors) change
  }, [isDark, deepColor, shallowColor, highlightColor])

  // ---- Pointer tracking for icon flight ----
  const [pointer, setPointer] = useState({ x: -99999, y: -99999 })
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setPointer({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  const ICON_SIZE = 36

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
    >
      {/* WebGL water plane */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{ willChange: 'transform' }}
      />

      {/* Floating icons — DOM layer above the canvas */}
      <div className="absolute inset-0 pointer-events-none">
        {ALL_ICONS.map((iconDef, i) => (
          <FloatingIcon
            key={iconDef.label}
            iconDef={iconDef}
            position={ICON_POSITIONS[i]}
            pointer={pointer}
            iconSize={ICON_SIZE}
            isActive={isDark}
          />
        ))}
      </div>
    </div>
  )
}

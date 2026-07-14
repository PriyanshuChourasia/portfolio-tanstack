import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface ThreeSceneProps {
  isDark: boolean
}

const PARTICLE_COUNT = 90
const CONNECTION_DISTANCE = 130
const SPREAD = 480
const MAX_LINES = PARTICLE_COUNT * 4

export function ThreeScene({ isDark }: ThreeSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const w = mount.clientWidth
    const h = mount.clientHeight

    // Scene & camera
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(70, w / h, 0.1, 2000)
    camera.position.z = 380

    // Renderer (transparent bg so CSS body gradient shows through)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    const particleColor = isDark ? 0x22d3ee : 0x3b82f6
    const lineColor = isDark ? 0x22d3ee : 0x6366f1
    const particleOpacity = isDark ? 0.75 : 0.55

    // --- Particles via Points (fast) ---
    const posArr = new Float32Array(PARTICLE_COUNT * 3)
    const velArr = new Float32Array(PARTICLE_COUNT * 3) // vx, vy only
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      posArr[i * 3] = (Math.random() - 0.5) * SPREAD
      posArr[i * 3 + 1] = (Math.random() - 0.5) * SPREAD
      posArr[i * 3 + 2] = (Math.random() - 0.5) * 80
      velArr[i * 3] = (Math.random() - 0.5) * 0.45
      velArr[i * 3 + 1] = (Math.random() - 0.5) * 0.45
    }

    const pGeo = new THREE.BufferGeometry()
    const pPosAttr = new THREE.BufferAttribute(posArr, 3)
    pPosAttr.setUsage(THREE.DynamicDrawUsage)
    pGeo.setAttribute('position', pPosAttr)

    const pMat = new THREE.PointsMaterial({
      color: particleColor,
      size: 2.8,
      transparent: true,
      opacity: particleOpacity,
      sizeAttenuation: true,
    })
    const points = new THREE.Points(pGeo, pMat)
    scene.add(points)

    // --- Lines via pre-allocated LineSegments ---
    const linePositions = new Float32Array(MAX_LINES * 2 * 3)
    const lGeo = new THREE.BufferGeometry()
    const lPosAttr = new THREE.BufferAttribute(linePositions, 3)
    lPosAttr.setUsage(THREE.DynamicDrawUsage)
    lGeo.setAttribute('position', lPosAttr)
    lGeo.setDrawRange(0, 0)

    const lMat = new THREE.LineBasicMaterial({
      color: lineColor,
      transparent: true,
      opacity: isDark ? 0.18 : 0.12,
    })
    const lineSegments = new THREE.LineSegments(lGeo, lMat)
    scene.add(lineSegments)

    // Mouse parallax
    const mouse = { tx: 0, ty: 0, cx: 0, cy: 0 }
    const onMouseMove = (e: MouseEvent) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 25
      mouse.ty = -(e.clientY / window.innerHeight - 0.5) * 25
    }
    window.addEventListener('mousemove', onMouseMove)

    // Resize
    const onResize = () => {
      const nw = mount.clientWidth
      const nh = mount.clientHeight
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
      renderer.setSize(nw, nh)
    }
    window.addEventListener('resize', onResize)

    // Animation loop
    let raf: number
    const half = SPREAD / 2

    const animate = () => {
      raf = requestAnimationFrame(animate)

      // Move particles
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        posArr[i * 3] += velArr[i * 3]
        posArr[i * 3 + 1] += velArr[i * 3 + 1]
        // Wrap
        if (posArr[i * 3] > half) posArr[i * 3] = -half
        else if (posArr[i * 3] < -half) posArr[i * 3] = half
        if (posArr[i * 3 + 1] > half) posArr[i * 3 + 1] = -half
        else if (posArr[i * 3 + 1] < -half) posArr[i * 3 + 1] = half
      }
      pPosAttr.needsUpdate = true

      // Rebuild line segments buffer
      let lineCount = 0
      for (let i = 0; i < PARTICLE_COUNT && lineCount < MAX_LINES; i++) {
        for (let j = i + 1; j < PARTICLE_COUNT && lineCount < MAX_LINES; j++) {
          const dx = posArr[i * 3] - posArr[j * 3]
          const dy = posArr[i * 3 + 1] - posArr[j * 3 + 1]
          const dz = posArr[i * 3 + 2] - posArr[j * 3 + 2]
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
          if (dist < CONNECTION_DISTANCE) {
            const base = lineCount * 6
            linePositions[base] = posArr[i * 3]
            linePositions[base + 1] = posArr[i * 3 + 1]
            linePositions[base + 2] = posArr[i * 3 + 2]
            linePositions[base + 3] = posArr[j * 3]
            linePositions[base + 4] = posArr[j * 3 + 1]
            linePositions[base + 5] = posArr[j * 3 + 2]
            lineCount++
          }
        }
      }
      lPosAttr.needsUpdate = true
      lGeo.setDrawRange(0, lineCount * 2)

      // Smooth camera parallax
      mouse.cx += (mouse.tx - mouse.cx) * 0.04
      mouse.cy += (mouse.ty - mouse.cy) * 0.04
      camera.position.x = mouse.cx
      camera.position.y = mouse.cy
      camera.lookAt(scene.position)

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
      renderer.dispose()
      pGeo.dispose()
      lGeo.dispose()
      pMat.dispose()
      lMat.dispose()
    }
  }, [isDark])

  return <div ref={mountRef} className="absolute inset-0 pointer-events-none" />
}

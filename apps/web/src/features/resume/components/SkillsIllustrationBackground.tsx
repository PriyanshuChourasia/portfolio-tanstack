import { motion, useTransform } from 'framer-motion'

interface SkillsIllustrationBackgroundProps {
  computerSrc: string
  personSrc: string
  progress: any
}

export function SkillsIllustrationBackground({
  computerSrc,
  personSrc,
  progress,
}: SkillsIllustrationBackgroundProps) {
  // Make person and computer images come much closer on scroll
  const personX = useTransform(progress, [0, 1], [-40, -10])
  const personY = useTransform(progress, [0, 1], [80, 20])
  const personRotate = useTransform(progress, [0, 1], [-4, 0])
  const personOpacity = useTransform(progress, [0, 0.3], [0, 0.4])

  const computerX = useTransform(progress, [0, 1], [40, 10])
  const computerY = useTransform(progress, [0, 1], [60, 10])
  const computerRotate = useTransform(progress, [0, 1], [3, 0])
  const computerOpacity = useTransform(progress, [0, 0.25], [0, 0.5])

  if (!computerSrc && !personSrc) return null

  return (
    <>
      {personSrc ? (
        <motion.img
          src={personSrc}
          alt="Person typing"
          className="absolute left-0 bottom-[-15%] w-[50%] max-w-none select-none pointer-events-none"
          style={{
            x: personX,
            y: personY,
            rotate: personRotate,
            opacity: personOpacity,
          }}
        />
      ) : null}

      {computerSrc ? (
        <motion.img
          src={computerSrc}
          alt="Computer"
          className="absolute right-0 bottom-[-10%] w-[50%] max-w-none select-none pointer-events-none"
          style={{
            x: computerX,
            y: computerY,
            rotate: computerRotate,
            opacity: computerOpacity,
          }}
        />
      ) : null}
    </>
  )
}

import type { ReactNode } from 'react'
import {
  Facebook,
  Globe,
  Camera,
  Linkedin,
  Github,
  Twitter,
  Instagram,
  Youtube,
  MessageCircle,
  Figma,
  Palette,
  Code,
  PenTool,
  Award,
  Smartphone,
  Users,
  Lightbulb,
  Shield,
} from 'lucide-react'

export const SOCIAL_ICONS: Record<string, ReactNode> = {
  facebook: <Facebook className="size-4" />,
  twitter: <Twitter className="size-4" />,
  linkedin: <Linkedin className="size-4" />,
  github: <Github className="size-4" />,
  instagram: <Instagram className="size-4" />,
  youtube: <Youtube className="size-4" />,
  dribbble: <Camera className="size-4" />,
  behance: <Globe className="size-4" />,
  figma: <Figma className="size-4" />,
  message: <MessageCircle className="size-4" />,
}

export const SERVICE_ICONS: Record<string, ReactNode> = {
  palette: <Palette className="size-6" />,
  code: <Code className="size-6" />,
  'pen-tool': <PenTool className="size-6" />,
  award: <Award className="size-6" />,
  smartphone: <Smartphone className="size-6" />,
  users: <Users className="size-6" />,
  lightbulb: <Lightbulb className="size-6" />,
  shield: <Shield className="size-6" />,
}

export function getSocialIcon(iconName: string): ReactNode {
  return SOCIAL_ICONS[iconName.toLowerCase()] ?? <Globe className="size-4" />
}

export function getServiceIcon(iconName: string): ReactNode {
  return SERVICE_ICONS[iconName.toLowerCase()] ?? <Lightbulb className="size-6" />
}

export const SERVICE_ICON_OPTIONS = Object.keys(SERVICE_ICONS).map((key) => ({
  value: key,
  label: key.charAt(0).toUpperCase() + key.slice(1).replace(/-/g, ' '),
}))

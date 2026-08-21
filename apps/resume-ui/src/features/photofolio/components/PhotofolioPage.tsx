import { useState } from 'react'
import { DashboardLayout } from './DashboardLayout'

export function PhotofolioPage() {
  const [activeTool, setActiveTool] = useState('photos')

  return <DashboardLayout activeTool={activeTool} onToolChange={setActiveTool} />
}

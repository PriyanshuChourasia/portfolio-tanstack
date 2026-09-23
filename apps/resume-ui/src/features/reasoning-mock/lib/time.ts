/** Clock/duration formatting helpers (no dependencies, safe on the server too). */

/** `95` → `01:35`, `3700` → `1:01:40`. Never returns a negative clock. */
export function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds))
  const hours = Math.floor(safe / 3600)
  const minutes = Math.floor((safe % 3600) / 60)
  const seconds = safe % 60
  const pad = (value: number) => value.toString().padStart(2, '0')
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`
}

/** `1411` → `23 min 31 sec`, `36` → `36 sec`. */
export function formatDurationWords(totalSeconds: number): string {
  const safe = Math.max(0, Math.round(totalSeconds))
  if (safe < 60) return `${safe} sec`
  const minutes = Math.floor(safe / 60)
  const seconds = safe % 60
  if (minutes < 60) return seconds === 0 ? `${minutes} min` : `${minutes} min ${seconds} sec`
  const hours = Math.floor(minutes / 60)
  const restMinutes = minutes % 60
  return restMinutes === 0 ? `${hours} hr` : `${hours} hr ${restMinutes} min`
}

export function formatDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
}

export function formatDateTime(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

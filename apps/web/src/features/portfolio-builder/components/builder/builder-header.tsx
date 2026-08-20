import {
  ArrowLeft,
  Check,
  Eye,
  Loader2,
  MoreHorizontal,
  Share2,
  Trash2,
} from 'lucide-react'
import { useBuilder } from '../../store/portfolio-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function BuilderHeader() {
  const {
    activePortfolio,
    view,
    setView,
    saveStatus,
    updatePortfolioTitle,
    publishPortfolio,
    unpublishPortfolio,
    previewOpen,
    setPreviewOpen,
  } = useBuilder()

  const handleBack = () => {
    setView('dashboard')
  }

  const handleTogglePublish = () => {
    if (!activePortfolio) return
    if (activePortfolio.settings.published) {
      unpublishPortfolio()
    } else {
      publishPortfolio()
    }
  }

  return (
    <header className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-between px-4 gap-4 shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="shrink-0 h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div className="h-5 w-px bg-slate-200 dark:bg-slate-800" />

        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400 hidden sm:inline">
            Portfolio Builder
          </span>
          {activePortfolio && view === 'editor' && (
            <>
              <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">
                /
              </span>
              <Input
                value={activePortfolio.title}
                onChange={(e) => updatePortfolioTitle(e.target.value)}
                className="h-7 w-auto max-w-[200px] sm:max-w-[300px] text-sm font-medium border-transparent bg-transparent focus:bg-slate-100 dark:focus:bg-slate-800 focus:border-slate-300 dark:focus:border-slate-700 px-2"
              />
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {view === 'editor' && (
          <>
            <div className="hidden sm:flex items-center">
              {saveStatus === 'saving' && (
                <Badge
                  variant="outline"
                  className="text-xs gap-1 border-amber-300 text-amber-600 dark:border-amber-700 dark:text-amber-400"
                >
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Saving
                </Badge>
              )}
              {saveStatus === 'saved' && (
                <Badge
                  variant="outline"
                  className="text-xs gap-1 border-emerald-300 text-emerald-600 dark:border-emerald-700 dark:text-emerald-400"
                >
                  <Check className="h-3 w-3" />
                  Saved
                </Badge>
              )}
              {saveStatus === 'unsaved' && (
                <Badge
                  variant="outline"
                  className="text-xs gap-1 border-slate-300 text-slate-500 dark:border-slate-700 dark:text-slate-400"
                >
                  Unsaved
                </Badge>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewOpen(!previewOpen)}
              className="hidden md:flex gap-1.5 h-8"
            >
              <Eye className="h-3.5 w-3.5" />
              Preview
            </Button>

            <Button
              size="sm"
              onClick={handleTogglePublish}
              className="h-8 gap-1.5"
            >
              {activePortfolio?.settings.published ? 'Unpublish' : 'Publish'}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setPreviewOpen(true)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Full Preview
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 dark:text-red-400"
                  onClick={handleBack}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Exit Builder
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
    </header>
  )
}

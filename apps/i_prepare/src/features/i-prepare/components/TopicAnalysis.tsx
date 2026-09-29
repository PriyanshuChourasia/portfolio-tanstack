import type { TopicPerformance } from '@/data/reasoning'
import { formatSeconds } from '../engine/evaluation'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

function accuracyTone(accuracy: number): string {
  if (accuracy >= 80) return 'bg-emerald-500'
  if (accuracy >= 60) return 'bg-sky-500'
  if (accuracy >= 40) return 'bg-amber-500'
  return 'bg-rose-500'
}

export function TopicAnalysis({ topics }: { topics: TopicPerformance[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
          Topic-wise Analysis
        </CardTitle>
        <CardDescription>
          Attempted, correct, wrong and accuracy for every topic that appeared in this paper.
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="py-2.5 pr-3 text-left text-[11px] uppercase tracking-wide">Topic</TableHead>
              <TableHead className="py-2.5 pr-3 text-right text-[11px] uppercase tracking-wide">Attempted</TableHead>
              <TableHead className="py-2.5 pr-3 text-right text-[11px] uppercase tracking-wide">Correct</TableHead>
              <TableHead className="py-2.5 pr-3 text-right text-[11px] uppercase tracking-wide">Wrong</TableHead>
              <TableHead className="py-2.5 pr-3 text-right text-[11px] uppercase tracking-wide">Accuracy</TableHead>
              <TableHead className="py-2.5 pr-3 text-right text-[11px] uppercase tracking-wide">Avg time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topics.map((topic) => (
              <TableRow key={topic.topic} className="border-b border-border/40 last:border-0">
                <TableCell className="py-2.5 pr-3 font-medium">{topic.topic}</TableCell>
                <TableCell className="py-2.5 pr-3 text-right tabular-nums">{topic.attempted}</TableCell>
                <TableCell className="py-2.5 pr-3 text-right tabular-nums text-emerald-600 dark:text-emerald-400">
                  {topic.correct}
                </TableCell>
                <TableCell className="py-2.5 pr-3 text-right tabular-nums text-destructive">{topic.incorrect}</TableCell>
                <TableCell className="py-2.5 pr-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="tabular-nums font-semibold">{topic.accuracy}%</span>
                    <span className="hidden h-1.5 w-20 overflow-hidden rounded-full bg-muted sm:block">
                      <span
                        className={`block h-full rounded-full ${accuracyTone(topic.accuracy)}`}
                        style={{ width: `${Math.min(100, topic.accuracy)}%` }}
                      />
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-2.5 pr-3 text-right tabular-nums text-muted-foreground">
                  {topic.avgTimeSeconds > 0 ? formatSeconds(topic.avgTimeSeconds) : '—'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
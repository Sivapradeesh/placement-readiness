import type { Attendance } from '@/lib/types'

interface HeatmapProps {
  /** Attendance map for one student: { day01: 'present', day02: 'absent', ... } */
  attendance: Attendance[string]
  /** Total days run (determines grid size) */
  daysRun: string[]
  /** Show day labels? */
  showLabels?: boolean
  /** Compact (smaller cells) */
  compact?: boolean
}

export default function Heatmap({
  attendance,
  daysRun,
  showLabels = true,
  compact = false,
}: HeatmapProps) {
  if (daysRun.length === 0) {
    return (
      <span className="text-xs text-gray-600 italic">No sessions yet</span>
    )
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1 flex-wrap">
        {daysRun.map(day => {
          const status = attendance?.[day] ?? 'absent'
          const isPresent = status === 'present' || status === 'manual-present'
          const isManual = status === 'manual-present'

          const cellClass = [
            compact ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5',
            'rounded-sm transition-all duration-150 cursor-default',
            isPresent
              ? isManual
                ? 'bg-yellow-500/70 ring-1 ring-yellow-400/50'
                : 'bg-brand-500'
              : 'bg-gray-800',
          ].join(' ')

          const num = parseInt(day.replace('day', ''), 10)
          const title = `${isPresent ? '✅' : '❌'} Day ${num}${isManual ? ' (manual)' : ''}`

          return (
            <div
              key={day}
              className={cellClass}
              title={title}
              aria-label={title}
            />
          )
        })}
      </div>

      {showLabels && (
        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-brand-500 inline-block" />
            Present
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-yellow-500/70 inline-block" />
            Manual
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-gray-800 inline-block" />
            Absent
          </span>
        </div>
      )}
    </div>
  )
}

// ── Aggregated Heatmap for the dashboard (all students) ─────────────────────

interface AggregatedHeatmapProps {
  attendance: Attendance
  daysRun: string[]
  totalStudents: number
}

export function AggregatedHeatmap({
  attendance,
  daysRun,
  totalStudents,
}: AggregatedHeatmapProps) {
  if (daysRun.length === 0 || totalStudents === 0) return null

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-end gap-1.5 flex-wrap">
        {daysRun.map(day => {
          const presentCount = Object.values(attendance).filter(a => {
            const s = a[day]
            return s === 'present' || s === 'manual-present'
          }).length

          const pct = totalStudents > 0 ? presentCount / totalStudents : 0
          const label = `Day ${parseInt(day.replace('day', ''), 10)}: ${presentCount}/${totalStudents} present`

          // Color intensity based on submission rate
          const colorClass =
            pct >= 0.9
              ? 'bg-brand-500'
              : pct >= 0.7
              ? 'bg-brand-600/80'
              : pct >= 0.5
              ? 'bg-brand-700/70'
              : pct >= 0.2
              ? 'bg-gray-700'
              : 'bg-gray-800'

          return (
            <div
              key={day}
              className="flex flex-col items-center gap-1"
              title={label}
            >
              <span className="text-xs text-gray-600">{presentCount}</span>
              <div className={`w-6 h-6 rounded ${colorClass} transition-all`} />
              <span className="text-xs text-gray-600">
                D{parseInt(day.replace('day', ''), 10)}
              </span>
            </div>
          )
        })}
      </div>

      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-brand-500 inline-block" />
          ≥90%
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-brand-700/70 inline-block" />
          50–89%
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-gray-800 inline-block" />
          &lt;50%
        </span>
      </div>
    </div>
  )
}

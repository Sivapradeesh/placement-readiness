import Link from 'next/link'
import type { Roster, Attendance } from '@/lib/types'

interface MissingSubmissionsAlertProps {
  roster: Roster
  attendance: Attendance
  latestDay: string | null
}

export default function MissingSubmissionsAlert({
  roster,
  attendance,
  latestDay,
}: MissingSubmissionsAlertProps) {
  if (!latestDay) {
    return (
      <div className="card border-blue-500/30 bg-blue-500/5 p-4">
        <p className="text-blue-400 text-sm font-medium">No sessions have started yet.</p>
      </div>
    )
  }

  const dayNum = parseInt(latestDay.replace('day', ''), 10)

  const submitted: string[] = []
  const missing: string[] = []

  for (const roll of Object.keys(roster)) {
    const status = attendance[roll]?.[latestDay]
    if (status === 'present' || status === 'manual-present') {
      submitted.push(roll)
    } else {
      missing.push(roll)
    }
  }

  const total = Object.keys(roster).length
  const submittedPct = total > 0 ? Math.round((submitted.length / total) * 100) : 0

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-white text-sm">
            Day {dayNum} Submissions
          </h3>
          <span className={`badge ${submittedPct >= 80 ? 'badge-green' : submittedPct >= 50 ? 'badge-yellow' : 'badge-red'}`}>
            {submitted.length}/{total} · {submittedPct}%
          </span>
        </div>
        <div className="progress-bar mb-1">
          <div
            className={`progress-fill ${submittedPct >= 80 ? 'bg-brand-500' : submittedPct >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
            style={{ width: `${submittedPct}%` }}
          />
        </div>
        <p className="text-xs text-gray-500">
          {missing.length > 0
            ? `${missing.length} student${missing.length !== 1 ? 's' : ''} have not submitted yet`
            : '🎉 Everyone has submitted!'}
        </p>
      </div>

      {/* Missing students — most visible thing on the page */}
      {missing.length > 0 && (
        <div className="missing-alert">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-red-400 text-lg">⚠️</span>
            <h3 className="font-bold text-red-400 text-sm">
              Not submitted yet — Day {dayNum}
            </h3>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {missing.map(roll => (
              <Link
                key={roll}
                href={`/students/${roll}`}
                className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-500/10 border border-red-500/20
                           text-red-400 text-xs font-mono hover:bg-red-500/20 transition-colors"
                title={roster[roll]?.name}
              >
                {roll}
                <span className="text-red-600 text-xs">{roster[roll]?.name?.split(' ')[0]}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Submitted students */}
      {submitted.length > 0 && (
        <div className="card border-brand-500/20 bg-brand-500/5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-brand-400 text-lg">✅</span>
            <h3 className="font-semibold text-brand-400 text-sm">
              Submitted — Day {dayNum}
            </h3>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {submitted.map(roll => (
              <Link
                key={roll}
                href={`/students/${roll}`}
                className="inline-flex items-center gap-1 px-2 py-1 rounded bg-brand-500/10 border border-brand-500/20
                           text-brand-400 text-xs font-mono hover:bg-brand-500/20 transition-colors"
                title={roster[roll]?.name}
              >
                {roll}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

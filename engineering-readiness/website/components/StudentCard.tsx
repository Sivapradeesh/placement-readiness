import Link from 'next/link'
import type { StudentSummary } from '@/lib/types'
import Heatmap from './Heatmap'
import type { Attendance } from '@/lib/types'

interface StudentCardProps {
  student: StudentSummary
  attendance: Attendance[string]
  daysRun: string[]
  rank?: number
}

export default function StudentCard({ student, attendance, daysRun, rank }: StudentCardProps) {
  return (
    <Link href={`/students/${student.roll}`} className="block">
      <div className="card-hover group animate-fade-in">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            {rank !== undefined && (
              <div className="text-xs text-gray-500 mb-0.5">#{rank + 1}</div>
            )}
            <div className="font-semibold text-white group-hover:text-brand-400 transition-colors">
              {student.name}
            </div>
            <div className="text-xs text-gray-500 font-mono">{student.roll}</div>
            <div className="mt-1">
              <span className="badge-blue capitalize">{student.team}</span>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-3xl font-bold text-white tabular-nums">{student.total}</div>
            <div className="text-xs text-gray-500">pts</div>
            <div className={`text-xs mt-1 tabular-nums ${
              student.attendancePct >= 80 ? 'text-brand-400' : student.attendancePct >= 50 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {student.attendanceCount}/{student.attendanceDays} days
            </div>
          </div>
        </div>

        <Heatmap attendance={attendance} daysRun={daysRun} showLabels={false} compact />

        <div className="mt-2 flex items-center gap-2">
          {student.hasSubmittedToday ? (
            <span className="badge-green">✓ Submitted today</span>
          ) : (
            <span className="badge-red">✗ Not submitted today</span>
          )}
        </div>
      </div>
    </Link>
  )
}

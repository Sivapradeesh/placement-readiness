import Link from 'next/link'
import type { TeamSummary } from '@/lib/types'

interface TeamCardProps {
  team: TeamSummary
  rank?: number
}

export default function TeamCard({ team, rank }: TeamCardProps) {
  const progressColor =
    team.attendanceRate >= 80
      ? 'bg-brand-500'
      : team.attendanceRate >= 50
      ? 'bg-yellow-500'
      : 'bg-red-500'

  return (
    <Link href={`/teams/${team.id}`} className="block">
      <div className="card-hover group animate-slide-up">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {rank !== undefined && (
              <span className="text-lg">
                {rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : ''}
              </span>
            )}
            <div>
              <h3 className="font-bold text-white group-hover:text-brand-400 transition-colors">
                {team.name}
              </h3>
              <p className="text-xs text-gray-500">Lab {team.lab} · {team.memberCount} members</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white tabular-nums">{team.averageScore}</div>
            <div className="text-xs text-gray-500">avg score</div>
          </div>
        </div>

        {/* Attendance bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Attendance</span>
            <span className={team.attendanceRate >= 80 ? 'text-brand-400' : team.attendanceRate >= 50 ? 'text-yellow-400' : 'text-red-400'}>
              {team.attendanceRate}%
            </span>
          </div>
          <div className="progress-bar">
            <div
              className={`progress-fill ${progressColor}`}
              style={{ width: `${team.attendanceRate}%` }}
            />
          </div>
        </div>

        {/* Member avatars (roll number badges) */}
        <div className="flex flex-wrap gap-1 mt-3">
          {team.members.slice(0, 6).map(m => (
            <span
              key={m.roll}
              title={m.name}
              className="text-xs font-mono bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded border border-gray-700"
            >
              {m.roll}
            </span>
          ))}
          {team.members.length > 6 && (
            <span className="text-xs text-gray-600">+{team.members.length - 6} more</span>
          )}
        </div>

        {team.helpingBonus > 0 && (
          <div className="mt-2">
            <span className="badge-yellow">+{team.helpingBonus} helping bonus</span>
          </div>
        )}
      </div>
    </Link>
  )
}

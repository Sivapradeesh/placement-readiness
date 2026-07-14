import type { Metadata } from 'next'
import {
  getAllData,
  buildTeamSummaries,
} from '@/lib/data'
import TeamCard from '@/components/TeamCard'

export const metadata: Metadata = {
  title: 'Teams',
  description: 'All 7 team standings, attendance rates, and member counts for the Engineering Readiness cohort.',
}

export const revalidate = 60

export default async function TeamsPage() {
  const { roster, scoreboard, attendance, teams } = await getAllData()
  const teamSummaries = buildTeamSummaries(teams, roster, scoreboard, attendance)

  const labA = teamSummaries.filter(t => t.lab === 'A')
  const labB = teamSummaries.filter(t => t.lab === 'B')

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Team <span className="text-gradient">Standings</span>
        </h1>
        <p className="text-gray-400 mt-1">
          {teamSummaries.length} teams · {Object.keys(roster).length} students total
        </p>
      </div>

      {/* Overall team stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="stat-card lg:col-span-1">
          <div className="stat-label">Top Team</div>
          <div className="stat-value text-base">{teamSummaries[0]?.name ?? '—'}</div>
          <div className="stat-sub">{teamSummaries[0]?.averageScore ?? 0} avg pts</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Best Attendance</div>
          <div className="stat-value text-base">
            {[...teamSummaries].sort((a, b) => b.attendanceRate - a.attendanceRate)[0]?.name ?? '—'}
          </div>
          <div className="stat-sub">
            {[...teamSummaries].sort((a, b) => b.attendanceRate - a.attendanceRate)[0]?.attendanceRate ?? 0}%
          </div>
        </div>
        <div className="stat-card col-span-2 lg:col-span-1">
          <div className="stat-label">Average Team Score</div>
          <div className="stat-value">
            {teamSummaries.length > 0
              ? Math.round(teamSummaries.reduce((s, t) => s + t.averageScore, 0) / teamSummaries.length)
              : 0}
          </div>
          <div className="stat-sub">across all teams</div>
        </div>
      </div>

      {/* Lab A */}
      {labA.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span className="px-2 py-0.5 bg-blue-500/15 text-blue-400 rounded text-sm font-bold border border-blue-500/25">
              Lab A
            </span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {labA.map((team, i) => (
              <TeamCard key={team.id} team={team} rank={teamSummaries.indexOf(team)} />
            ))}
          </div>
        </div>
      )}

      {/* Lab B */}
      {labB.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span className="px-2 py-0.5 bg-purple-500/15 text-purple-400 rounded text-sm font-bold border border-purple-500/25">
              Lab B
            </span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {labB.map((team) => (
              <TeamCard key={team.id} team={team} rank={teamSummaries.indexOf(team)} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

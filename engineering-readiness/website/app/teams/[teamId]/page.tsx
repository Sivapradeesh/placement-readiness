import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  getAllData,
  buildTeamSummaries,
  buildStudentSummaries,
  getDaysRun,
} from '@/lib/data'
import LeaderboardTable from '@/components/LeaderboardTable'
import Heatmap from '@/components/Heatmap'

interface Props {
  params: Promise<{ teamId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { teamId } = await params
  return {
    title: `Team ${teamId.replace('team', '')} Detail`,
    description: `Team ${teamId} scores, members, and attendance for the Engineering Readiness cohort.`,
  }
}

export const revalidate = 60

export default async function TeamDetailPage({ params }: Props) {
  const { teamId } = await params
  const { roster, scoreboard, attendance, teams } = await getAllData()

  if (!teams[teamId]) notFound()

  const daysRun = getDaysRun(attendance)
  const teamSummaries = buildTeamSummaries(teams, roster, scoreboard, attendance)
  const team = teamSummaries.find(t => t.id === teamId)

  if (!team) notFound()

  // Build student summaries for just this team
  const allStudents = buildStudentSummaries(roster, scoreboard, attendance)
  const teamStudents = allStudents.filter(s => s.team === teamId)

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500">
        <Link href="/teams" className="hover:text-gray-300 transition-colors">Teams</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-300">{team.name}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">
            {team.name}
          </h1>
          <p className="text-gray-400 mt-1">
            Lab {team.lab} · {team.memberCount} members · {daysRun.length} sessions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="stat-card min-w-24 text-center">
            <div className="stat-label">Avg Score</div>
            <div className="stat-value">{team.averageScore}</div>
          </div>
          <div className="stat-card min-w-24 text-center">
            <div className="stat-label">Attendance</div>
            <div className={`stat-value ${team.attendanceRate >= 80 ? 'text-brand-400' : team.attendanceRate >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
              {team.attendanceRate}%
            </div>
          </div>
        </div>
      </div>

      {/* Member leaderboard */}
      <div className="space-y-3">
        <h2 className="font-bold text-white text-lg">Member Scores</h2>
        <LeaderboardTable students={teamStudents} showAttendance />
      </div>

      {/* Per-member heatmaps */}
      <div className="space-y-3">
        <h2 className="font-bold text-white text-lg">Attendance Heatmap</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {team.members.map(m => (
            <Link key={m.roll} href={`/students/${m.roll}`}>
              <div className="card-hover">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-medium text-white text-sm">{m.name}</div>
                    <div className="text-xs font-mono text-gray-500">{m.roll}</div>
                  </div>
                  <span className="text-lg font-bold text-white">{m.total}</span>
                </div>
                <Heatmap
                  attendance={attendance[m.roll] ?? {}}
                  daysRun={daysRun}
                  showLabels={false}
                  compact
                />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {team.helpingBonus > 0 && (
        <div className="card border-yellow-500/20 bg-yellow-500/5">
          <p className="text-yellow-400 text-sm font-medium">
            🌟 This team earned <strong>{team.helpingBonus}</strong> Helping Others bonus points
          </p>
        </div>
      )}
    </div>
  )
}

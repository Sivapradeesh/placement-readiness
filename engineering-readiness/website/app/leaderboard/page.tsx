import type { Metadata } from 'next'
import {
  getAllData,
  buildStudentSummaries,
  getDaysRun,
} from '@/lib/data'
import LeaderboardTable from '@/components/LeaderboardTable'

export const metadata: Metadata = {
  title: 'Leaderboard',
  description: 'Full individual leaderboard for the 25MX Engineering Readiness cohort, sorted by total score with attendance.',
}

export const revalidate = 60

export default async function LeaderboardPage() {
  const { roster, scoreboard, attendance } = await getAllData()
  const daysRun = getDaysRun(attendance)
  const students = buildStudentSummaries(roster, scoreboard, attendance)

  const maxScore = students[0]?.total ?? 1

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Individual <span className="text-gradient">Leaderboard</span>
        </h1>
        <p className="text-gray-400 mt-1">
          {students.length} students · {daysRun.length} days · Max possible: {daysRun.length * 45} pts
        </p>
      </div>

      {/* Quick distribution */}
      <div className="grid grid-cols-3 gap-3">
        <div className="stat-card">
          <div className="stat-label">Highest Score</div>
          <div className="stat-value">{maxScore}</div>
          <div className="stat-sub">{students[0]?.name ?? '—'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Average Score</div>
          <div className="stat-value">
            {students.length > 0
              ? Math.round(students.reduce((s, st) => s + st.total, 0) / students.length)
              : 0}
          </div>
          <div className="stat-sub">across {students.length} students</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Lowest Score</div>
          <div className="stat-value text-red-400">{students[students.length - 1]?.total ?? 0}</div>
          <div className="stat-sub">{students[students.length - 1]?.name ?? '—'}</div>
        </div>
      </div>

      {/* Full sortable table */}
      <LeaderboardTable students={students} showAttendance />
    </div>
  )
}

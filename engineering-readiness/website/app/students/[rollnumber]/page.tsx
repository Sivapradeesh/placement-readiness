import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  getAllData,
  getDaysRun,
  fetchMarkdownFile,
} from '@/lib/data'
import Heatmap from '@/components/Heatmap'
import MarkdownRenderer from '@/components/MarkdownRenderer'

interface Props {
  params: Promise<{ rollnumber: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { rollnumber } = await params
  return {
    title: `Student ${rollnumber}`,
    description: `Score breakdown, attendance, and submissions for ${rollnumber}.`,
  }
}

export const revalidate = 60

export default async function StudentProfilePage({ params }: Props) {
  const { rollnumber } = await params
  const { roster, scoreboard, attendance, teams } = await getAllData()

  const student = roster[rollnumber]
  if (!student) notFound()

  const daysRun = getDaysRun(attendance)
  const score = scoreboard[rollnumber]
  const studentAtt = attendance[rollnumber] ?? {}
  const team = teams[student.team]

  const presentCount = Object.values(studentAtt).filter(
    s => s === 'present' || s === 'manual-present'
  ).length

  // Fetch markdown files on-demand (only when this page is opened)
  // We show latest day's reflection and prompts as a preview
  const latestDay = daysRun[daysRun.length - 1]
  let reflectionContent: string | null = null
  let promptsContent: string | null = null

  if (latestDay) {
    ;[reflectionContent, promptsContent] = await Promise.all([
      fetchMarkdownFile(`activities/${latestDay}/${rollnumber}/reflection.md`),
      fetchMarkdownFile(`activities/${latestDay}/${rollnumber}/prompts.md`),
    ])
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500">
        <Link href="/leaderboard" className="hover:text-gray-300 transition-colors">Leaderboard</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-300">{student.name}</span>
      </div>

      {/* Header card */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Avatar placeholder */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-600 to-emerald-700 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
            {student.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">{student.name}</h1>
            <div className="flex flex-wrap gap-2 mt-1">
              <span className="font-mono text-sm text-gray-400">{rollnumber}</span>
              <span className="text-gray-600">·</span>
              <Link href={`/teams/${student.team}`} className="text-sm text-brand-400 hover:text-brand-300 transition-colors capitalize">
                {student.team}
              </Link>
              {team && (
                <>
                  <span className="text-gray-600">·</span>
                  <span className="text-sm text-gray-400">Lab {team.lab}</span>
                </>
              )}
              <span className="text-gray-600">·</span>
              <a
                href={`https://github.com/${student.github}`}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                @{student.github}
              </a>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-4xl font-bold text-white tabular-nums">{score?.total ?? 0}</div>
            <div className="text-xs text-gray-500">total points</div>
            <div className={`text-sm mt-1 ${presentCount / Math.max(daysRun.length, 1) >= 0.8 ? 'text-brand-400' : 'text-yellow-400'}`}>
              {presentCount}/{daysRun.length} days present
            </div>
          </div>
        </div>
      </div>

      {/* Attendance heatmap */}
      <div className="card">
        <h2 className="font-bold text-white mb-3">Attendance</h2>
        <Heatmap attendance={studentAtt} daysRun={daysRun} showLabels />
      </div>

      {/* Score breakdown by day */}
      {score && Object.keys(score.byDay).length > 0 && (
        <div className="card">
          <h2 className="font-bold text-white mb-4">Score Breakdown</h2>
          <div className="space-y-4">
            {Object.entries(score.byDay)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([day, dayScore]) => {
                const num = parseInt(day.replace('day', ''), 10)
                const dayTotal = dayScore.submitted + dayScore.quality + dayScore.reflection + dayScore.prompting + dayScore.documentation
                const isPresent = studentAtt[day] === 'present' || studentAtt[day] === 'manual-present'

                return (
                  <div key={day}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/activities/${day}`}
                          className="font-semibold text-white hover:text-brand-400 transition-colors text-sm"
                        >
                          Day {num}
                        </Link>
                        {isPresent ? (
                          <span className="badge-green text-xs">present</span>
                        ) : (
                          <span className="badge-red text-xs">absent</span>
                        )}
                        {studentAtt[day] === 'manual-present' && (
                          <span className="badge-yellow text-xs">manual</span>
                        )}
                      </div>
                      <span className="font-bold text-white tabular-nums">{dayTotal}/45</span>
                    </div>

                    {isPresent && (
                      <div className="grid grid-cols-5 gap-1.5 text-xs">
                        {[
                          { label: 'Submit', value: dayScore.submitted, max: 10 },
                          { label: 'Quality', value: dayScore.quality, max: 10 },
                          { label: 'Reflection', value: dayScore.reflection, max: 10 },
                          { label: 'Prompting', value: dayScore.prompting, max: 10 },
                          { label: 'Docs', value: dayScore.documentation, max: 5 },
                        ].map(({ label, value, max }) => (
                          <div key={label} className="flex flex-col items-center gap-1">
                            <span className="text-gray-500">{label}</span>
                            <div className="font-bold text-white tabular-nums">
                              {value}
                              <span className="text-gray-600 font-normal">/{max}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Day link */}
                    {isPresent && (
                      <div className="mt-2">
                        <Link
                          href={`/activities/${day}`}
                          className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
                        >
                          View day {num} submissions →
                        </Link>
                      </div>
                    )}
                  </div>
                )
              })}
          </div>

          {/* Manual adjustments */}
          {score.manualAdjustments && (
            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/25 rounded-lg">
              <div className="text-xs text-yellow-400 font-medium mb-1">Manual Adjustment</div>
              <div className="text-sm text-yellow-300">+{score.manualAdjustments.points} pts</div>
              <div className="text-xs text-yellow-500 mt-0.5">{score.manualAdjustments.reason}</div>
            </div>
          )}
        </div>
      )}

      {/* Latest day markdown preview */}
      {latestDay && (reflectionContent || promptsContent) && (
        <div className="space-y-4">
          <h2 className="font-bold text-white text-lg">
            Latest Submission — Day {parseInt(latestDay.replace('day', ''), 10)}
          </h2>

          {reflectionContent && (
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-brand-600/20 flex items-center justify-center text-brand-400 text-xs">R</span>
                  Reflection
                </h3>
              </div>
              <MarkdownRenderer content={reflectionContent} />
            </div>
          )}

          {promptsContent && (
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-purple-600/20 flex items-center justify-center text-purple-400 text-xs">P</span>
                  Prompts Log
                </h3>
              </div>
              <MarkdownRenderer content={promptsContent} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

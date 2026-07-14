/**
 * data.ts — Data fetching helpers for the Next.js app.
 *
 * All data comes from the flat JSON files in the GitHub repo, fetched via:
 *   - raw.githubusercontent.com  → JSON files (with 60-second ISR cache)
 *   - api.github.com/contents/   → Individual markdown files (on-demand only)
 *
 * This module is server-only (no 'use client').
 */

import type {
  Roster,
  Scoreboard,
  Attendance,
  Teams,
  StudentSummary,
  TeamSummary,
  ActivityDay,
} from './types'

const OWNER = process.env.NEXT_PUBLIC_GITHUB_OWNER ?? 'psgmx'
const REPO  = process.env.NEXT_PUBLIC_GITHUB_REPO  ?? 'engineering-readiness'
const BRANCH = 'main'

// ── Raw fetch helpers ─────────────────────────────────────────────────────────

function rawUrl(path: string): string {
  return `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${path}`
}

async function fetchJSON<T>(path: string): Promise<T> {
  const res = await fetch(rawUrl(path), {
    next: { revalidate: 60 },
  })
  if (!res.ok) {
    throw new Error(`Failed to fetch ${path}: ${res.status} ${res.statusText}`)
  }
  return res.json() as Promise<T>
}

// ── Base data loaders ─────────────────────────────────────────────────────────

export async function getRoster(): Promise<Roster> {
  return fetchJSON<Roster>('students/roster.json')
}

export async function getScoreboard(): Promise<Scoreboard> {
  return fetchJSON<Scoreboard>('scoreboard.json')
}

export async function getAttendance(): Promise<Attendance> {
  return fetchJSON<Attendance>('attendance.json')
}

export async function getTeams(): Promise<Teams> {
  return fetchJSON<Teams>('teams.json')
}

// ── Derived helpers ───────────────────────────────────────────────────────────

/** Load all four JSON files in parallel */
export async function getAllData() {
  const [roster, scoreboard, attendance, teams] = await Promise.all([
    getRoster(),
    getScoreboard(),
    getAttendance(),
    getTeams(),
  ])
  return { roster, scoreboard, attendance, teams }
}

/** Compute how many days have been run (days that appear in attendance) */
export function getDaysRun(attendance: Attendance): string[] {
  const allDays = new Set<string>()
  for (const studentAtt of Object.values(attendance)) {
    for (const [day, status] of Object.entries(studentAtt)) {
      if (status === 'present' || status === 'manual-present') {
        allDays.add(day)
      }
    }
  }
  return [...allDays].sort()
}

/** The most recent day that had submissions */
export function getLatestDay(attendance: Attendance): string | null {
  const days = getDaysRun(attendance)
  return days.length > 0 ? days[days.length - 1] : null
}

/** Build a sorted array of StudentSummary for leaderboard use */
export function buildStudentSummaries(
  roster: Roster,
  scoreboard: Scoreboard,
  attendance: Attendance,
): StudentSummary[] {
  const daysRun = getDaysRun(attendance)
  const latestDay = daysRun[daysRun.length - 1] ?? null

  return Object.entries(roster)
    .map(([roll, info]) => {
      const score = scoreboard[roll]
      const studentAtt = attendance[roll] ?? {}

      const attendanceCount = Object.values(studentAtt).filter(
        s => s === 'present' || s === 'manual-present'
      ).length

      const attendanceDays = daysRun.length
      const attendancePct = attendanceDays > 0
        ? Math.round((attendanceCount / attendanceDays) * 100)
        : 0

      const hasSubmittedToday = latestDay
        ? (studentAtt[latestDay] === 'present' || studentAtt[latestDay] === 'manual-present')
        : false

      return {
        roll,
        name: info.name,
        github: info.github,
        team: info.team,
        total: score?.total ?? 0,
        attendanceCount,
        attendanceDays,
        attendancePct,
        hasSubmittedToday,
      } satisfies StudentSummary
    })
    .sort((a, b) => b.total - a.total)
}

/** Build TeamSummary array sorted by averageScore */
export function buildTeamSummaries(
  teams: Teams,
  roster: Roster,
  scoreboard: Scoreboard,
  attendance: Attendance,
): TeamSummary[] {
  const studentSummaries = buildStudentSummaries(roster, scoreboard, attendance)
  const summaryByRoll = Object.fromEntries(studentSummaries.map(s => [s.roll, s]))

  return Object.entries(teams)
    .map(([id, team]) => ({
      id,
      name: team.name,
      lab: team.lab,
      memberCount: team.members.length,
      averageScore: team.averageScore,
      attendanceRate: team.attendanceRate,
      helpingBonus: team.helpingBonus,
      members: team.members.map(roll => summaryByRoll[roll]).filter(Boolean),
    } satisfies TeamSummary))
    .sort((a, b) => b.averageScore - a.averageScore)
}

/** Build per-day activity data */
export function buildActivityDays(
  roster: Roster,
  attendance: Attendance,
): ActivityDay[] {
  const allDays = new Set<string>()
  for (const studentAtt of Object.values(attendance)) {
    for (const day of Object.keys(studentAtt)) allDays.add(day)
  }

  const days = [...allDays].sort()
  const totalStudents = Object.keys(roster).length

  return days.map(id => {
    const submitters: string[] = []
    const nonSubmitters: string[] = []

    for (const roll of Object.keys(roster)) {
      const status = attendance[roll]?.[id]
      if (status === 'present' || status === 'manual-present') {
        submitters.push(roll)
      } else {
        nonSubmitters.push(roll)
      }
    }

    const num = parseInt(id.replace('day', ''), 10)
    const label = `Day ${num}`

    return {
      id,
      label,
      submissionCount: submitters.length,
      totalStudents,
      submissionRate: totalStudents > 0 ? Math.round((submitters.length / totalStudents) * 100) : 0,
      submitters,
      nonSubmitters,
    } satisfies ActivityDay
  })
}

// ── On-demand: fetch individual markdown files ─────────────────────────────────

interface GitHubContentsResponse {
  content: string
  encoding: string
  name: string
}

/**
 * Fetch a single file's content via the GitHub Contents API.
 * Used for student profile pages — never bulk-called.
 */
export async function fetchMarkdownFile(path: string): Promise<string | null> {
  const apiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`

  const res = await fetch(apiUrl, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
      ...(process.env.GITHUB_TOKEN
        ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
        : {}),
    },
    next: { revalidate: 300 }, // 5-minute cache for individual files
  })

  if (res.status === 404) return null
  if (!res.ok) return null

  const data: GitHubContentsResponse = await res.json()
  if (data.encoding !== 'base64') return null

  // Decode base64 content (GitHub API always returns base64)
  const decoded = Buffer.from(data.content.replace(/\n/g, ''), 'base64').toString('utf8')
  return decoded
}

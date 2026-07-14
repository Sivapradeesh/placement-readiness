'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { StudentSummary } from '@/lib/types'

interface LeaderboardTableProps {
  students: StudentSummary[]
  /** Show only top N rows (0 = show all) */
  limit?: number
  showAttendance?: boolean
}

type SortKey = 'rank' | 'total' | 'attendancePct' | 'name'
type SortDir = 'asc' | 'desc'

export default function LeaderboardTable({
  students,
  limit = 0,
  showAttendance = true,
}: LeaderboardTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('total')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const sorted = useMemo(() => {
    const copy = [...students]
    copy.sort((a, b) => {
      let cmp = 0
      if (sortKey === 'rank' || sortKey === 'total') cmp = b.total - a.total
      else if (sortKey === 'attendancePct') cmp = b.attendancePct - a.attendancePct
      else if (sortKey === 'name') cmp = a.name.localeCompare(b.name)
      return sortDir === 'asc' ? -cmp : cmp
    })
    return limit > 0 ? copy.slice(0, limit) : copy
  }, [students, sortKey, sortDir, limit])

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <span className="text-gray-700 ml-1">↕</span>
    return <span className="text-brand-400 ml-1">{sortDir === 'desc' ? '↓' : '↑'}</span>
  }

  const medal = (i: number) => {
    if (i === 0) return '🥇'
    if (i === 1) return '🥈'
    if (i === 2) return '🥉'
    return null
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th
                className="cursor-pointer hover:text-white select-none w-16"
                onClick={() => handleSort('rank')}
              >
                Rank <SortIcon col="rank" />
              </th>
              <th
                className="cursor-pointer hover:text-white select-none"
                onClick={() => handleSort('name')}
              >
                Student <SortIcon col="name" />
              </th>
              <th className="text-gray-500 w-24">Roll No</th>
              <th className="text-gray-500 w-20">Team</th>
              <th
                className="cursor-pointer hover:text-white select-none w-24 text-right"
                onClick={() => handleSort('total')}
              >
                Score <SortIcon col="total" />
              </th>
              {showAttendance && (
                <th
                  className="cursor-pointer hover:text-white select-none w-28 text-right"
                  onClick={() => handleSort('attendancePct')}
                >
                  Attendance <SortIcon col="attendancePct" />
                </th>
              )}
              <th className="text-gray-500 w-20 text-center">Today</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((s, i) => (
              <tr key={s.roll}>
                <td className="font-mono text-gray-400 w-16">
                  <span className="mr-1">{medal(i) ?? ''}</span>
                  {i + 1}
                </td>
                <td>
                  <Link
                    href={`/students/${s.roll}`}
                    className="font-medium text-white hover:text-brand-400 transition-colors"
                  >
                    {s.name}
                  </Link>
                </td>
                <td>
                  <span className="font-mono text-xs text-gray-500">{s.roll}</span>
                </td>
                <td>
                  <Link
                    href={`/teams/${s.team}`}
                    className="text-xs text-gray-400 hover:text-brand-400 transition-colors capitalize"
                  >
                    {s.team}
                  </Link>
                </td>
                <td className="text-right">
                  <span className="font-bold text-white tabular-nums">{s.total}</span>
                </td>
                {showAttendance && (
                  <td className="text-right">
                    <span className={`text-sm tabular-nums ${
                      s.attendancePct >= 80
                        ? 'text-brand-400'
                        : s.attendancePct >= 50
                        ? 'text-yellow-400'
                        : 'text-red-400'
                    }`}>
                      {s.attendanceCount}/{s.attendanceDays} ({s.attendancePct}%)
                    </span>
                  </td>
                )}
                <td className="text-center">
                  {s.hasSubmittedToday ? (
                    <span className="text-brand-400 text-base" title="Submitted today">✓</span>
                  ) : (
                    <span className="text-red-500 text-base" title="Not submitted yet">✗</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-2">
        {sorted.map((s, i) => (
          <Link key={s.roll} href={`/students/${s.roll}`}>
            <div className="card-hover flex items-center gap-3 animate-fade-in">
              <div className="flex-shrink-0 text-center w-10">
                <div className="text-lg">{medal(i) ?? ''}</div>
                <div className="text-xs text-gray-500 font-mono">{i + 1}</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white truncate">{s.name}</div>
                <div className="text-xs text-gray-500 font-mono">{s.roll} · {s.team}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-bold text-white text-lg tabular-nums">{s.total}</div>
                {showAttendance && (
                  <div className={`text-xs tabular-nums ${
                    s.attendancePct >= 80 ? 'text-brand-400' : s.attendancePct >= 50 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {s.attendancePct}%
                  </div>
                )}
              </div>
              <div>
                {s.hasSubmittedToday
                  ? <span className="text-brand-400" title="Submitted today">✓</span>
                  : <span className="text-red-500" title="Not submitted yet">✗</span>
                }
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}

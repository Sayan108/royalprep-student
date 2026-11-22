import { LoadingState } from '../../shared/ui/loading-state'
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ErrorMessage } from '../../shared/ui/error-message/index'
import { ScreenLayout } from '../../widgets/screen-layout/index'
import type { AttemptSummary } from '../../entities/attempt'
import { api } from '../../shared/api/index'
import '../../shared/styles/mocks.css'

type ChapterAnalytics = { chapter: string; questions: number; correct: number; percentage: number }
export function Mocks({ results = false }: { results?: boolean }) {
  const [attempts, setAttempts] = useState<AttemptSummary[]>()
  const [analytics, setAnalytics] = useState<ChapterAnalytics[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const load = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const [mockAttempts, chapterAnalytics] = await Promise.all([
        api<AttemptSummary[]>('/student/attempts', {}, false, true),
        api<ChapterAnalytics[]>('/student/attempt-analytics', {}, false, true),
      ])
      setAttempts(mockAttempts); setAnalytics(chapterAnalytics)
    }
    catch (e) { setError((e as Error).message) }
    finally { setLoading(false) }
  }, [])
  useEffect(() => { void load() }, [load])
  const shown = attempts?.filter(item => !results || item.status === 'submitted') ?? []
  const submitted = shown.filter(item => item.status === 'submitted' && item.score !== null)
  const totalQuestions = submitted.reduce((sum, item) => sum + item.count, 0)
  const totalCorrect = submitted.reduce((sum, item) => sum + (item.score ?? 0), 0)
  const averagePercentage = totalQuestions ? Math.round(totalCorrect / totalQuestions * 100) : 0
  const bestPercentage = submitted.length ? Math.max(...submitted.map(item => Math.round((item.score ?? 0) / item.count * 100))) : 0
  return <ScreenLayout>
    <div className="mocks-heading"><div><p className="screen-kicker">{results ? 'YOUR PERFORMANCE' : 'ASSESSMENTS'}</p><h1>{results ? 'Results' : 'Mock exams'}</h1><p>{results ? 'Review submitted custom mocks.' : 'Build a timed mock or resume an existing attempt.'}</p></div><Link className="screen-button" to="/app/mocks/new">Create custom mock</Link></div>
    {!results && <p>Daily and Grand Mocks are not available yet. Custom mocks use published questions.</p>}
    <ErrorMessage text={error}/>{error && <button className="outline-button" type="button" onClick={load}>Try again</button>}
    {results && submitted.length > 0 && <section className="dashboard-grid" aria-label="Mock performance summary">
      <div className="screen-card"><h2>Mocks completed</h2><p>{submitted.length}</p></div>
      <div className="screen-card"><h2>Average score</h2><p>{averagePercentage}%</p><small>{totalCorrect} of {totalQuestions} questions correct</small></div>
      <div className="screen-card"><h2>Best score</h2><p>{bestPercentage}%</p></div>
    </section>}
    {results && analytics.length > 0 && <section className="screen-card"><h2>Chapter analytics</h2><ul>{analytics.map(item => <li key={item.chapter}>{item.chapter}: {item.correct}/{item.questions} correct ({item.percentage}%)</li>)}</ul></section>}
    {loading ? <LoadingState label="Loading attempts..."/> : !error && (shown.length ? <ul className="attempt-list">{shown.map(attempt => <li className="screen-card" key={attempt.id}>
      <div><strong>{attempt.status === 'active' ? 'In progress' : 'Submitted'}</strong><p>{new Date(attempt.createdAt).toLocaleString()} · {attempt.count} questions{attempt.score !== null && ` · ${attempt.score}/${attempt.count} correct`}</p></div>
      <Link className="outline-button" to={'/app/attempts/' + attempt.id}>{attempt.status === 'active' ? 'Resume' : 'Review result'}</Link>
    </li>)}</ul> : <section className="screen-card"><p>{results ? 'No submitted mocks yet.' : 'No custom mocks yet.'}</p></section>)}
  </ScreenLayout>
}

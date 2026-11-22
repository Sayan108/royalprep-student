import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../shared/api/index'
import { ErrorMessage } from '../../shared/ui/error-message/index'
import { LoadingState } from '../../shared/ui/loading-state'
import { ScreenLayout } from '../../widgets/screen-layout/index'

type Challenge = { date: string; kind: string; durationMinutes: number; questions: { id: string; stem: string; options: string[] }[]; attempt: { answers: Record<string, number>; submittedAt?: string | null } }
type Leaderboard = { rank: number; score: number; student: string }[]
export function DailyChallenge({ mock = false }: { mock?: boolean }) {
  const [challenge, setChallenge] = useState<Challenge>()
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [result, setResult] = useState<{ score: number; total: number }>()
  const [leaderboard, setLeaderboard] = useState<Leaderboard>([])
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [error, setError] = useState('')
  useEffect(() => { void Promise.all([api<Challenge>(mock ? '/student/daily-mock' : '/student/daily-quiz', {}, false, true), ...(mock ? [api<Leaderboard>('/public/daily-mock/leaderboard')] : [])]).then(values => { const value = values[0] as Challenge; setChallenge(value); setAnswers(value.attempt.answers); setSecondsLeft(value.durationMinutes * 60); if (mock && values[1]) setLeaderboard(values[1] as Leaderboard) }).catch(e => setError((e as Error).message)) }, [mock])
  useEffect(() => { if (!challenge || result || secondsLeft <= 0) return; const timer = window.setInterval(() => setSecondsLeft(value => Math.max(0, value - 1)), 1000); return () => window.clearInterval(timer) }, [challenge, result, secondsLeft])
  async function submit() { const value = await api<{ score: number; total: number }>(mock ? '/student/daily-mock/submit' : '/student/daily-quiz/submit', { method: 'POST', body: JSON.stringify({ answers }) }, false, true); setResult(value) }
  return <ScreenLayout><p className="screen-kicker">{mock ? 'DAILY MOCK' : 'DAILY QUIZ'}</p><h1>{mock ? 'Today’s Daily Mock' : 'Today’s 5-question quiz'}</h1><p>{mock ? 'Complete the daily timed challenge and compare your score.' : 'Build a daily habit with five focused questions.'}</p><ErrorMessage text={error}/>{!challenge && !error ? <LoadingState label="Loading challenge..."/> : challenge && <><form className="screen-card" onSubmit={event => { event.preventDefault(); void submit() }}><p role="timer">Time remaining: {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, '0')}</p>{challenge.questions.map((question, index) => <fieldset disabled={secondsLeft === 0 || Boolean(result)} key={question.id}><legend>{index + 1}. {question.stem}</legend>{question.options.map((option, optionIndex) => <label key={option}><input type="radio" name={question.id} checked={answers[question.id] === optionIndex} onChange={() => setAnswers({ ...answers, [question.id]: optionIndex })}/>{option}</label>)}</fieldset>)}{result ? <p role="status">Score: {result.score}/{result.total}</p> : <button className="screen-button" disabled={secondsLeft === 0 || Object.keys(answers).length !== challenge.questions.length}>Submit challenge</button>}</form>{mock && <section className="screen-card"><h2>Daily Mock leaderboard</h2>{leaderboard.length ? <ol>{leaderboard.map(item => <li key={item.rank}>{item.student} — {item.score}/{challenge.questions.length}</li>)}</ol> : <p>No submissions yet.</p>}</section>}</>}<Link className="outline-button" to="/app/mocks">Back to mocks</Link></ScreenLayout>
}

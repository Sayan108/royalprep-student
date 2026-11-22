import { LoadingState } from '../../shared/ui/loading-state'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ErrorMessage } from '../../shared/ui/error-message/index'
import { ScreenLayout } from '../../widgets/screen-layout/index'
import { chapterNotesEnabled } from '../../shared/config/index'
import type { ChapterSummary } from '../../entities/chapter'
import { api } from '../../shared/api/index'

type Chapter = { name: string; questionCount: number }

export function ChapterPreview() {
  const { chapter } = useParams()
  const [chapters, setChapters] = useState<Chapter[]>()
  const [notes, setNotes] = useState<ChapterSummary[]>()
  const [notesError, setNotesError] = useState('')
  const [error, setError] = useState('')
  useEffect(() => {
    const controller = new AbortController()
    api<Chapter[]>('/public/chapters', { signal: controller.signal }).then(setChapters)
      .catch(e => { if (!controller.signal.aborted) setError((e as Error).message) })
    if (chapterNotesEnabled) {
      api<ChapterSummary[]>('/student/chapters', { signal: controller.signal }, false, true).then(setNotes)
        .catch(e => { if (!controller.signal.aborted) setNotesError((e as Error).message) })
    }
    return () => controller.abort()
  }, [])
  const item = chapters?.find(value => value.name === chapter)
  const publishedNotes = notes?.find(value => value.title === chapter)
  return <ScreenLayout><p className="screen-kicker">COURSE CATALOG</p>
    <Link to="/course">← All chapters</Link>
    <ErrorMessage text={error}/>
    {!chapters && !error ? <LoadingState label="Loading chapter..."/> : item ? <section className="screen-card">
      <h1>{item.name}</h1>
      <p>{item.questionCount} published practice {item.questionCount === 1 ? 'question' : 'questions'} available.</p>
      {chapterNotesEnabled && publishedNotes ? <p><Link className="outline-button" to={'/app/chapters/' + publishedNotes.id}>Read published chapter notes</Link></p> : chapterNotesEnabled && notesError ? <p>Chapter notes are currently unavailable.</p> : <p>Chapter notes and approved samples are not available yet.</p>}
      <Link className="screen-button" to={'/practice?chapter=' + encodeURIComponent(item.name)}>Practice this chapter</Link>
    </section> : !error && <section className="screen-card"><h1>Chapter not found</h1><p>This chapter is not currently published.</p></section>}
  </ScreenLayout>
}

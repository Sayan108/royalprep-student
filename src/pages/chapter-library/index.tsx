import { LoadingState } from '../../shared/ui/loading-state'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ErrorMessage } from '../../shared/ui/error-message/index'
import { ScreenLayout } from '../../widgets/screen-layout/index'
import { chapterNotesEnabled } from '../../shared/config/index'
import { api } from '../../shared/api/index'
import type { ChapterSummary } from '../../entities/chapter'
import '../../shared/styles/library.css'

type Chapter = { name: string; questionCount: number }

export function ChapterLibrary() {
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notes, setNotes] = useState<ChapterSummary[]>()
  const [notesError, setNotesError] = useState('')
  const load = useCallback(async () => {
    setLoading(true); setError('')
    try { setChapters(await api<Chapter[]>('/public/chapters')) }
    catch (e) { setError((e as Error).message) }
    finally { setLoading(false) }
  }, [])
  useEffect(() => { void load() }, [load])
  const loadNotes = useCallback(async () => {
    setNotes(undefined); setNotesError('')
    try { setNotes(await api<ChapterSummary[]>('/student/chapters', {}, false, true)) }
    catch (e) { setNotesError(e instanceof Error ? e.message : 'Unable to load chapter notes.') }
  }, [])
  useEffect(() => { if (chapterNotesEnabled) void loadNotes() }, [chapterNotesEnabled, loadNotes])
  const filtered = useMemo(() => {
    const entries = new Map<string, { name: string; practice?: Chapter; notes: ChapterSummary[] }>()
    for (const chapter of chapters) entries.set(chapter.name.trim().toLowerCase(), { name: chapter.name, practice: chapter, notes: [] })
    for (const note of notes ?? []) {
      const key = note.title.trim().toLowerCase()
      const entry = entries.get(key) ?? { name: note.title, notes: [] }
      entry.notes.push(note)
      entries.set(key, entry)
    }
    return [...entries.values()].filter(entry => entry.name.toLowerCase().includes(query.trim().toLowerCase())).sort((a, b) => a.name.localeCompare(b.name))
  }, [chapters, notes, query])

  return <ScreenLayout>
    <div className="library-heading"><p className="screen-kicker">STUDY WORKSPACE</p><h1>Chapters</h1><p>{chapterNotesEnabled ? 'Browse published chapter notes and practice questions.' : 'Browse chapters with published practice questions. Chapter notes are coming soon.'}</p></div>
    <label className="library-search">Search chapters<input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search by chapter" /></label>
    {chapterNotesEnabled && <><ErrorMessage text={notesError}/>{notesError && <button className="outline-button" type="button" onClick={loadNotes}>Retry chapter notes</button>}
      {!notes && !notesError && <LoadingState label="Loading chapter notes..."/>}</>}
    <ErrorMessage text={error}/>
    {error && <button className="outline-button" type="button" onClick={load} disabled={loading}>Try again</button>}
    {loading && <LoadingState label="Loading chapters..."/>}
    {filtered.length ? <ul className="unified-chapters">
      {filtered.map(chapter => <li key={chapter.name.toLowerCase()}>
        <strong>{chapter.name}</strong><div>
          {chapter.notes.map((note, index) => <Link className="outline-button" key={note.id} to={'/app/chapters/' + note.id}>Read{chapter.notes.length > 1 ? ` ${index + 1}` : ''}</Link>)}
          {chapter.practice && <Link className="outline-button" to={'/practice?chapter=' + encodeURIComponent(chapter.practice.name)}>Practice ({chapter.practice.questionCount})</Link>}
        </div>
      </li>)}
    </ul> : !loading && !error && (!chapterNotesEnabled || notes || notesError) && <p>{chapters.length || notes?.length ? 'No chapters match your search.' : 'No published chapters are available yet.'}</p>}
  </ScreenLayout>
}

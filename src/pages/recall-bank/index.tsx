import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../../shared/api/index'
import { ErrorMessage } from '../../shared/ui/error-message/index'
import { LoadingState } from '../../shared/ui/loading-state'
import { ScreenLayout } from '../../widgets/screen-layout/index'

type Catalog = { chapters: { code: string; title: string }[]; sittings: { key: string; name: string }[] }
type Recall = { id: string; stem: string; topic: string; options: string[]; correct: number; explanation: string; why: string[]; sitting: string; number: number; pearl: string; trick: string; keyCheck: string; alsoIn: string[] }
type Page = { items: Recall[]; total: number; offset: number; limit: number }

export function RecallBank() {
  const { source } = useParams()
  const [chapter, setChapter] = useState('')
  const [sitting, setSitting] = useState('')
  const [offset, setOffset] = useState(0)
  const [catalog, setCatalog] = useState<Catalog>()
  const [page, setPage] = useState<Page>()
  const [error, setError] = useState('')
  const [catalogError, setCatalogError] = useState('')
  const validSource = source === 'recall' || source === 'fawzia'
  useEffect(() => { setChapter(''); setSitting(''); setOffset(0); setCatalog(undefined) }, [source])
  useEffect(() => {
    if (!validSource) return
    const controller = new AbortController()
    setCatalogError('')
    api<Catalog>('/student/handover/recall-catalog?source=' + encodeURIComponent(source), { signal: controller.signal }, false, true)
      .then(setCatalog).catch((e: unknown) => { if (!controller.signal.aborted) setCatalogError(e instanceof Error ? e.message : 'Unable to load recall filters.') })
    return () => controller.abort()
  }, [source, validSource])
  useEffect(() => {
    if (!validSource) return
    const controller = new AbortController()
    setPage(undefined); setError('')
    const query = new URLSearchParams({ source, offset: String(offset) })
    if (chapter) query.set('chapter', chapter)
    if (sitting) query.set('sitting', sitting)
    api<Page>('/student/handover/recalls?' + query, { signal: controller.signal }, false, true)
      .then(setPage).catch((e: unknown) => { if (!controller.signal.aborted) setError(e instanceof Error ? e.message : 'Unable to load recall questions.') })
    return () => controller.abort()
  }, [source, validSource, chapter, sitting, offset])
  if (!validSource) return <ScreenLayout><p>Unknown recall bank.</p><Link to="/app/resources">Learning resources</Link></ScreenLayout>
  return <ScreenLayout>
    <p><Link to="/app/resources">← Learning resources</Link></p>
    <h1>{source === 'recall' ? 'Recall questions' : 'Fawzia questions'}</h1>
    <p>These study questions are separate from regular chapter practice and mocks.</p>
    <label>Chapter <select value={chapter} onChange={event => { setChapter(event.target.value); setOffset(0) }}><option value="">All chapters</option>{catalog?.chapters.map(item => <option key={item.code} value={item.code}>{item.title}</option>)}</select></label>
    {source === 'recall' && <label> Sitting <select value={sitting} onChange={event => { setSitting(event.target.value); setOffset(0) }}><option value="">All sittings</option><option value="bank">Recall bank</option>{catalog?.sittings.map(item => <option key={item.key} value={item.key}>{item.name}</option>)}</select></label>}
    <ErrorMessage text={catalogError}/>
    <ErrorMessage text={error}/>
    {!page && !error ? <LoadingState label="Loading questions..."/> : page && <>
      <p>{page.total ? `${page.offset + 1}–${Math.min(page.offset + page.items.length, page.total)} of ${page.total}` : 'No questions match these filters.'}</p>
      {page.items.map(item => <article className="screen-card" key={item.id}>
        <p>{item.topic}{item.sitting ? ` · ${item.sitting}` : ''}{item.number ? ` · Question ${item.number}` : ''}</p>
        <h2>{item.stem}</h2><ol type="A">{item.options.map((option, index) => <li key={index}>{option}</li>)}</ol>
        <details><summary>Show answer and explanation</summary>
          <p><strong>Answer: {String.fromCharCode(65 + item.correct)}. {item.options[item.correct]}</strong></p><p>{item.explanation}</p>
          {item.why.some(Boolean) && <ul>{item.why.map((reason, index) => reason && <li key={index}>{String.fromCharCode(65 + index)}: {reason}</li>)}</ul>}
          {item.pearl && <p><strong>Pearl:</strong> {item.pearl}</p>}{item.trick && <p><strong>Trick:</strong> {item.trick}</p>}{item.keyCheck && <p><strong>Key check:</strong> {item.keyCheck}</p>}{item.alsoIn.length > 0 && <p>Also in: {item.alsoIn.join(', ')}</p>}
        </details>
      </article>)}
      <p><button className="outline-button" type="button" disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - page.limit))}>Previous</button>{' '}<button className="outline-button" type="button" disabled={offset + page.limit >= page.total} onClick={() => setOffset(offset + page.limit)}>Next</button></p>
    </>}
  </ScreenLayout>
}

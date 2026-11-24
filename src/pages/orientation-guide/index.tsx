import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LoadingState } from '../../shared/ui/loading-state'
import { ErrorMessage } from '../../shared/ui/error-message/index'
import { api } from '../../shared/api/index'
import { ScreenLayout } from '../../widgets/screen-layout/index'
import { SandboxedDocument } from '../../shared/ui/sandboxed-document'
import '../../shared/styles/study-planner.css'

type Guide = {
  revision: number
  content: { title: string; intro: string; sections: { id: string; title: string; body: string }[]; documentHtml?: string }
}

export function OrientationGuide() {
  const [guide, setGuide] = useState<Guide>()
  const [error, setError] = useState('')
  const load = useCallback(async () => {
    setError('')
    try {
      setGuide(await api<Guide>('/public/orientation-guide'))
    } catch (e) { setError(e instanceof Error ? e.message : 'Orientation guide is currently unavailable.') }
  }, [])
  useEffect(() => { void load() }, [load])

  return <ScreenLayout>
    <p className="screen-kicker">FREE TOOL</p><h1>{guide?.content.title ?? 'Orientation guide'}</h1>
    <ErrorMessage text={error}/>{error && <button className="outline-button" type="button" onClick={() => void load()}>Try again</button>}
    {!guide && !error ? <LoadingState label="Loading orientation guide..."/> : guide && <>
      {guide.content.documentHtml ? <SandboxedDocument title={guide.content.title} documentHtml={guide.content.documentHtml}/> : <>
        <p className="screen-card">{guide.content.intro}</p>
        <div className="dashboard-grid">{guide.content.sections.map(section => <section className="screen-card" key={section.id}><h2>{section.title}</h2><p style={{ whiteSpace: 'pre-wrap' }}>{section.body}</p></section>)}</div>
      </>}
      <Link className="outline-button" to="/tools">Back to study tools</Link>
    </>}
  </ScreenLayout>
}

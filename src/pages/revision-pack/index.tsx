import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../../shared/api/index'
import { ErrorMessage } from '../../shared/ui/error-message/index'
import { LoadingState } from '../../shared/ui/loading-state'
import { SandboxedDocument } from '../../shared/ui/sandboxed-document'
import { ScreenLayout } from '../../widgets/screen-layout/index'

type Pack = { title: string; documentHtml: string }

export function RevisionPack() {
  const { code } = useParams()
  const [pack, setPack] = useState<Pack>()
  const [error, setError] = useState('')
  useEffect(() => {
    const controller = new AbortController()
    setPack(undefined); setError('')
    if (code) api<Pack>('/student/handover/revision-packs/' + encodeURIComponent(code), { signal: controller.signal }, false, true)
      .then(setPack).catch((e: unknown) => { if (!controller.signal.aborted) setError(e instanceof Error ? e.message : 'Unable to load this revision pack.') })
    return () => controller.abort()
  }, [code])
  return <ScreenLayout>
    <p><Link to="/app/resources">← Learning resources</Link></p>
    <h1>{pack?.title ?? 'Revision pack'}</h1>
    <ErrorMessage text={error}/>
    {!pack && !error ? <LoadingState label="Loading revision pack..."/> : pack && <SandboxedDocument title={`${pack.title} revision pack`} documentHtml={pack.documentHtml} allowScripts/>}
  </ScreenLayout>
}

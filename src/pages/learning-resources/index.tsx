import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../shared/api/index'
import { ErrorMessage } from '../../shared/ui/error-message/index'
import { LoadingState } from '../../shared/ui/loading-state'
import { ScreenLayout } from '../../widgets/screen-layout/index'

type Resource = { id: string; kind: string; title: string; summary: string; body: string }
type Deck = { id: string; title: string; description: string; cards: { id: string; front: string; back: string }[] }
const labels: Record<string, string> = { 'revision-pack': 'Revision Packs', radio: 'RoyalPrep Radio', masterclass: 'Masterclass videos', 'mixed-bag': 'Mixed Bag recalls', 'fawzia-sheet': 'Fawzia sheets', 'last-week': 'Last week', 'exam-eve': 'Exam eve' }

export function LearningResources() {
  const [resources, setResources] = useState<Resource[]>()
  const [saved, setSaved] = useState<string[]>([])
  const [decks, setDecks] = useState<Deck[]>([])
  const [error, setError] = useState('')
  const load = useCallback(async () => { try { const [items, savedItems, sharedDecks] = await Promise.all([api<Resource[]>('/public/learning-resources'), api<Resource[]>('/student/saved-resources', {}, false, true), api<Deck[]>('/public/flashcard-decks')]); setResources(items); setSaved(savedItems.map(item => item.id)); setDecks(sharedDecks) } catch (e) { setError((e as Error).message) } }, [])
  useEffect(() => { void load() }, [load])
  async function toggle(id: string) { const next = !saved.includes(id); await api(`/student/saved-resources/${id}`, { method: 'PUT', body: JSON.stringify({ saved: next }) }, false, true); setSaved(current => next ? [...current, id] : current.filter(item => item !== id)) }
  return <ScreenLayout><p className="screen-kicker">LEARN AND RETAIN</p><h1>Learning resources</h1><p>Use the shared content library and save resources for later.</p><ErrorMessage text={error}/>{!resources && !error ? <LoadingState label="Loading resources..."/> : resources && <><div className="dashboard-grid">{resources.map(resource => <article className="screen-card" key={resource.id}><p className="screen-kicker">{labels[resource.kind] ?? resource.kind}</p><h2>{resource.title}</h2><p>{resource.summary}</p><details><summary>Open resource</summary><p style={{ whiteSpace: 'pre-wrap' }}>{resource.body}</p></details><button className="outline-button" type="button" onClick={() => void toggle(resource.id)}>{saved.includes(resource.id) ? 'Remove from saved' : 'Save resource'}</button></article>)}</div><h2>Shared flashcard decks</h2><div className="dashboard-grid">{decks.map(deck => <article className="screen-card" key={deck.id}><h3>{deck.title}</h3><p>{deck.description}</p><p>{deck.cards.length} cards available</p></article>)}</div></>}</ScreenLayout>
}

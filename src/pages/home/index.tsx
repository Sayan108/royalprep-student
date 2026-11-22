import { LoadingState } from '../../shared/ui/loading-state'
import { ErrorMessage } from '../../shared/ui/error-message'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../shared/assets/royalprep-logo-256.png'
import { HomeHero } from '../../widgets/home-hero/index'
import type { HeroRevision } from '../../entities/hero'
import { api } from '../../shared/api/index'
import '../../shared/styles/home.css'

type CatalogSummary = { questionCount: number; chapterCount: number }

export function Home() {
  const [summary, setSummary] = useState<CatalogSummary>()
  const [error, setError] = useState(false)
  const [hero, setHero] = useState<HeroRevision>()
  const [heroError, setHeroError] = useState('')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setError(false); setHeroError('')
    api<CatalogSummary>('/public/catalog-summary', { signal: controller.signal })
      .then(setSummary)
      .catch(() => { if (!controller.signal.aborted) setError(true) })
    api<HeroRevision>('/public/site/hero', { signal: controller.signal })
      .then(setHero)
      .catch(e => { if (!controller.signal.aborted) setHeroError((e as Error).message) })
    return () => controller.abort()
  }, [attempt])

  return <div className="home">
    <header className="home-top">
      <div className="home-wrap home-top-inner">
        <Link className="home-brand" to="/"><img src={logo} alt="" /><span>RoyalPrep</span></Link>
        <nav aria-label="Main navigation"><a href="#study">Study tools</a><Link to="/pricing">Pricing</Link><a href="#access">Access</a><a href="#faq">FAQ</a></nav>
        <Link className="home-button home-secondary" to="/practice">Study workspace <span aria-hidden="true">→</span></Link>
      </div>
    </header>
    <main>
      {hero ? <HomeHero content={hero.content}>
          <div aria-label="Published practice catalog">
            {error ? <><ErrorMessage text="Catalog counts are currently unavailable."/><button className="outline-button" type="button" onClick={() => setAttempt(value => value + 1)}>Try again</button></> : summary ? <dl>
              <div><dt>Practice questions</dt><dd>{summary.questionCount}</dd></div>
              <div><dt>Chapters with questions</dt><dd>{summary.chapterCount}</dd></div>
            </dl> : <LoadingState label="Loading catalog…"/>}
          </div>
      </HomeHero> : <section className="home-hero"><div className="home-wrap home-hero-inner"><div><h1>RoyalPrep</h1>{heroError ? <><ErrorMessage text="Homepage content is currently unavailable."/><button className="outline-button" type="button" onClick={() => setAttempt(value => value + 1)}>Try again</button></> : <LoadingState label="Loading homepage content…"/>}<Link className="home-text-link" to="/practice">Open practice <span aria-hidden="true">→</span></Link></div></div></section>}
      <section className="home-wrap home-section" id="study">
        <h2>Study tools</h2>
        <p>Prepare with single-best-answer questions and explanations.</p>
        <div className="home-links">
          <Link className="home-link" to="/practice"><span className="home-icon" aria-hidden="true">◇</span><span><strong>Practice questions</strong><small>Answer published questions and review explanations.</small></span><span aria-hidden="true">→</span></Link>
          <Link className="home-link" to="/study/library"><span className="home-icon" aria-hidden="true">▤</span><span><strong>Chapter library</strong><small>Browse chapters with published practice questions.</small></span><span aria-hidden="true">→</span></Link>
          <Link className="home-link" to="/tools/planner"><span className="home-icon" aria-hidden="true">◇</span><span><strong>Study planner</strong><small>Build an editable schedule for your preparation.</small></span><span aria-hidden="true">→</span></Link>
          <Link className="home-link" to="/app/mocks"><span className="home-icon" aria-hidden="true">◷</span><span><strong>Custom mocks and results</strong><small>Build a timed mock and review your answers.</small></span><span aria-hidden="true">→</span></Link>
        </div>
      </section>
      <section className="home-wrap home-row" id="access">
        <div><h2>Part A access</h2><p>Practice is currently available without a subscription. View the temporary plans before checkout is connected.</p></div>
        <Link className="home-text-link" to="/pricing">View plans <span aria-hidden="true">→</span></Link>
      </section>
      <section className="home-wrap home-faq" id="faq">
        <h2>Frequently asked questions</h2>
        <details><summary>How do I start studying?</summary><p>Open the study workspace to answer available practice questions and view explanations.</p></details>
        <details><summary>Is my progress saved?</summary><p>Your latest practice answers, study plans and custom mock attempts are saved when signed in.</p></details>
        <details><summary>Are mock exams available?</summary><p>Custom timed mocks are available. Scheduled Daily and Grand Mocks are not available yet.</p></details>
      </section>
    </main>
    <footer className="home-footer"><div className="home-wrap home-footer-inner"><Link className="home-brand" to="/"><img src={logo} alt="" /><span>RoyalPrep</span></Link><nav aria-label="Footer"><Link to="/sign-in">Student sign-in</Link></nav></div></footer>
  </div>
}

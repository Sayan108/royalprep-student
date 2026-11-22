import { Link } from 'react-router-dom'
import { ScreenLayout } from '../../widgets/screen-layout/index'
import '../../shared/styles/study-planner.css'

export function Tools() {
  return <ScreenLayout><p className="screen-kicker">FREE RESOURCES</p><h1>Study tools</h1><p>Explore the tools available for your preparation.</p>
    <div className="tools-grid">
      <section className="screen-card"><h2>Study planner</h2><p>Build and edit a schedule around your target date.</p><Link className="screen-button" to="/tools/planner">Open planner</Link></section>
      <section className="screen-card"><h2>Eligibility calculator</h2><p>Review the basic items to verify before planning your application.</p><Link className="outline-button" to="/tools/eligibility">Open calculator</Link></section>
      <section className="screen-card"><h2>Orientation guide</h2><p>Understand the preparation journey and how to use RoyalPrep.</p><Link className="outline-button" to="/tools/orientation">Open guide</Link></section>
      <section className="screen-card"><h2>Daily quiz</h2><p>Answer five questions every day.</p><Link className="outline-button" to="/app/daily-quiz">Start daily quiz</Link></section>
      <section className="screen-card"><h2>Learning resources</h2><p>Revision packs, audio, videos and recall sheets.</p><Link className="outline-button" to="/app/resources">Browse resources</Link></section>
      <section className="screen-card"><h2>Chapter catalog</h2><p>Search chapters with published practice questions.</p><Link className="outline-button" to="/course">Browse chapters</Link></section>
      <section className="screen-card"><h2>Personal flashcards</h2><p>Create cards and schedule your reviews after signing in.</p><Link className="outline-button" to="/tools/flashcards">Open flashcards</Link></section>
      <section className="screen-card"><h2>More tools</h2><p>Exam dates and the daily quiz are not available yet.</p></section>
    </div>
  </ScreenLayout>
}

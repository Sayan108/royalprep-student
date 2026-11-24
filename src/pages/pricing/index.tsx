import { Link } from 'react-router-dom'
import { ScreenLayout } from '../../widgets/screen-layout/index'
import '../../shared/styles/study-planner.css'

export function Pricing() {
  return <ScreenLayout>
    <div className="planner-heading">
      <p className="screen-kicker">PLANS AND ACCESS</p>
      <h1>Free access</h1>
      <p>Available RoyalPrep study features are free for now. Sign in to save your progress.</p>
    </div>
    <section className="screen-card">
      <h2>Study without a subscription</h2>
      <p>No payment is required for the currently available features.</p>
      <Link className="screen-button" to="/practice">Start practising</Link>
    </section>
  </ScreenLayout>
}

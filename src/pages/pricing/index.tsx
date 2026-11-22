import { Link } from 'react-router-dom'
import { ScreenLayout } from '../../widgets/screen-layout/index'
import '../../shared/styles/study-planner.css'

const plans = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    description: 'Explore the RoyalPrep learning experience.',
    features: ['Published practice questions', 'Basic explanations', 'Personal account'],
  },
  {
    name: 'Part A Complete',
    price: '₹999',
    period: 'per month',
    description: 'Dummy launch pricing for the complete Part A workspace.',
    features: ['Chapter practice', 'Custom mocks', 'Study planner', 'Personal flashcards', 'Mistake review'],
    featured: true,
  },
  {
    name: 'Part A Annual',
    price: '₹7,999',
    period: 'per year',
    description: 'Dummy annual pricing for longer-term preparation.',
    features: ['Everything in Part A Complete', 'Annual access', 'Priority content updates'],
  },
]

export function Pricing() {
  return <ScreenLayout>
    <div className="planner-heading">
      <p className="screen-kicker">PLANS AND ACCESS</p>
      <h1>Choose your RoyalPrep plan</h1>
      <p>These are temporary dummy prices for the web prototype. Razorpay checkout will be connected after the final plans and payment configuration are approved.</p>
    </div>
    <div className="dashboard-grid" aria-label="RoyalPrep plans">
      {plans.map(plan => <section className="screen-card" key={plan.name}>
        {plan.featured && <p className="screen-kicker">RECOMMENDED</p>}
        <h2>{plan.name}</h2>
        <p>{plan.description}</p>
        <p><strong>{plan.price}</strong> <small>{plan.period}</small></p>
        <ul>{plan.features.map(feature => <li key={feature}>{feature}</li>)}</ul>
        {plan.name === 'Free' ? <Link className="outline-button" to="/practice">Start practising</Link> : <button className="outline-button" type="button" disabled>Checkout coming soon</button>}
      </section>)}
    </div>
    <section className="screen-card">
      <h2>Payment status</h2>
      <p>Razorpay is the planned payment provider. No payment is collected by this prototype and no subscription is activated from this page.</p>
      <Link className="outline-button" to="/sign-in">Sign in</Link>
    </section>
  </ScreenLayout>
}

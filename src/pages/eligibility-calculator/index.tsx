import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ScreenLayout } from '../../widgets/screen-layout/index'
import '../../shared/styles/study-planner.css'

type Answer = 'yes' | 'no' | ''

export function EligibilityCalculator() {
  const [medicalQualification, setMedicalQualification] = useState<Answer>('')
  const [registration, setRegistration] = useState<Answer>('')
  const [englishRequirement, setEnglishRequirement] = useState<Answer>('')
  const [reviewedRules, setReviewedRules] = useState(false)

  const result = useMemo(() => {
    const answers = [medicalQualification, registration, englishRequirement]
    if (answers.some(answer => !answer) || !reviewedRules) return undefined
    if (answers.every(answer => answer === 'yes')) {
      return { title: 'Ready for a detailed application check', message: 'Your answers match the basic planning checklist. Confirm the current official requirements before applying.', tone: 'answer-correct' }
    }
    return { title: 'Review requirements before applying', message: 'At least one checklist item needs attention. Check the current official guidance and contact the relevant examining body.', tone: 'answer-incorrect' }
  }, [englishRequirement, medicalQualification, registration, reviewedRules])

  return <ScreenLayout>
    <div className="planner-heading">
      <p className="screen-kicker">FREE TOOL</p>
      <h1>Eligibility calculator</h1>
      <p>Use this checklist to identify what you should verify before planning your exam application.</p>
    </div>
    <section className="screen-card">
      <p><strong>Important:</strong> This is a planning aid, not an official eligibility decision. Requirements can change by exam, country and application route.</p>
      <div className="planner-fields">
        <label>Do you hold a recognised medical qualification?
          <select value={medicalQualification} onChange={event => setMedicalQualification(event.target.value as Answer)}>
            <option value="">Choose an answer</option><option value="yes">Yes</option><option value="no">No / not yet</option>
          </select>
        </label>
        <label>Have you checked your registration requirements?
          <select value={registration} onChange={event => setRegistration(event.target.value as Answer)}>
            <option value="">Choose an answer</option><option value="yes">Yes</option><option value="no">No / not yet</option>
          </select>
        </label>
        <label>Have you checked the current English-language requirements?
          <select value={englishRequirement} onChange={event => setEnglishRequirement(event.target.value as Answer)}>
            <option value="">Choose an answer</option><option value="yes">Yes</option><option value="no">No / not yet</option>
          </select>
        </label>
      </div>
      <label className="check"><input type="checkbox" checked={reviewedRules} onChange={event => setReviewedRules(event.target.checked)}/> I understand that official guidance takes precedence over this tool.</label>
      {result && <div className={result.tone} role="status"><strong>{result.title}</strong><p>{result.message}</p></div>}
    </section>
    <section className="screen-card">
      <h2>Next steps</h2>
      <ol>
        <li>Confirm the current official eligibility and registration guidance.</li>
        <li>Collect qualification, registration and language evidence.</li>
        <li>Use the <Link to="/tools/planner">study planner</Link> once your application route is clear.</li>
      </ol>
      <Link className="outline-button" to="/tools">Back to study tools</Link>
    </section>
  </ScreenLayout>
}

import { useState } from 'react'
import CandidatesTable from './components/CandidatesTable.jsx'
import PreliminaryTable from './components/PreliminaryTable.jsx'

export default function App() {
  const [step, setStep] = useState(1)
  const [candidates, setCandidates] = useState([])
  const [selected, setSelected] = useState([])

  return (
    <div className="app">
      {step === 1 && (
        <CandidatesTable
          candidates={candidates}
          onSelect={setSelected}
          onNext={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <PreliminaryTable
          candidates={selected}
          onNext={() => setStep(3)}
        />
      )}
    </div>
  )
}

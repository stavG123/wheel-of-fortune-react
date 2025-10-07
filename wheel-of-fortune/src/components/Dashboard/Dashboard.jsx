import { useEffect, useState } from 'react'
import PuzzleBoard from './PuzzleBoard.jsx'
import './dashboard.css'
import { getRandomClue } from '../../data/clues.js'

function Dashboard() {
  const [round, setRound] = useState(1)
  const [clue, setClue] = useState(null)
  const [letters, setLetters] = useState([])
  const [revealed, setRevealed] = useState([])

  const startNewRound = () => {
    const next = getRandomClue()
    const chars = next.phrase.toUpperCase().split('')
    setRound(r => r + (clue ? 1 : 0))
    setClue(next)
    setLetters(chars)
    setRevealed(chars.map(ch => (/[A-Z]/.test(ch) ? false : true)))
  }

  useEffect(() => {
    startNewRound()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <h1>Wheel of Fortune</h1>
        {clue && (
          <h2 style={{ marginTop: '8px', color: '#e2e8f0' }}>{clue.category}</h2>
        )}
      </header>

      <main className="dashboard__main">
        <section className="dashboard__board">
          <PuzzleBoard
            letters={letters}
            revealed={revealed}
            onRevealIndex={(i) =>
              setRevealed(prev => prev.map((v, idx) => (idx === i ? true : v)))
            }
          />
        </section>

        <aside className="dashboard__sidebar">
          <div className="panel">
            <h2>Controls</h2>
            <button className="button">Spin</button>
            <button className="button">Buy Vowel</button>
            <button className="button button--secondary">Solve</button>
            <button className="button" onClick={startNewRound}>New Round</button>
          </div>

          <div className="panel">
            <h2>Bank</h2>
            <div className="bank__row">
              <span>Player</span>
              <strong>$0</strong>
            </div>
            <div className="bank__row">
              <span>Round</span>
              <strong>$0</strong>
            </div>
            <div className="bank__row">
              <span>Round #</span>
              <strong>{round}</strong>
            </div>
          </div>
        </aside>
      </main>
    </div>
  )
}

export default Dashboard



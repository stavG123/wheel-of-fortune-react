import PuzzleBoard from './PuzzleBoard.jsx'
import './dashboard.css'

function Dashboard() {
  const samplePhrase = 'GIVE YOURSELF A ROUND OF APPLAUSE'

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <h1>Wheel of Fortune</h1>
      </header>

      <main className="dashboard__main">
        <section className="dashboard__board">
          <PuzzleBoard phrase={samplePhrase} />
        </section>

        <aside className="dashboard__sidebar">
          <div className="panel">
            <h2>Controls</h2>
            <button className="button">Spin</button>
            <button className="button">Buy Vowel</button>
            <button className="button button--secondary">Solve</button>
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
          </div>
        </aside>
      </main>
    </div>
  )
}

export default Dashboard



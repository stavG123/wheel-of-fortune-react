import { useEffect, useState } from 'react'
import PuzzleBoard from './PuzzleBoard.jsx'
import './dashboard.css'
import { getRandomClue } from '../../data/clues.js'
import WheelOfFortune from './Wheel.jsx'

function Dashboard() {
  const [round, setRound] = useState(1)
  const [clue, setClue] = useState(null)
  const [letters, setLetters] = useState([])
  const [revealed, setRevealed] = useState([])
  const [isSolveOpen, setIsSolveOpen] = useState(false) //modal controller 
  const [guess, setGuess] = useState('') //for guessing whole solution
  const [isConstantOpen, setIsConstantOpen] = useState(false) //maybe add consonant const?
  const [isVowelOpen, setIsVowelOpen] = useState(false) // add vowel const?

  const startNewRound = () => {
    const next = getRandomClue()
    const chars = next.phrase.toUpperCase().split('')
    setRound(r => r + (clue ? 1 : 0))
    setClue(next)
    setLetters(chars)
    setRevealed(chars.map(ch => (/[A-Z]/.test(ch) ? false : true))) //use for revelaing letters later, array of true/false
  }

  const openSolvePopup = () => setIsSolveOpen(true)
  const closeSolvePopup = () => {
    setIsSolveOpen(false)
    setGuess('')
  }

  const openConsonantPopup = () => setIsConstantOpen(true)
  const closeConstantPopup = () => {
    setIsConstantOpen(false)
  }

  const openVowelPopup = () => setIsVowelOpen(true)
  const closeVowelPopup = () => {
    setIsVowelOpen(false)
  }

  const submitSolution = () => {
    if (guess.trim().toUpperCase() === letters.join('')) {
      alert("Correct! You solved it!")
      setRevealed(letters.map(() => true))
      closeSolvePopup()
      startNewRound() //guessed correctly 
    } else {
      alert("Sorry, that's not correct.")
      closeSolvePopup()
      //next player, incorrect
    }
    closeSolvePopup()
    //next round
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
            <button className='button' onClick={openConsonantPopup}>Guess a Consonant</button>
            <button className="button" onClick={openVowelPopup}>Buy Vowel</button>
            <button className="button button--secondary" onClick={openSolvePopup}>
              Solve
            </button>
            <button className="button" onClick={startNewRound}>New Round</button> {/* remove later */}
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

          <div className="panel">
            <h2>Wheel</h2>
            <WheelOfFortune />
          </div>

          {isSolveOpen && (
            <div className="modal-overlay">
              <div className="modal">
                <h2>Enter Your Solution</h2>
                <input
                  type="text"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value.toUpperCase())}
                  placeholder="Type your solution here..."
                  className="modal-input"
                />
                <div className="modal-buttons">
                  <button className="button" onClick={submitSolution}>Submit</button>
                  <button className="button button--secondary" onClick={closeSolvePopup}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {isConstantOpen && (
            <div className="modal-overlay">
              <div className="modal">
                <h2>Choose a Consonant</h2>

                <div className="col-lg-4 center-block text-center" id="button-container">
                  {[
                    ['B','C','D','F','G','H','J'],
                    ['K','L','M','N','P','Q','R'],
                    ['S','T','V','W','X','Y','Z']
                  ].map((row, rowIdx) => (
                    <div className="btn-group" role="group" key={rowIdx} id={`key-row${rowIdx + 1}`}>
                      {row.map(letter => (
                        <button
                          key={letter}
                          type="button"
                          className="letter-button btn btn-lg btn-warning"
                          onClick={() => handleLetterClick(letter)} //add consonant function
                        >
                          {letter}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>

                <div className="modal-buttons" style={{ marginTop: '20px' }}>
                  <button className="button button--secondary" onClick={closeConstantPopup}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {isVowelOpen && (
            <div className="modal-overlay">
              <div className="modal text-center">
                <h2>Buy a Vowel</h2>

                <div className="col-lg-4 center-block text-center" id="vowel-container">
                  <div className="btn-group" role="group" id="vowel-row">
                    <button type="button" className="letter-button btn btn-lg btn-info" name="letter">A</button>
                    <button type="button" className="letter-button btn btn-lg btn-info" name="letter">E</button>
                    <button type="button" className="letter-button btn btn-lg btn-info" name="letter">I</button>
                    <button type="button" className="letter-button btn btn-lg btn-info" name="letter">O</button>
                    <button type="button" className="letter-button btn btn-lg btn-info" name="letter">U</button>
                  </div>
                </div>

                <div className="mt-3">
                  <button className="btn btn-secondary" onClick={closeVowelPopup}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </aside>
      </main>
    </div>
  )
}

export default Dashboard

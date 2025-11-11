import { useEffect, useState, useCallback } from 'react'
import PuzzleBoard from './PuzzleBoard.jsx'
import './dashboard.css'
import { getRandomClue } from '../../data/clues.js'
import WheelOfFortune from './Wheel.jsx'
import AdSquare from '../Ads/AdSquare.jsx'
import xAd from '../../assets/x.png'
import yAd from '../../assets/y.png'
import kAd from '../../assets/k.png'

function Dashboard() {
  // state
  const [round, setRound] = useState(1)
  const [clue, setClue] = useState(null)
  const [letters, setLetters] = useState([])
  const [revealed, setRevealed] = useState([])
  const [isSolveOpen, setIsSolveOpen] = useState(false) //modal controller 
  const [guess, setGuess] = useState('') //for guessing whole solution
  const [isConstantOpen, setIsConstantOpen] = useState(false) //maybe add consonant const?
  const [isVowelOpen, setIsVowelOpen] = useState(false) // add vowel const?
  const [status, setStatus] = useState('Choose a letter to guess') // message at top of screen
  const [guessed, setGuessed] = useState(() => new Set())
  const [players, setPlayers] = useState([
  { id: 1, name: 'Player 1', balance: 0 },
  { id: 2, name: 'Player 2', balance: 0 },
  { id: 3, name: 'Player 3', balance: 0 }
  ])
  const [currentPlayer, setCurrentPlayer] = useState(1)
  const [canSpin, setCanSpin] = useState(true)


  const nextPlayer = useCallback(() => {
  setCurrentPlayer(prev => (prev % 3) + 1)
  setSpinResult(null)  // reset wheel value for next player
  setCanSpin(true)
  }, [])
  const [spinResult, setSpinResult] = useState(null);





  // start a new round
  const startNewRound = useCallback(() => {
    const next = getRandomClue()
    const chars = next.phrase.toUpperCase().split('')
    setRound(r => r + (clue ? 1 : 0))
    setClue(next)
    setLetters(chars)
    setGuessed(new Set())
    setRevealed(chars.map(ch => (/[A-Z]/.test(ch) ? false : true))) //use for revealing letters later, array of true/false
    setStatus('New round! Spin the wheel to find prize value.')
  }, [clue])

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

  // initial load
  useEffect(() => {
    startNewRound()

  }, [])

  const handleAcknowledge = () => {
      // Handle “Lose a Turn”
      if (spinResult === "Lose a Turn") {
        setStatus("You lost your turn!");
        setCurrentPlayer((prev) => (prev % players.length) + 1);
        setSpinResult(null);
      }

      // Handle “Bankrupt”
      else if (spinResult === "Bankrupt") {
        setPlayers(prev =>
          prev.map(p =>
            p.id === currentPlayer ? { ...p, balance: 0 } : p
          )
        );
        setStatus("You went BANKRUPT! Turn passes on.");
        setCurrentPlayer((prev) => (prev % players.length) + 1);
        setSpinResult(null);
      }

      // Handle regular OK (like after a correct/incorrect guess)
      else {
        setStatus("");
      }
    };
    

  const handleSpinResult = (value) => {
  setSpinResult(value);
  setCanSpin(false); // disable spinning until a consonant is guessed

  const nextId = (currentPlayer % players.length) + 1;
  const nextName = players.find(p => p.id === nextId)?.name;

  if (value === "Bankrupt") {
    setStatus(`BANKRUPT! You lose all your money! Player ${nextName}'s turn to spin.`);
  } else if (value === "Lose a Turn") {
    setStatus(`Lose a Turn! Player ${nextName}'s turn to spin.`);
  } else {
    setStatus(`You spun $${value}! Guess a consonant. For each occurrence of your guess you'll win $${value}.`);
  }
};


  // guess handler 
  function handleLetterClick(raw) {
    if (!clue) return

    // This gets the first letter and makes it uppercase
    const L = String(raw).trim().slice(0, 1).toUpperCase()
    if (!/^[A-Z]$/.test(L)) { setStatus('Letters A–Z only.'); return }

    // Already picked that letter
    if (guessed.has(L)) {
      setStatus(`You already picked “${L}”.`)
      return
    }

    // Add to guessed set
    setGuessed(prev => {
      const next = new Set(prev)
      next.add(L)
      return next
    })

    const phraseUpper = clue.phrase.toUpperCase()

    // Count hits (how many L in the phrase)
    const hits = [...phraseUpper].filter(ch => ch === L).length

    if (hits > 0) {
      setStatus(`That is Correct! ${L} appears ${hits} time(s). \nSpin again, buy a vowel, or solve!`)

      // Reveal the matching tiles in the revealed[] array
      setRevealed(prev =>
        prev.map((v, idx) => {
          const ch = letters[idx]
          // keep already-revealed, or reveal if this tile is a letter that matches L
          return v || (/[A-Z]/.test(ch) && ch === L)
        })
      )

      // Award the player money when their guess is correct
      console.log('Spin result:', spinResult)

      // Award money only for consonants
      const value = Number(spinResult);
      const isVowel = "AEIOU".includes(L);

      if (!isNaN(value) && !isVowel) {
        setPlayers(prev => prev.map(p =>
          p.id === currentPlayer
            ? { ...p, balance: p.balance + (value * hits) }
            : p
        ));
      }
      if (isVowel) {
        setPlayers(prev => prev.map(p =>
          p.id === currentPlayer
            ? { ...p, balance: Math.max(p.balance - 250, 0) }
            : p
        ));
      }



      // After revealing, check if puzzle is fully solved
      setTimeout(() => {
        // This is checking if every letter in the puzzle is revealed or matches the one just guessed
        const allRevealed = letters.every((ch, i) =>
          /[A-Z]/.test(ch) ? (revealed[i] || ch === L) : true
        )
        if (allRevealed) {
          setStatus('YOU REVEALED EVERYTHING! PRESS “New Round”.')
        }
      }, 0)
    } else {
      const nextId = (currentPlayer % players.length) + 1;
      const nextName = players.find(p => p.id === nextId)?.name;
      setStatus(`No “${L}” in the puzzle, ${nextName}'s turn to spin the wheel, buy a vowel, or solve!`)
      nextPlayer()
    }
  }

  // Instead of getting a blank screen when loading puzzle, it will show a small message
  if (!clue) {
    return (
      <div className="dashboard">
        <header className="dashboard__header">
          <h1>Wheel of Fortune</h1>
        </header>
        <div style={{ textAlign: 'center', marginTop: 12, color: '#005acfff' }}>
          Loading puzzle…
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <h1 style={ {color: '#228fefff'} }>Wheel of Fortune</h1>
      </header>

      

      <main className="dashboard__main">

        <section className="dashboard__board">

          <div className="dashboard__header">

            <div style={{ textAlign: 'center', color: '#77bdfa', marginTop: '-15rem' }}>
              <h2 style={{ margin: '0 0 4px 0' }}>Category: {clue.category}</h2>
            </div>

            <div className="prompt-container">
              <h2 className="turn-prompt">
                {players.find(p => p.id === currentPlayer)?.name}'s Turn
              </h2>
              <p className="status-text">{status}</p>
            </div>



            <div className="players-container">
            {players.map(p => (
              <div
                key={p.id}
                className={`player-box ${currentPlayer === p.id ? 'active-player' : ''}`}
              >
                <h3>{p.name}</h3>
                <div className="player-balance">${p.balance}</div>
              </div>
            ))}
          </div>

        </div>
        
          <PuzzleBoard
            letters={letters}
            guessedLetters={guessed}
          />

          <div className="guessed-letters-container">
            <h2>Guessed Letters:</h2>

            <div className="guessed-groups">
              <div className="guessed-group">
                <h4>Consonants</h4>
                <div className="guessed-letters">
                  {([...guessed].filter(l => !"AEIOU".includes(l)).length > 0)
                    ? [...guessed]
                        .filter(l => !"AEIOU".includes(l))
                        .sort()
                        .map(letter => (
                          <span key={letter} className="guessed-letter">
                            {letter}
                          </span>
                        ))
                    : <em>No consonants guessed yet.</em>}
                </div>
            </div>

            <div className="guessed-group">
              <h4>Vowels</h4>
                <div className="guessed-letters">
                  {([...guessed].filter(l => "AEIOU".includes(l)).length > 0)
                    ? [...guessed]
                        .filter(l => "AEIOU".includes(l))
                        .sort()
                        .map(letter => (
                          <span key={letter} className="guessed-letter vowel">
                            {letter}
                          </span>
                        ))
                    : <em>No vowels guessed yet.</em>}
                </div>
              </div>
            </div>
          </div>

        </section>



        <aside className="dashboard__sidebar">
          
          <div className="panel">
            <h2>Controls</h2>
            <button
              className="button"
              onClick={openConsonantPopup}
              disabled={!spinResult || spinResult === "Bankrupt" || spinResult === "Lose a Turn"}
            >
              Guess a Consonant
            </button>

            <button
              className="button"
              onClick={openVowelPopup}
              disabled={players.find(p => p.id === currentPlayer)?.balance < 250}
            >
              Buy Vowel ($250)
            </button>
            <button className="button" onClick={openSolvePopup}>
              Solve
            </button>
            <button className="button" onClick={startNewRound}>New Round</button> {/* remove later */}
          </div>

          <div className="panel">
            <h2>Wheel</h2>
            <WheelOfFortune onResult={handleSpinResult} canSpin={canSpin} />
          </div>

          <div className="panel">
            <h2>Sponsored</h2>
            {/* Example usage: images placed in public/ads/ (e.g. public/ads/ad1.jpg) */}
            <AdSquare
              images={[
                xAd,
                yAd,
                kAd
              ]}
            />
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
                    ['B', 'C', 'D', 'F', 'G', 'H', 'J'],
                    ['K', 'L', 'M', 'N', 'P', 'Q', 'R'],
                    ['S', 'T', 'V', 'W', 'X', 'Y', 'Z']
                  ].map((row, rowIdx) => (
                    <div className="btn-group" role="group" key={rowIdx} id={`key-row${rowIdx + 1}`}>
                      {row.map(letter => {
                          const isGuessed = guessed.has(letter) // Check if letter is already in the 'guessed' Set
                          return (
                        <button
                          key={letter}
                          type="button"
                          className={`letter-button btn btn-lg btn-warning ${isGuessed ? 'disabled-letter' : ''}`}
                          onClick={() => {
                                if (!isGuessed) {
                                    handleLetterClick(letter)
                                    closeConstantPopup() // Close modal on successful guess attempt
                                }
                            }}
                            disabled={isGuessed} // Disable button if already guessed
                        >
                          {letter}
                        </button>
                      )})}
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
                      {['A', 'E', 'I', 'O', 'U'].map(letter => {
                          const isGuessed = guessed.has(letter) // Check if letter is already in the 'guessed' Set
                          return (
                            <button
                              key={letter}
                              type="button"
                              className={`letter-button btn btn-lg btn-info ${isGuessed ? 'disabled-letter' : ''}`}
                              name="letter"
                              onClick={() => {
                                  if (!isGuessed) {
                                      handleLetterClick(letter)
                                      closeVowelPopup() // Close modal on successful guess attempt
                                  }
                              }}
                              disabled={isGuessed} // Disable button if already guessed
                            >
                              {letter}
                            </button>
                          )
                      })}
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

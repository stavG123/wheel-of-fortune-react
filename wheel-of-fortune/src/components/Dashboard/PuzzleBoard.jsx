
import './puzzle-board.css'

const TILE_COLUMNS = 14
const TILE_ROWS = 8

function PuzzleBoard({ letters = [], guessedLetters }) {
  // fallback so it's never undefined
  const guessed = guessedLetters instanceof Set ? guessedLetters : new Set()
  const phrase = letters.join('')
  // Get just the A-Z words for the "one word per row" layout
  const words = (phrase.toUpperCase().match(/[A-Z]+/g) || [])

  return (
    <div className="puzzle-board">
      {Array.from({ length: TILE_ROWS }).map((_, rowIdx) => {
        const word = words[rowIdx] || ''
        const wordLen = word.length
        return (
          <div className="puzzle-row" key={`row-${rowIdx}`}>
            {Array.from({ length: TILE_COLUMNS }).map((_, colIdx) => {
              const isFilled = colIdx < wordLen          // true when this cell should hold a letter
              const letter = isFilled ? word[colIdx] : ''
              const isRevealed = isFilled && guessed.has(letter) // true when letter exists AND was guessed

              return (
                <div
                  key={`tile-${rowIdx}-${colIdx}`}
                  className={
                    'tile ' +
                    (isFilled
                      ? isRevealed
                        ? 'tile--revealed' // letter exists and was guessed -> white tile w/ letter
                        : 'tile--hidden'   // letter exists but not guessed -> highlighted green
                      : 'tile--empty')     // no letter here -> dim placeholder
                  }
                >
                  {isRevealed ? letter : ''}
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

export default PuzzleBoard

import './puzzle-board.css'

const TILE_COLUMNS = 14
const TILE_ROWS = 8

function PuzzleBoard({ letters = [], guessedLetters }) {
  // This is a fallback so uts never undefined
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
              const isFilled = colIdx < wordLen
              const letter = isFilled ? word[colIdx] : ''
              const isRevealed = isFilled && guessed.has(letter)
              return (
                <div
                  key={`tile-${rowIdx}-${colIdx}`}
                  className={'tile ' + (isFilled 
                    // make filled tiles white from the start
                    ? 'tile--revealed' 
                    // letter wil still hidden until guessed
                    : 'tile--hidden')}
                  {...isRevealed ? letter : ''}
                />
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

export default PuzzleBoard



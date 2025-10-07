import './puzzle-board.css'

const TILE_COLUMNS = 14
const TILE_ROWS = 8

function PuzzleBoard({ letters }) {
  const phrase = letters.join('')
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
              return (
                <div
                  key={`tile-${rowIdx}-${colIdx}`}
                  className={'tile ' + (isFilled ? 'tile--revealed' : 'tile--hidden')}
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



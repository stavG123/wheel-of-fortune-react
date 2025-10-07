import './puzzle-board.css'

const TILE_COLUMNS = 14

function normalizePhrase(phrase) {
  return phrase.toUpperCase().replace(/[^A-Z\s]/g, '')
}

function partitionPhraseIntoRows(phrase) {
  const cleaned = normalizePhrase(phrase)
  const words = cleaned.split(/\s+/).filter(Boolean)
  const rows = [[]]
  let currentLength = 0

  for (const word of words) {
    const wordLength = word.length
    if (currentLength === 0) {
      rows[rows.length - 1].push(word)
      currentLength = wordLength
      continue
    }
    if (currentLength + 1 + wordLength <= TILE_COLUMNS) {
      rows[rows.length - 1].push(word)
      currentLength += 1 + wordLength
    } else {
      rows.push([word])
      currentLength = wordLength
    }
  }

  return rows.map(wordsInRow => wordsInRow.join(' '))
}

function PuzzleBoard({ phrase }) {
  const rows = partitionPhraseIntoRows(phrase)

  return (
    <div className="puzzle-board">
      {rows.map((rowText, rowIdx) => {
        const rowChars = rowText.padEnd(TILE_COLUMNS, ' ').slice(0, TILE_COLUMNS).split('')
        return (
          <div className="puzzle-row" key={`row-${rowIdx}`}>
            {rowChars.map((char, colIdx) => {
              const isLetter = /[A-Z]/.test(char)
              return (
                <div
                  key={`tile-${rowIdx}-${colIdx}`}
                  className={'tile' + (isLetter ? ' tile--letter' : ' tile--letter')}
                >
                  {''}
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



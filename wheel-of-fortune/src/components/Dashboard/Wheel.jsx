import { useMemo, useState } from 'react'
import './wheel.css'

const DEFAULT_SEGMENTS = [
  { label: '$500', color: '#F22B35' },
  { label: '$600', color: '#F99533' },
  { label: '$700', color: '#24CA69' },
  { label: '$800', color: '#514E50' },
  { label: '$900', color: '#46AEFF' },
  { label: '$1000', color: '#9145B7' },
  { label: 'BANKRUPT', color: '#0ea5e9' },
  { label: 'LOSE A TURN', color: '#f59e0b' },
]

function polarToCartesian(radius, angleDeg) {
  const angle = (angleDeg - 90) * (Math.PI / 180)
  return { x: radius * Math.cos(angle), y: radius * Math.sin(angle) }
}

function describeSlice(radius, startAngle, endAngle) {
  const start = polarToCartesian(radius, endAngle)
  const end = polarToCartesian(radius, startAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1
  return [
    'M', 0, 0,
    'L', start.x, start.y,
    'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    'Z',
  ].join(' ')
}

export default function Wheel({ segments = DEFAULT_SEGMENTS, onStop }) {
  const [spinning, setSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [prizeIndex, setPrizeIndex] = useState(0)

  const segmentAngle = 360 / segments.length
  const radius = 180

  const slices = useMemo(() => {
    return segments.map((seg, idx) => {
      const startAngle = idx * segmentAngle
      const endAngle = startAngle + segmentAngle
      return { seg, idx, d: describeSlice(radius, startAngle, endAngle), startAngle, endAngle }
    })
  }, [segments, segmentAngle])

  const spin = () => {
    if (spinning) return
    const target = Math.floor(Math.random() * segments.length)
    setPrizeIndex(target)
    const spins = 6
    const final = 360 * spins + (360 - (target * segmentAngle + segmentAngle / 2))
    setSpinning(true)
    setRotation(final)
  }

  const handleTransitionEnd = () => {
    if (!spinning) return
    setSpinning(false)
    if (onStop) onStop(segments[prizeIndex], prizeIndex)
  }

  return (
    <div className="wheel">
      <div className="wheel__container">
        <svg
          className={spinning ? 'wheel__svg wheel__svg--spinning' : 'wheel__svg'}
          viewBox="-200 -200 400 400"
          style={{ transform: `rotate(${rotation}deg)` }}
          onTransitionEnd={handleTransitionEnd}
        >
          {slices.map(({ seg, d, idx, startAngle }) => (
            <g key={idx}>
              <path d={d} fill={seg.color} stroke="#0b2a4a" strokeWidth="2" />
              <text
                x="0"
                y="0"
                fill="#fff"
                fontSize="14"
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${startAngle + segmentAngle / 2}) translate(120 0) rotate(${90})`}
              >
                {seg.label}
              </text>
            </g>
          ))}
        </svg>

        <div className="wheel__pointer" />
      </div>

      <button className="button" onClick={spin} disabled={spinning}>
        {spinning ? 'Spinning…' : 'Spin'}
      </button>
    </div>
  )
}



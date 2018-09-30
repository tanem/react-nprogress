import { css, keyframes } from 'emotion'
import * as React from 'react'

const spinner = keyframes`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`

const Spinner: React.SFC = () => (
  <div
    className={css({
      display: 'block',
      position: 'fixed',
      right: 15,
      top: 15,
      zIndex: 1031
    })}
  >
    <div
      className={css({
        animation: `${spinner} 400ms linear infinite`,
        borderBottom: '2px solid transparent',
        borderLeft: '2px solid #29d',
        borderRadius: '50%',
        borderRight: '2px solid transparent',
        borderTop: '2px solid #29d',
        boxSizing: 'border-box',
        height: 18,
        width: 18
      })}
    />
  </div>
)

export default Spinner

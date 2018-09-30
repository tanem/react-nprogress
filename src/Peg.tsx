import { css } from 'emotion'
import * as React from 'react'

const Peg: React.SFC = () => (
  <div
    className={css({
      boxShadow: '0 0 10px #29d, 0 0 5px #29d',
      display: 'block',
      height: '100%',
      opacity: 1,
      position: 'absolute',
      right: 0,
      transform: 'rotate(3deg) translate(0px, -4px)',
      width: 100
    })}
  />
)

export default Peg

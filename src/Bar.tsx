import { css } from 'emotion'
import * as React from 'react'

interface Props {
  ease: string
  marginLeft: string
  speed: number
}

const Bar: React.SFC<Props> = ({ children, ease, marginLeft, speed }) => (
  <div
    className={css({
      background: '#29d',
      height: 2,
      left: 0,
      marginLeft,
      position: 'fixed',
      top: 0,
      transition: `margin-left ${speed}ms ${ease}`,
      width: '100%',
      zIndex: 1031
    })}
  >
    {children}
  </div>
)

export default Bar

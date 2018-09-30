import { css } from 'emotion'
import * as React from 'react'

interface Props {
  ease: string
  opacity: number
  speed: number
}

const Container: React.SFC<Props> = ({ children, ease, opacity, speed }) => (
  <div
    className={css({
      opacity,
      pointerEvents: 'none',
      transition: `opacity ${speed}ms ${ease}`
    })}
  >
    {children}
  </div>
)

export default Container

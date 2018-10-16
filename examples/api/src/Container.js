import { css } from 'emotion'
import * as React from 'react'

const Container = ({ children, isFinished, speed }) => (
  <div
    className={css({
      opacity: isFinished ? 0 : 1,
      pointerEvents: 'none',
      transition: `opacity ${speed}ms linear`
    })}
  >
    {children}
  </div>
)

export default Container

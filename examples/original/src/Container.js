import { css } from 'emotion'
import * as React from 'react'

const Container = ({ children, isFinished, animationDuration }) => (
  <div
    className={css({
      opacity: isFinished ? 0 : 1,
      pointerEvents: 'none',
      transition: `opacity ${animationDuration}ms linear`
    })}
  >
    {children}
  </div>
)

export default Container

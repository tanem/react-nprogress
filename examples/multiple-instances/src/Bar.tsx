import React from 'react'

const Bar: React.FC<{
  animationDuration: number
  progress: number
}> = ({ animationDuration, progress }) => (
  <div
    style={{
      background: '#29d',
      height: 2,
      left: 0,
      marginLeft: `${(-1 + progress) * 100}%`,
      position: 'relative',
      top: 0,
      transition: `margin-left ${animationDuration}ms linear`,
      width: '100%',
      zIndex: 1031,
    }}
  />
)

export default Bar

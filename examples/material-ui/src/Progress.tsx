import Container from '@mui/material/Container'
import LinearProgress from '@mui/material/LinearProgress'
import { useNProgress } from '@tanem/react-nprogress'
import React from 'react'

const Progress: React.FC<{ isAnimating: boolean }> = ({ isAnimating }) => {
  const { animationDuration, isFinished, progress } = useNProgress({
    isAnimating,
  })

  return (
    <Container
      disableGutters={true}
      sx={{
        opacity: isFinished ? 0 : 1,
        pointerEvents: 'none',
        transition: `opacity ${animationDuration}ms linear`,
      }}
    >
      <LinearProgress
        sx={{
          '& .MuiLinearProgress-bar1Determinate': {
            transitionDuration: `${animationDuration}ms`,
          },
        }}
        value={progress * 100}
        variant="determinate"
      />
    </Container>
  )
}

export default Progress

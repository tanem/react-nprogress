import Container from '@mui/material/Container'
import LinearProgress from '@mui/material/LinearProgress'
import { makeStyles, Theme } from '@mui/styles'
import { useNProgress } from '@tanem/react-nprogress'
import React from 'react'

const useStyles = makeStyles<
  Theme,
  Pick<ReturnType<typeof useNProgress>, 'animationDuration' | 'isFinished'>
>({
  bar: ({ animationDuration }) => ({
    transitionDuration: `${animationDuration}ms`,
  }),
  container: ({ animationDuration, isFinished }) => ({
    opacity: isFinished ? 0 : 1,
    pointerEvents: 'none',
    transition: `opacity ${animationDuration}ms linear`,
  }),
})

const Progress: React.FC<{ isAnimating: boolean }> = ({ isAnimating }) => {
  const { animationDuration, isFinished, progress } = useNProgress({
    isAnimating,
  })
  const classes = useStyles({ animationDuration, isFinished })

  return (
    <Container classes={{ root: classes.container }} disableGutters={true}>
      <LinearProgress
        classes={{ bar1Determinate: classes.bar }}
        value={progress * 100}
        variant="determinate"
      />
    </Container>
  )
}

export default Progress

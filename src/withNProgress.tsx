import hoistNonReactStatics from 'hoist-non-react-statics'
import * as React from 'react'
import { Options } from './types'
import { useNProgress } from './useNProgress'

type Outer<P> = P & Options

type Inner<P> = P & ReturnType<typeof useNProgress>

export function withNProgress<P>(BaseComponent: React.ComponentType<Inner<P>>) {
  const WithNProgress: React.FC<Outer<P>> = (props) => {
    const hookProps = useNProgress(props)
    return <BaseComponent {...props} {...hookProps} />
  }

  hoistNonReactStatics(WithNProgress, BaseComponent)

  return WithNProgress
}

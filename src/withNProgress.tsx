import hoistNonReactStatics from 'hoist-non-react-statics'
import type { ComponentType, FC } from 'react'

import type { Options } from './types'
import { useNProgress } from './useNProgress'

type Outer<P> = P & Options

type Inner<P> = P & ReturnType<typeof useNProgress>

export function withNProgress<P>(
  BaseComponent: ComponentType<Inner<P>>,
): FC<Outer<P>> {
  const WithNProgress: FC<Outer<P>> = (props) => {
    const hookProps = useNProgress(props)
    return <BaseComponent {...props} {...hookProps} />
  }

  hoistNonReactStatics(WithNProgress, BaseComponent)

  return WithNProgress
}

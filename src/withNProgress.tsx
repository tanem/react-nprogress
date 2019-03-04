import hoistNonReactStatics from 'hoist-non-react-statics'
import * as React from 'react'
import { NProgress, Props, RenderProps } from './NProgress'

type EnhancedProps<P> = P &
  Partial<Pick<Props, Exclude<keyof Props, 'children'>>>

export function withNProgress<P>(
  BaseComponent: React.ComponentType<EnhancedProps<P>>
) {
  const WithNProgress: React.FC<EnhancedProps<P>> = props => (
    <NProgress {...props}>
      {(p: RenderProps) => <BaseComponent {...props} {...p} />}
    </NProgress>
  )

  hoistNonReactStatics(WithNProgress, BaseComponent)

  return WithNProgress
}

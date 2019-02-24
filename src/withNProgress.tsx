import hoistNonReactStatics from 'hoist-non-react-statics'
import * as React from 'react'
import { NProgress, RenderProps } from './NProgress'

export function withNProgress<Props>(
  BaseComponent: React.ComponentType<Props & RenderProps>
) {
  // TODO: is this prop passing correct?
  // have we found an issue here, we want the props to be drilled don't we?
  // https://reactjs.org/docs/higher-order-components.html#convention-pass-unrelated-props-through-to-the-wrapped-component
  const WithNProgress: React.FC<Props> = props => (
    <NProgress {...props}>
      {(p: RenderProps) => <BaseComponent {...props} {...p} />}
    </NProgress>
  )

  WithNProgress.displayName = `WithNProgress(${BaseComponent.displayName ||
    BaseComponent.name ||
    'Component'})`

  hoistNonReactStatics(WithNProgress, BaseComponent)

  return WithNProgress
}

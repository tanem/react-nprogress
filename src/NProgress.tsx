import * as React from 'react'

import { Options } from './types'
import { useNProgress } from './useNProgress'

type Props = Options & {
  children: (renderProps: ReturnType<typeof useNProgress>) => React.ReactElement
}

export const NProgress: React.FC<Props> = ({
  children,
  ...restProps
}: Props) => {
  const renderProps = useNProgress(restProps)
  return children(renderProps)
}

import type { FC, ReactElement } from 'react'

import type { Options } from './types'
import { useNProgress } from './useNProgress'

type Props = Options & {
  children: (renderProps: ReturnType<typeof useNProgress>) => ReactElement
}

export const NProgress: FC<Props> = ({ children, ...restProps }: Props) => {
  const renderProps = useNProgress(restProps)
  return children(renderProps)
}

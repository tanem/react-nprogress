import type { FC, ReactElement } from 'react'

import type { NProgressOptions, NProgressState } from './types'
import { useNProgress } from './useNProgress'

type Props = NProgressOptions & {
  children: (renderProps: NProgressState) => ReactElement
}

export const NProgress: FC<Props> = ({ children, ...restProps }: Props) => {
  const renderProps = useNProgress(restProps)
  return children(renderProps)
}

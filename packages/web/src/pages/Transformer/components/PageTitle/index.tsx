import type { FC } from 'react'

export interface PageTitleProps {
  children: string
}

export const PageTitle: FC<PageTitleProps> = (props) => {
  const { children } = props

  return (
    <div flex="~" h-10 items-center>
      <div className="h-80% bg-#1677ff" w-4px mr-4></div>
      <div text-4 font-500>{children}</div>
    </div>
  )
}

import type { StepProps } from 'antd'
import type { ReactNode } from 'react'
import type { DocContentProps } from './DocContent'
import { DocContent } from './DocContent'
import type { DocFormatProps } from './DocFormat'
import { DocFormat } from './DocFormat'
import { ResultDownload } from './ResultDownload'

type Step = StepProps & {
  content: ReactNode
}

export const getSteps = ({ docContentProps, docFormatProps }: {
  docContentProps: DocContentProps
  docFormatProps: DocFormatProps
}): Step[] => ([
  {
    title: '文档内容',
    content: <DocContent {...docContentProps} />,
  },
  {
    title: '文档格式',
    content: <DocFormat {...docFormatProps} />,
  },
  {
    title: '结果下载',
    content: <ResultDownload />,
  },
])

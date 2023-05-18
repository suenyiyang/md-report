import type { StepProps } from 'antd'
import type { ReactNode } from 'react'
import { DocContent } from './DocContent'
import { DocFormat } from './DocFormat'
import { ResultDownload } from './ResultDownload'

type Step = StepProps & {
  content: ReactNode
}

export const STEPS: Step[] = [
  {
    title: '文档内容',
    content: <DocContent />,
  },
  {
    title: '文档格式',
    content: <DocFormat />,
  },
  {
    title: '结果下载',
    content: <ResultDownload />,
  },
]

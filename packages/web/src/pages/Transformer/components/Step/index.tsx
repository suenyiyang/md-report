import type { FC } from 'react'
import { useMemo } from 'react'
import type { StepProps as AntdStepProps } from 'antd'
import { Steps } from 'antd'

export interface StepProps {
  currentStep: string
}

export const Step: FC<StepProps> = (props) => {
  const { currentStep } = props

  const current = useMemo(() => Number(currentStep), [currentStep])

  const items: AntdStepProps[] = [
    { title: '文档内容', description: '请将文档内容粘贴到文本框中' },
    { title: '格式配置', description: '' },
    { title: '完成', description: '' },
  ]

  return <Steps current={current} progressDot direction="vertical" items={items} />
}

import { Button } from 'antd'
import type { FC } from 'react'
import { useSearchParams } from 'react-router-dom'

export interface FooterButtonProps {
  total: number
  onFinish: () => void
}

export const FooterButton: FC<FooterButtonProps> = (props) => {
  const { total, onFinish } = props
  const [params, setParams] = useSearchParams()
  const currentStep = params.get('step') ?? '0'

  const handleNextStep = () => {
    setParams({ step: (Number(currentStep) + 1).toString() })
  }

  const handlePrevStep = () => {
    setParams({ step: (Number(currentStep) - 1).toString() })
  }

  const hasPrevStep = () => {
    return Number(currentStep) > 0
  }

  const hasNextStep = () => {
    return Number(currentStep) < total - 1
  }

  return (
    <div>
      {hasPrevStep() && (
        <Button size="large" onClick={handlePrevStep}>上一步</Button>
      )}
      {hasNextStep() && (
        <Button size="large" ml-2 type="primary" onClick={handleNextStep}>
          下一步
        </Button>
      )}
      {!hasNextStep() && (
        <Button size="large" ml-2 type="primary" onClick={onFinish}>下载文档</Button>
      )}
    </div>
  )
}

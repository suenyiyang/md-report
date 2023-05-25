import type { FC } from 'react'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { saveAs } from 'file-saver'
import { parseDocument } from '@md-report/parser'
import * as generatorWeb from '@md-report/core/generatorWeb'
import { notification } from 'antd'
import { Step } from './components/Step'
import { FooterButton } from './components/FooterButton'
import { getSteps } from './constants'
import './index.css'
import { useTextArea } from './DocContent/useTextArea'

export const Transformer: FC = () => {
  const [params] = useSearchParams({ step: '0' })
  const docContentProps = useTextArea()
  const docFormatProps = useTextArea('{}')
  const STEPS = getSteps({
    docContentProps,
    docFormatProps,
  })
  const currentStep = useMemo(() => params.get('step') ?? '0', [params])
  const [api] = notification.useNotification({ placement: 'topRight' })

  const onFinish = async() => {
    try {
      const blob = await generatorWeb.getBlob(await generatorWeb.generateDocument(parseDocument(docContentProps.value)))
      saveAs(blob, 'report.docx')
    }
    catch (error) {
      api.error({ message: '生成出错了……' })
      console.error(error, docContentProps, docFormatProps)
    }
  }

  return (
    <div relative pb-16 w-full h-full>
      <div h-full w-full flex="~ row">
        <div className={'hideOnPhone w-25%'} p-8>
          <Step currentStep={currentStep} />
        </div>
        <div className="main w-50%" h-full bg-white p-8>
          {STEPS[Number(currentStep)].content}
        </div>
        <div className={'hideOnPhone w-25%'}></div>
      </div>
      <div className="footerbar" absolute bottom-0 w-full h-16 bg-white p="l-25% r-25%" flex="~ row" items-center justify-end>
        <FooterButton total={STEPS.length} onFinish={onFinish}></FooterButton>
      </div>
    </div>
  )
}

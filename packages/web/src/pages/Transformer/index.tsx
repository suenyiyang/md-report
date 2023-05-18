import type { FC } from 'react'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { saveAs } from 'file-saver'
import { parseDocument } from '@md-report/parser'
import { generatorWeb } from '@md-report/core'
import { Step } from './components/Step'
import { FooterButton } from './components/FooterButton'
import { STEPS } from './constants'

export const Transformer: FC = () => {
  const [params] = useSearchParams({ step: '0' })
  const currentStep = useMemo(() => params.get('step') ?? '0', [params])

  // const onFinish = async() => {
  //   const blob = await generatorWeb.getBlob(await generatorWeb.generateDocument(parseDocument('```mermaid\ngraph LR\nA-->B\n```')))
  //   saveAs(blob, 'report.docx')
  // }

  return (
    <div relative pb-16 w-full h-full>
      <div h-full w-full flex="~ row">
        <div className="w-25%" p-8>
          <Step currentStep={currentStep} />
        </div>
        <div className="w-50%" h-full bg-white p-8>
          {STEPS[Number(currentStep)].content}
        </div>
        <div className="w-25%"></div>
      </div>
      <div absolute bottom-0 w-full h-16 bg-white p="l-25% r-25%" flex="~ row" items-center justify-end>
        <FooterButton total={STEPS.length} onFinish={() => {}}></FooterButton>
      </div>
    </div>
  )
}

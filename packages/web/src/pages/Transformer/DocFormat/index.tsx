import type { FC } from 'react'
import { PageTitle } from '../components/PageTitle'
import { TextArea } from '../components/TextArea'

export interface DocFormatProps {
  value: string
  onChange: (e: any) => void
}

export const DocFormat: FC<DocFormatProps> = (props) => {
  const { value, onChange } = props

  return (
    <div>
      <PageTitle>格式配置</PageTitle>
      <div mt-4>
        <TextArea value={value} onChange={onChange} />
      </div>
    </div>
  )
}

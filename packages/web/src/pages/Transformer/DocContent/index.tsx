import type { FC } from 'react'
import { PageTitle } from '../components/PageTitle'
import { TextArea } from '../components/TextArea'

export interface DocContentProps {
  value: string
  onChange: (e: any) => void
}

export const DocContent: FC<DocContentProps> = (props) => {
  const { value, onChange } = props

  return (
    <div>
      <PageTitle>文档内容</PageTitle>
      <div mt-4>
        <TextArea value={value} onChange={onChange} />
      </div>
    </div>
  )
}

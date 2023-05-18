import type { FC } from 'react'
import { PageTitle } from '../components/PageTitle'
import { TextArea } from '../components/TextArea'

export const DocContent: FC = () => {
  return (
    <div>
      <PageTitle>文档内容</PageTitle>
      <div mt-4>
        <TextArea value="" onChange={() => {}} />
      </div>
    </div>
  )
}

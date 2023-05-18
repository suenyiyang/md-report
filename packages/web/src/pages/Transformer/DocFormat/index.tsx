import type { FC } from 'react'
import { PageTitle } from '../components/PageTitle'
import { TextArea } from '../components/TextArea'

export const DocFormat: FC = () => {
  return (
    <div>
      <PageTitle>格式配置</PageTitle>
      <div mt-4>
        <TextArea value="" onChange={() => {}} />
      </div>
    </div>
  )
}

import type { FC } from 'react'
import { FileDoneOutlined } from '@ant-design/icons'
import { PageTitle } from '../components/PageTitle'

export const ResultDownload: FC = () => {
  return (
    <div>
      <PageTitle>结果下载</PageTitle>
      <div mt-30 flex="~ col" items-center>
        <div><FileDoneOutlined className="color-#1677ff" text-30 /></div>
      </div>
    </div>
  )
}

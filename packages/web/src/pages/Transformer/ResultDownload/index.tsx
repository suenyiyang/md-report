import type { FC } from 'react'
import { FileDoneOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { PageTitle } from '../components/PageTitle'

export const ResultDownload: FC = () => {
  return (
    <div>
      <PageTitle>结果下载</PageTitle>
      <div mt-16 flex="~ col" items-center>
        <div><FileDoneOutlined className="color-#1677ff" text-20 /></div>
        <Button type="primary" mt-4>生成并下载文档</Button>
      </div>
    </div>
  )
}

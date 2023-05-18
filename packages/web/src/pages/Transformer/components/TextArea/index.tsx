import type { ChangeEvent, FC } from 'react'
import { Input } from 'antd'

export interface TextAreaProps {
  value: string
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void
}

export const TextArea: FC<TextAreaProps> = (props) => {
  const { value, onChange } = props

  return <Input.TextArea value={value} onChange={onChange} autoSize={{ minRows: 20 }} placeholder="请输入" />
}

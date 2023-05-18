import { useState } from 'react'

export const useTextArea = () => {
  const [value, setValue] = useState('')

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
  }

  return {
    value,
    onChange,
  }
}

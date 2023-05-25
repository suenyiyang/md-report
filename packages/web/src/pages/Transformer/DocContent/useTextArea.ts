import type { ChangeEvent } from 'react'
import { useState } from 'react'

export const useTextArea = (initialValue = '') => {
  const [value, setValue] = useState(initialValue)

  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.currentTarget.value ?? initialValue)
  }

  return {
    value,
    onChange,
  }
}

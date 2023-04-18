import type { FC } from 'react'
import { StrictMode } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'

export const App: FC = () => {
  return <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
}

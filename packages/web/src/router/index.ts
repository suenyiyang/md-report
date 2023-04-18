import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
const Transformer = lazy(async() => ({ default: (await import('../pages/Transformer')).Transformer }))

export const router = createBrowserRouter([
  { path: '/transformer', Component: Transformer },
])

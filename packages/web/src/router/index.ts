import { lazy } from 'react'
import type { RouteProps } from 'react-router-dom'

const Home = lazy(() => import('../pages/Home').then(m => ({ default: m.Home })))
const Transformer = lazy(() => import('../pages/Transformer').then(m => ({ default: m.Transformer })))
const NotFound = lazy(() => import('../pages/NotFound').then(m => ({ default: m.NotFound })))

export const routes: RouteProps[] = [
  { path: '/', Component: Home },
  { path: '/transformer', Component: Transformer },
  { path: '*', Component: NotFound },
]

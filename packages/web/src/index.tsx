import { createRoot } from 'react-dom/client'
import { App } from './App'
import 'virtual:uno.css'
import 'antd/dist/reset.css'

createRoot(document.getElementById('app')!).render(<App />)

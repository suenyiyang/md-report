import { createRoot } from 'react-dom/client'
import { App } from './App'
import 'virtual:uno.css'
import '@unocss/reset/tailwind.css'

createRoot(document.getElementById('app')!).render(<App />)

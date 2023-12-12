import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Interactor from './Interactor.tsx'
import { solve10B } from './task10.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Interactor process={solve10B} />
  </React.StrictMode>,
)

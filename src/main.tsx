import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Interactor from './Interactor.tsx'
import { solve10A } from './task10.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Interactor process={solve10A} />
  </React.StrictMode>,
)

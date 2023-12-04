import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Interactor from './Interactor.tsx'
import { solve4A } from './task4.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Interactor process={solve4A} />
  </React.StrictMode>,
)

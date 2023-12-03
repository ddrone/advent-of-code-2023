import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Interactor from './Interactor.tsx'
import { solve2B } from './task2.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Interactor process={solve2B} />
  </React.StrictMode>,
)

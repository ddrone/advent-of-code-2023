import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { solve1A } from './Task1A.tsx'
import Interactor from './Interactor.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Interactor process={solve1A} />
  </React.StrictMode>,
)

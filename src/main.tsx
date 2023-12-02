import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { solve1B } from './Task1A.tsx'
import Interactor from './Interactor.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Interactor process={solve1B} />
  </React.StrictMode>,
)

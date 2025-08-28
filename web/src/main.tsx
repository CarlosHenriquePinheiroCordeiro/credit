import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Contratos } from './pages/Contratos'
import { ThemeProvider } from './theme/ThemeProvider'
import './index.css'
import './styles/theme.css'
import '@fontsource/ubuntu/300.css'
import '@fontsource/ubuntu/400.css'
import '@fontsource/ubuntu/500.css'
import '@fontsource/ubuntu/700.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Contratos />
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>,
)

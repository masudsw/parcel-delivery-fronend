import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { ThemeProvider } from './pages/providers/theme.provider'

import { Provider as ReduxProvider } from 'react-redux'
import { store } from './redux/store'
import { Toaster } from 'sonner'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReduxProvider store={store}>

    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
    <RouterProvider router={router}/>
      <Toaster richColors/>
    </ThemeProvider>
    </ReduxProvider>
  </StrictMode>,
)

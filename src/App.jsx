import { HashRouter, Routes, Route } from 'react-router-dom'
import { AdminRoutes } from '@/routes/AdminRoutes.jsx';
import { ToastProvider } from '@/context/ToastContext.jsx';
function App() {

  return (
    <ToastProvider>
        <HashRouter>
          <Routes>
            <Route path="/*" element={<AdminRoutes />} />
            <Route path="/admin/*" element={<AdminRoutes />} />
          </Routes>
        </HashRouter>
    </ToastProvider>
  )
}

export default App

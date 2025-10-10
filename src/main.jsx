import { createRoot } from 'react-dom/client'
import './index.css'
import 'primereact/resources/themes/saga-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import { AuthProvider } from './context/AuthContext'
import { CollaboratorAuthProvider } from './context/CollaboratorAuthContext.jsx'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <AuthProvider>
      <CollaboratorAuthProvider>
        <App />
      </CollaboratorAuthProvider>
    </AuthProvider>
)

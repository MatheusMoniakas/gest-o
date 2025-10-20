import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import { Board } from './components/Board'
import { AuthModal } from './components/Auth/AuthModal'
import { UserProfile } from './components/UserProfile'
import { User, LogIn } from 'lucide-react'
import './App.css'

function AppContent() {
  const { user, loading } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showUserProfile, setShowUserProfile] = useState(false)

  if (loading) {
    return (
      <div className="app">
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="app">
        <div className="welcome-screen">
          <div className="welcome-content">
            <h1>Kanban Board</h1>
            <h2>Organize suas tarefas de forma visual</h2>
            <p>
              Crie boards personalizados, organize tarefas em listas e acompanhe o progresso 
              com um sistema visual intuitivo e moderno.
            </p>
            <button 
              onClick={() => setShowAuthModal(true)}
              className="btn-primary"
            >
              <LogIn size={20} />
              Entrar / Criar conta
            </button>
          </div>
        </div>
        
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </div>
    )
  }

  return (
    <DataProvider>
      <div className="app">
        <div className="main-content">
          <div className="main-header">
            <h2 className="header-title">Kanban Board</h2>
            <div className="header-actions">
              <button
                onClick={() => setShowUserProfile(true)}
                className="user-button"
              >
                <User size={20} />
                {user.user_metadata?.full_name || 'Usuário'}
              </button>
            </div>
          </div>
          <Board />
        </div>
        
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
        
        {showUserProfile && (
          <div className="modal-overlay" onClick={() => setShowUserProfile(false)}>
            <div className="modal-content user-profile-modal" onClick={(e) => e.stopPropagation()}>
              <UserProfile onClose={() => setShowUserProfile(false)} />
            </div>
          </div>
        )}
      </div>
    </DataProvider>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App

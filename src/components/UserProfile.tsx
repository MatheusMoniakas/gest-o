import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { User, LogOut, Settings, Mail } from 'lucide-react'

interface UserProfileProps {
  onClose: () => void
}

export function UserProfile({ onClose }: UserProfileProps) {
  const { user, signOut, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '')
  const [loading, setLoading] = useState(false)

  const handleUpdateProfile = async () => {
    setLoading(true)
    const { error } = await updateProfile({ full_name: fullName })
    
    if (!error) {
      setIsEditing(false)
    }
    
    setLoading(false)
  }

  const handleSignOut = async () => {
    await signOut()
    onClose()
  }

  return (
    <div className="user-profile">
      <div className="user-profile-header">
        <div className="user-avatar">
          <User size={24} />
        </div>
        <div className="user-info">
          <h3>{user?.user_metadata?.full_name || 'Usuário'}</h3>
          <p className="user-email">
            <Mail size={14} />
            {user?.email}
          </p>
        </div>
      </div>

      <div className="user-profile-content">
        {isEditing ? (
          <div className="edit-profile">
            <div className="form-group">
              <label htmlFor="fullName">Nome completo</label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Seu nome completo"
                disabled={loading}
              />
            </div>
            <div className="edit-actions">
              <button
                onClick={() => setIsEditing(false)}
                className="btn-cancel"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdateProfile}
                className="btn-save"
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        ) : (
          <div className="profile-actions">
            <button
              onClick={() => setIsEditing(true)}
              className="profile-action"
            >
              <Settings size={16} />
              Editar perfil
            </button>
            <button
              onClick={handleSignOut}
              className="profile-action sign-out"
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>
        )}
      </div>
    </div>
  )
}



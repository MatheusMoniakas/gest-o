import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'

interface LoginFormProps {
  onSwitchToSignUp: () => void
}

export function LoginForm({ onSwitchToSignUp }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await signIn(email, password)
    
    if (error) {
      setError(error.message)
    }
    
    setLoading(false)
  }

  return (
    <div className="auth-form">
      <div className="auth-header">
        <h2>Entrar</h2>
        <p>Bem-vindo de volta! Faça login para continuar.</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form-content">
        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <div className="input-group">
            <Mail size={20} className="input-icon" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="password">Senha</label>
          <div className="input-group">
            <Lock size={20} className="input-icon" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle"
              disabled={loading}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="auth-button"
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>

        <div className="auth-switch">
          <p>Não tem uma conta?</p>
          <button
            type="button"
            onClick={onSwitchToSignUp}
            className="auth-link"
            disabled={loading}
          >
            Criar conta
          </button>
        </div>
      </form>
    </div>
  )
}



import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'

interface SignUpFormProps {
  onSwitchToLogin: () => void
}

export function SignUpForm({ onSwitchToLogin }: SignUpFormProps) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const { signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('As senhas não coincidem')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      setLoading(false)
      return
    }

    const { error } = await signUp(email, password, fullName)
    
    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
    
    setLoading(false)
  }

  if (success) {
    return (
      <div className="auth-form">
        <div className="auth-header">
          <h2>Verifique seu email</h2>
          <p>Enviamos um link de confirmação para {email}</p>
        </div>
        
        <div className="auth-success">
          <p>Clique no link no seu email para ativar sua conta.</p>
          <button
            onClick={onSwitchToLogin}
            className="auth-button"
          >
            Voltar ao login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-form">
      <div className="auth-header">
        <h2>Criar conta</h2>
        <p>Crie sua conta para começar a organizar suas tarefas.</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form-content">
        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="fullName">Nome completo</label>
          <div className="input-group">
            <User size={20} className="input-icon" />
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Seu nome completo"
              required
              disabled={loading}
            />
          </div>
        </div>

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
              placeholder="Mínimo 6 caracteres"
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

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar senha</label>
          <div className="input-group">
            <Lock size={20} className="input-icon" />
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme sua senha"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="password-toggle"
              disabled={loading}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="auth-button"
          disabled={loading}
        >
          {loading ? 'Criando conta...' : 'Criar conta'}
        </button>

        <div className="auth-switch">
          <p>Já tem uma conta?</p>
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="auth-link"
            disabled={loading}
          >
            Fazer login
          </button>
        </div>
      </form>
    </div>
  )
}



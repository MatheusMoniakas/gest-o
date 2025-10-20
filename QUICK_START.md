# 🚀 Quick Start - Trello Clone com Supabase

## 1. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com:

```env
VITE_SUPABASE_URL=https://nbuxyywdcbshoewifjhu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5idXh5eXdkY2JzaG9ld2lmanh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5ODE3MjUsImV4cCI6MjA3NjU1NzcyNX0.2sEN6eyvQU-hdX1VhC1kgAF4oacv5Wsh9XO9zaFKdPA
```

## 2. Configurar Banco de Dados

1. Acesse o painel do Supabase: https://supabase.com/dashboard
2. Vá em **SQL Editor**
3. Copie e cole todo o conteúdo do arquivo `setup-database.sql`
4. Execute o script

## 3. Configurar Autenticação (Opcional)

Para desenvolvimento, você pode desabilitar a confirmação de email:

1. No painel do Supabase, vá em **Authentication > Settings**
2. Desmarque **Enable email confirmations**
3. Adicione `http://localhost:3002` nas **Site URL** e **Redirect URLs**

## 4. Executar a Aplicação

```bash
npm run dev
```

Acesse: http://localhost:3002

## 5. Testar Funcionalidades

1. **Criar conta**: Clique em "Entrar / Criar conta"
2. **Criar board**: Clique em "Criar Primeiro Board"
3. **Adicionar listas**: Use o botão "+" para adicionar listas
4. **Adicionar cards**: Clique em "Adicionar um card" em qualquer lista
5. **Drag and Drop**: Arraste cards entre listas

## ✅ Funcionalidades Implementadas

- 🔐 **Autenticação completa** (login/registro/logout)
- 📋 **Boards personalizados** (criar/editar/deletar)
- 📝 **Listas organizadas** (criar/editar/deletar)
- 🎯 **Cards com drag and drop** (mover entre listas)
- 💾 **Persistência de dados** (salvo no Supabase)
- 🎨 **Interface moderna** (glassmorphism design)
- 🔒 **Segurança** (dados isolados por usuário)

## 🛠️ Estrutura do Projeto

```
src/
├── components/
│   ├── Auth/           # Componentes de autenticação
│   ├── Board.tsx       # Componente principal do board
│   ├── List.tsx        # Componente de lista
│   ├── Card.tsx        # Componente de card
│   └── UserProfile.tsx # Perfil do usuário
├── context/
│   ├── AuthContext.tsx # Contexto de autenticação
│   └── DataContext.tsx # Contexto de dados
├── lib/
│   └── supabase.ts     # Configuração do Supabase
└── types/
    └── index.ts        # Tipos TypeScript
```

## 🔧 Comandos Úteis

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## 🎯 Próximos Passos

1. **Personalizar design**: Modifique `src/App.css`
2. **Adicionar funcionalidades**: Labels, comentários, anexos
3. **Implementar notificações**: Sistema de notificações em tempo real
4. **Adicionar colaboração**: Compartilhar boards com outros usuários
5. **Deploy**: Deploy no Vercel, Netlify ou similar

## 🆘 Solução de Problemas

### Erro de CORS
- Verifique se as URLs estão configuradas no Supabase
- Adicione `http://localhost:3002` nas configurações de autenticação

### Erro de RLS
- Verifique se as políticas foram criadas corretamente
- Execute o script `setup-database.sql` novamente

### Erro de conexão
- Verifique se as variáveis de ambiente estão corretas
- Confirme se o arquivo `.env.local` existe na raiz do projeto

---

**🎉 Sua aplicação Kanban está pronta para uso!**


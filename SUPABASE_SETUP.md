# Configuração do Supabase

## 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Clique em "New Project"
4. Escolha sua organização
5. Digite o nome do projeto: `trello-clone`
6. Escolha uma senha forte para o banco de dados
7. Escolha a região mais próxima
8. Clique em "Create new project"

## 2. Configurar Variáveis de Ambiente

1. Copie o arquivo `env.example` para `.env.local`:
   ```bash
   cp env.example .env.local
   ```

2. No painel do Supabase, vá em Settings > API
3. Copie a URL do projeto e a chave anônima
4. Cole no arquivo `.env.local`:
   ```env
   VITE_SUPABASE_URL=sua_url_do_projeto
   VITE_SUPABASE_ANON_KEY=sua_chave_anonima
   ```

## 3. Criar Tabelas no Banco de Dados

Execute os seguintes SQLs no SQL Editor do Supabase:

### Tabela de Perfis
```sql
-- Criar tabela de perfis
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem apenas seu próprio perfil
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Política para usuários atualizarem apenas seu próprio perfil
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Política para inserir perfil quando usuário se registra
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

### Tabela de Boards
```sql
-- Criar tabela de boards
CREATE TABLE boards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem apenas seus próprios boards
CREATE POLICY "Users can view own boards" ON boards
  FOR SELECT USING (auth.uid() = owner_id);

-- Política para usuários criarem boards
CREATE POLICY "Users can create boards" ON boards
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Política para usuários atualizarem seus boards
CREATE POLICY "Users can update own boards" ON boards
  FOR UPDATE USING (auth.uid() = owner_id);

-- Política para usuários deletarem seus boards
CREATE POLICY "Users can delete own boards" ON boards
  FOR DELETE USING (auth.uid() = owner_id);
```

### Tabela de Listas
```sql
-- Criar tabela de listas
CREATE TABLE lists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  board_id UUID REFERENCES boards(id) ON DELETE CASCADE NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE lists ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem listas de seus boards
CREATE POLICY "Users can view lists from own boards" ON lists
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM boards 
      WHERE boards.id = lists.board_id 
      AND boards.owner_id = auth.uid()
    )
  );

-- Política para usuários criarem listas em seus boards
CREATE POLICY "Users can create lists in own boards" ON lists
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM boards 
      WHERE boards.id = lists.board_id 
      AND boards.owner_id = auth.uid()
    )
  );

-- Política para usuários atualizarem listas de seus boards
CREATE POLICY "Users can update lists from own boards" ON lists
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM boards 
      WHERE boards.id = lists.board_id 
      AND boards.owner_id = auth.uid()
    )
  );

-- Política para usuários deletarem listas de seus boards
CREATE POLICY "Users can delete lists from own boards" ON lists
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM boards 
      WHERE boards.id = lists.board_id 
      AND boards.owner_id = auth.uid()
    )
  );
```

### Tabela de Cards
```sql
-- Criar tabela de cards
CREATE TABLE cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  list_id UUID REFERENCES lists(id) ON DELETE CASCADE NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  labels TEXT[],
  attachments INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  checklist JSONB,
  due_date TIMESTAMP WITH TIME ZONE,
  assignee TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem cards de suas listas
CREATE POLICY "Users can view cards from own lists" ON cards
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM lists 
      JOIN boards ON boards.id = lists.board_id
      WHERE lists.id = cards.list_id 
      AND boards.owner_id = auth.uid()
    )
  );

-- Política para usuários criarem cards em suas listas
CREATE POLICY "Users can create cards in own lists" ON cards
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM lists 
      JOIN boards ON boards.id = lists.board_id
      WHERE lists.id = cards.list_id 
      AND boards.owner_id = auth.uid()
    )
  );

-- Política para usuários atualizarem cards de suas listas
CREATE POLICY "Users can update cards from own lists" ON cards
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM lists 
      JOIN boards ON boards.id = lists.board_id
      WHERE lists.id = cards.list_id 
      AND boards.owner_id = auth.uid()
    )
  );

-- Política para usuários deletarem cards de suas listas
CREATE POLICY "Users can delete cards from own lists" ON cards
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM lists 
      JOIN boards ON boards.id = lists.board_id
      WHERE lists.id = cards.list_id 
      AND boards.owner_id = auth.uid()
    )
  );
```

## 4. Configurar Triggers para Updated At

```sql
-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para todas as tabelas
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_boards_updated_at BEFORE UPDATE ON boards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lists_updated_at BEFORE UPDATE ON lists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cards_updated_at BEFORE UPDATE ON cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 5. Configurar Autenticação

1. No painel do Supabase, vá em Authentication > Settings
2. Configure as URLs permitidas:
   - Site URL: `http://localhost:3002`
   - Redirect URLs: `http://localhost:3002/**`
3. Desabilite "Enable email confirmations" se quiser (para desenvolvimento)

## 6. Testar a Aplicação

1. Execute o projeto:
   ```bash
   npm run dev
   ```

2. Acesse `http://localhost:3002`
3. Teste criar uma conta e fazer login
4. Teste criar boards, listas e cards

## 7. Estrutura do Banco de Dados

```
profiles
├── id (UUID, PK, FK -> auth.users)
├── email (TEXT)
├── full_name (TEXT)
├── avatar_url (TEXT)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

boards
├── id (UUID, PK)
├── title (TEXT)
├── description (TEXT)
├── owner_id (UUID, FK -> auth.users)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

lists
├── id (UUID, PK)
├── title (TEXT)
├── board_id (UUID, FK -> boards)
├── position (INTEGER)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

cards
├── id (UUID, PK)
├── title (TEXT)
├── description (TEXT)
├── list_id (UUID, FK -> lists)
├── position (INTEGER)
├── labels (TEXT[])
├── attachments (INTEGER)
├── comments (INTEGER)
├── checklist (JSONB)
├── due_date (TIMESTAMP)
├── assignee (TEXT)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

## 8. Verificar Configuração do Banco

Execute este SQL para verificar se tudo foi configurado corretamente:

```sql
-- Verificar se todas as tabelas foram criadas
SELECT 
  schemaname, 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE tablename IN ('profiles', 'boards', 'lists', 'cards')
ORDER BY tablename;

-- Verificar políticas criadas
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd
FROM pg_policies 
WHERE tablename IN ('profiles', 'boards', 'lists', 'cards')
ORDER BY tablename, policyname;

-- Verificar triggers
SELECT 
  trigger_name, 
  event_object_table, 
  action_timing, 
  event_manipulation
FROM information_schema.triggers 
WHERE event_object_table IN ('profiles', 'boards', 'lists', 'cards')
ORDER BY event_object_table, trigger_name;
```

## 9. Funcionalidades Implementadas

✅ **Autenticação**
- Login/Registro com email e senha
- Gerenciamento de perfil do usuário
- Logout seguro

✅ **Boards**
- Criar, editar e deletar boards
- Apenas o proprietário pode acessar seus boards
- Sistema de permissões com RLS

✅ **Listas**
- Criar, editar e deletar listas
- Posicionamento automático
- Vinculadas aos boards

✅ **Cards**
- Criar, editar e deletar cards
- Drag and drop entre listas
- Metadados (labels, attachments, etc.)
- Posicionamento automático

✅ **Segurança**
- Row Level Security (RLS) habilitado
- Políticas de acesso baseadas no usuário
- Dados isolados por usuário

✅ **Triggers**
- Atualização automática do campo `updated_at`
- Triggers configurados em todas as tabelas

## 10. Próximos Passos

Agora que o banco está configurado, você pode:

1. **Testar a aplicação** executando `npm run dev`
2. **Criar usuários** e testar o sistema de autenticação
3. **Implementar as funcionalidades** de boards, listas e cards
4. **Configurar o frontend** para consumir a API do Supabase

Agora sua aplicação está completamente integrada com o Supabase! 🚀


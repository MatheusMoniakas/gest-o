-- ============================================
-- SCRIPT PARA RECRIAR TODAS AS TABELAS COM RLS
-- ============================================
-- ATENÇÃO: Este script irá APAGAR todos os dados existentes!

-- 1. DROPAR TODAS AS TABELAS (em ordem reversa devido às foreign keys)
DROP TABLE IF EXISTS cards CASCADE;
DROP TABLE IF EXISTS lists CASCADE;
DROP TABLE IF EXISTS boards CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- 2. DROPAR FUNÇÃO DE TRIGGER SE EXISTIR
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- ============================================
-- 3. CRIAR TABELA PROFILES
-- ============================================
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

-- ============================================
-- 4. CRIAR TABELA BOARDS
-- ============================================
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

-- ============================================
-- 5. CRIAR TABELA LISTS
-- ============================================
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

-- ============================================
-- 6. CRIAR TABELA CARDS
-- ============================================
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

-- ============================================
-- 7. CRIAR FUNÇÃO E TRIGGERS PARA UPDATED_AT
-- ============================================
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

-- ============================================
-- 8. VERIFICAÇÃO FINAL
-- ============================================
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

-- ============================================
-- SCRIPT CONCLUÍDO!
-- ============================================
-- Todas as tabelas foram recriadas com RLS habilitado e políticas de segurança.
-- O banco está pronto para uso!

-- Script de configuração do banco de dados Supabase
-- Execute este script no SQL Editor do Supabase

-- 1. Criar tabela de perfis
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Políticas para perfis
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. Criar tabela de boards
CREATE TABLE IF NOT EXISTS boards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;

-- Políticas para boards
DROP POLICY IF EXISTS "Users can view own boards" ON boards;
CREATE POLICY "Users can view own boards" ON boards
  FOR SELECT USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can create boards" ON boards;
CREATE POLICY "Users can create boards" ON boards
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can update own boards" ON boards;
CREATE POLICY "Users can update own boards" ON boards
  FOR UPDATE USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can delete own boards" ON boards;
CREATE POLICY "Users can delete own boards" ON boards
  FOR DELETE USING (auth.uid() = owner_id);

-- 3. Criar tabela de listas
CREATE TABLE IF NOT EXISTS lists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  board_id UUID REFERENCES boards(id) ON DELETE CASCADE NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE lists ENABLE ROW LEVEL SECURITY;

-- Políticas para listas
DROP POLICY IF EXISTS "Users can view lists from own boards" ON lists;
CREATE POLICY "Users can view lists from own boards" ON lists
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM boards 
      WHERE boards.id = lists.board_id 
      AND boards.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can create lists in own boards" ON lists;
CREATE POLICY "Users can create lists in own boards" ON lists
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM boards 
      WHERE boards.id = lists.board_id 
      AND boards.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update lists from own boards" ON lists;
CREATE POLICY "Users can update lists from own boards" ON lists
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM boards 
      WHERE boards.id = lists.board_id 
      AND boards.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete lists from own boards" ON lists;
CREATE POLICY "Users can delete lists from own boards" ON lists
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM boards 
      WHERE boards.id = lists.board_id 
      AND boards.owner_id = auth.uid()
    )
  );

-- 4. Criar tabela de cards
CREATE TABLE IF NOT EXISTS cards (
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

-- Políticas para cards
DROP POLICY IF EXISTS "Users can view cards from own lists" ON cards;
CREATE POLICY "Users can view cards from own lists" ON cards
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM lists 
      JOIN boards ON boards.id = lists.board_id
      WHERE lists.id = cards.list_id 
      AND boards.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can create cards in own lists" ON cards;
CREATE POLICY "Users can create cards in own lists" ON cards
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM lists 
      JOIN boards ON boards.id = lists.board_id
      WHERE lists.id = cards.list_id 
      AND boards.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update cards from own lists" ON cards;
CREATE POLICY "Users can update cards from own lists" ON cards
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM lists 
      JOIN boards ON boards.id = lists.board_id
      WHERE lists.id = cards.list_id 
      AND boards.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete cards from own lists" ON cards;
CREATE POLICY "Users can delete cards from own lists" ON cards
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM lists 
      JOIN boards ON boards.id = lists.board_id
      WHERE lists.id = cards.list_id 
      AND boards.owner_id = auth.uid()
    )
  );

-- 5. Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Triggers para todas as tabelas
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_boards_updated_at ON boards;
CREATE TRIGGER update_boards_updated_at BEFORE UPDATE ON boards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_lists_updated_at ON lists;
CREATE TRIGGER update_lists_updated_at BEFORE UPDATE ON lists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cards_updated_at ON cards;
CREATE TRIGGER update_cards_updated_at BEFORE UPDATE ON cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Índices para performance
CREATE INDEX IF NOT EXISTS idx_boards_owner_id ON boards(owner_id);
CREATE INDEX IF NOT EXISTS idx_lists_board_id ON lists(board_id);
CREATE INDEX IF NOT EXISTS idx_cards_list_id ON cards(list_id);
CREATE INDEX IF NOT EXISTS idx_lists_position ON lists(position);
CREATE INDEX IF NOT EXISTS idx_cards_position ON cards(position);

-- 8. Configurar autenticação (opcional - para desenvolvimento)
-- Descomente as linhas abaixo se quiser desabilitar confirmação de email
-- UPDATE auth.config SET enable_signup = true;
-- UPDATE auth.config SET enable_email_confirmations = false;


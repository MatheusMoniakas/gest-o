import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

// Tipos
interface Label {
  id: string
  name: string
  color: string
}

interface Member {
  id: string
  name: string
  avatar: string
}

interface Comment {
  id: string
  text: string
  author: Member
  createdAt: string
}

interface Attachment {
  id: string
  name: string
  url: string
  size: number
}

interface Checklist {
  completed: number
  total: number
}

interface Card {
  id: string
  title: string
  description?: string
  labels?: Label[]
  members?: Member[]
  dueDate?: string
  comments?: Comment[]
  attachments?: Attachment[]
  assignee?: string
  checklist?: Checklist
  position: number
  list_id: string
  created_at: string
  updated_at: string
}

interface List {
  id: string
  title: string
  position: number
  board_id: string
  cards: Card[]
  created_at: string
  updated_at: string
}

interface Board {
  id: string
  title: string
  description?: string
  owner_id: string
  lists: List[]
  created_at: string
  updated_at: string
}

interface DataContextType {
  boards: Board[]
  currentBoard: Board | null
  loading: boolean
  error: string | null
  
  // Board operations
  createBoard: (title: string, description?: string) => Promise<{ data?: Board; error?: string }>
  updateBoard: (id: string, updates: { title?: string; description?: string }) => Promise<{ error?: string }>
  deleteBoard: (id: string) => Promise<{ error?: string }>
  setCurrentBoard: (board: Board | null) => void
  
  // List operations
  createList: (boardId: string, title: string) => Promise<{ data?: List; error?: string }>
  updateList: (id: string, updates: { title?: string; position?: number }) => Promise<{ error?: string }>
  deleteList: (id: string) => Promise<{ error?: string }>
  
  // Card operations
  createCard: (listId: string, title: string, description?: string) => Promise<{ data?: Card; error?: string }>
  updateCard: (id: string, updates: Partial<Card>) => Promise<{ error?: string }>
  deleteCard: (id: string) => Promise<{ error?: string }>
  moveCard: (cardId: string, fromListId: string, toListId: string, newPosition: number) => Promise<{ error?: string }>
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [boards, setBoards] = useState<Board[]>([])
  const [currentBoard, setCurrentBoard] = useState<Board | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Carregar boards do usuário
  useEffect(() => {
    if (!user) {
      setBoards([])
      setCurrentBoard(null)
      setLoading(false)
      return
    }

    loadBoards()
  }, [user])

  const loadBoards = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: boardsData, error: boardsError } = await supabase
        .from('boards')
        .select(`
          *,
          lists (
            *,
            cards (*)
          )
        `)
        .eq('owner_id', user!.id)
        .order('created_at', { ascending: false })

      if (boardsError) throw boardsError

      const formattedBoards = boardsData?.map(board => ({
        ...board,
        lists: board.lists?.map((list: any) => ({
          ...list,
          cards: list.cards || []
        })) || []
      })) || []

      setBoards(formattedBoards)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar boards')
    } finally {
      setLoading(false)
    }
  }

  // Board operations
  const createBoard = async (title: string, description?: string) => {
    try {
      if (!user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('boards')
        .insert({
          title,
          description,
          owner_id: user.id,
        })
        .select()
        .single()

      if (error) throw error

      const newBoard = { ...data, lists: [] }
      setBoards(prev => [newBoard, ...prev])
      setCurrentBoard(newBoard)

      return { data: newBoard }
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Erro ao criar board' }
    }
  }

  const updateBoard = async (id: string, updates: { title?: string; description?: string }) => {
    try {
      const { error } = await supabase
        .from('boards')
        .update(updates)
        .eq('id', id)

      if (error) throw error

      setBoards(prev => prev.map(board => 
        board.id === id ? { ...board, ...updates } : board
      ))

      if (currentBoard?.id === id) {
        setCurrentBoard(prev => prev ? { ...prev, ...updates } : null)
      }
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Erro ao atualizar board' }
    }
  }

  const deleteBoard = async (id: string) => {
    try {
      const { error } = await supabase
        .from('boards')
        .delete()
        .eq('id', id)

      if (error) throw error

      setBoards(prev => prev.filter(board => board.id !== id))
      
      if (currentBoard?.id === id) {
        setCurrentBoard(null)
      }
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Erro ao deletar board' }
    }
  }

  // List operations
  const createList = async (boardId: string, title: string) => {
    try {
      // Obter a próxima posição
      const { data: lists } = await supabase
        .from('lists')
        .select('position')
        .eq('board_id', boardId)
        .order('position', { ascending: false })
        .limit(1)

      const nextPosition = (lists?.[0]?.position || 0) + 1

      const { data, error } = await supabase
        .from('lists')
        .insert({
          title,
          board_id: boardId,
          position: nextPosition,
        })
        .select()
        .single()

      if (error) throw error

      const newList = { ...data, cards: [] }
      
      setBoards(prev => prev.map(board => 
        board.id === boardId 
          ? { ...board, lists: [...board.lists, newList] }
          : board
      ))

      if (currentBoard?.id === boardId) {
        setCurrentBoard(prev => prev ? { ...prev, lists: [...prev.lists, newList] } : null)
      }

      return { data: newList }
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Erro ao criar lista' }
    }
  }

  const updateList = async (id: string, updates: { title?: string; position?: number }) => {
    try {
      const { error } = await supabase
        .from('lists')
        .update(updates)
        .eq('id', id)

      if (error) throw error

      setBoards(prev => prev.map(board => ({
        ...board,
        lists: board.lists.map(list => 
          list.id === id ? { ...list, ...updates } : list
        )
      })))

      if (currentBoard) {
        setCurrentBoard(prev => prev ? {
          ...prev,
          lists: prev.lists.map(list => 
            list.id === id ? { ...list, ...updates } : list
          )
        } : null)
      }
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Erro ao atualizar lista' }
    }
  }

  const deleteList = async (id: string) => {
    try {
      const { error } = await supabase
        .from('lists')
        .delete()
        .eq('id', id)

      if (error) throw error

      setBoards(prev => prev.map(board => ({
        ...board,
        lists: board.lists.filter(list => list.id !== id)
      })))

      if (currentBoard) {
        setCurrentBoard(prev => prev ? {
          ...prev,
          lists: prev.lists.filter(list => list.id !== id)
        } : null)
      }
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Erro ao deletar lista' }
    }
  }

  // Card operations
  const createCard = async (listId: string, title: string, description?: string) => {
    try {
      // Obter a próxima posição
      const { data: cards } = await supabase
        .from('cards')
        .select('position')
        .eq('list_id', listId)
        .order('position', { ascending: false })
        .limit(1)

      const nextPosition = (cards?.[0]?.position || 0) + 1

      const { data, error } = await supabase
        .from('cards')
        .insert({
          title,
          description,
          list_id: listId,
          position: nextPosition,
          attachments: 0,
          comments: 0,
        })
        .select()
        .single()

      if (error) throw error

      const newCard = { ...data }
      
      setBoards(prev => prev.map(board => ({
        ...board,
        lists: board.lists.map(list => 
          list.id === listId 
            ? { ...list, cards: [...list.cards, newCard] }
            : list
        )
      })))

      if (currentBoard) {
        setCurrentBoard(prev => prev ? {
          ...prev,
          lists: prev.lists.map(list => 
            list.id === listId 
              ? { ...list, cards: [...list.cards, newCard] }
              : list
          )
        } : null)
      }

      return { data: newCard }
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Erro ao criar card' }
    }
  }

  const updateCard = async (id: string, updates: Partial<Card>) => {
    try {
      const { error } = await supabase
        .from('cards')
        .update(updates)
        .eq('id', id)

      if (error) throw error

      setBoards(prev => prev.map(board => ({
        ...board,
        lists: board.lists.map(list => ({
          ...list,
          cards: list.cards.map(card => 
            card.id === id ? { ...card, ...updates } : card
          )
        }))
      })))

      if (currentBoard) {
        setCurrentBoard(prev => prev ? {
          ...prev,
          lists: prev.lists.map(list => ({
            ...list,
            cards: list.cards.map(card => 
              card.id === id ? { ...card, ...updates } : card
            )
          }))
        } : null)
      }
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Erro ao atualizar card' }
    }
  }

  const deleteCard = async (id: string) => {
    try {
      const { error } = await supabase
        .from('cards')
        .delete()
        .eq('id', id)

      if (error) throw error

      setBoards(prev => prev.map(board => ({
        ...board,
        lists: board.lists.map(list => ({
          ...list,
          cards: list.cards.filter(card => card.id !== id)
        }))
      })))

      if (currentBoard) {
        setCurrentBoard(prev => prev ? {
          ...prev,
          lists: prev.lists.map(list => ({
            ...list,
            cards: list.cards.filter(card => card.id !== id)
          }))
        } : null)
      }
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Erro ao deletar card' }
    }
  }

  const moveCard = async (cardId: string, _fromListId: string, toListId: string, newPosition: number) => {
    try {
      // Atualizar posição do card
      const { error } = await supabase
        .from('cards')
        .update({ 
          list_id: toListId,
          position: newPosition 
        })
        .eq('id', cardId)

      if (error) throw error

      // Recarregar dados para sincronizar
      await loadBoards()
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Erro ao mover card' }
    }
  }

  const value = {
    boards,
    currentBoard,
    loading,
    error,
    createBoard,
    updateBoard,
    deleteBoard,
    setCurrentBoard,
    createList,
    updateList,
    deleteList,
    createCard,
    updateCard,
    deleteCard,
    moveCard,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}



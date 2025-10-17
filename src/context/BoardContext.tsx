import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Board, List, Card, BoardContextType, DragResult } from '../types';

// Estado inicial
const initialState = {
  boards: [] as Board[],
  currentBoard: null as Board | null,
};

// Tipos de ações
type BoardAction =
  | { type: 'ADD_BOARD'; payload: Board }
  | { type: 'UPDATE_BOARD'; payload: { id: string; updates: Partial<Board> } }
  | { type: 'DELETE_BOARD'; payload: string }
  | { type: 'SET_CURRENT_BOARD'; payload: Board | null }
  | { type: 'ADD_LIST'; payload: { boardId: string; list: List } }
  | { type: 'UPDATE_LIST'; payload: { listId: string; updates: Partial<List> } }
  | { type: 'DELETE_LIST'; payload: string }
  | { type: 'ADD_CARD'; payload: { listId: string; card: Card } }
  | { type: 'UPDATE_CARD'; payload: { cardId: string; updates: Partial<Card> } }
  | { type: 'DELETE_CARD'; payload: string }
  | { type: 'MOVE_CARD'; payload: DragResult }
  | { type: 'MOVE_LIST'; payload: DragResult };

// Reducer
function boardReducer(state: typeof initialState, action: BoardAction) {
  switch (action.type) {
    case 'ADD_BOARD':
      return {
        ...state,
        boards: [...state.boards, action.payload],
      };

    case 'UPDATE_BOARD':
      return {
        ...state,
        boards: state.boards.map(board =>
          board.id === action.payload.id
            ? { ...board, ...action.payload.updates, updatedAt: new Date() }
            : board
        ),
        currentBoard: state.currentBoard?.id === action.payload.id
          ? { ...state.currentBoard, ...action.payload.updates, updatedAt: new Date() }
          : state.currentBoard,
      };

    case 'DELETE_BOARD':
      return {
        ...state,
        boards: state.boards.filter(board => board.id !== action.payload),
        currentBoard: state.currentBoard?.id === action.payload ? null : state.currentBoard,
      };

    case 'SET_CURRENT_BOARD':
      return {
        ...state,
        currentBoard: action.payload,
      };

    case 'ADD_LIST':
      return {
        ...state,
        boards: state.boards.map(board =>
          board.id === action.payload.boardId
            ? { ...board, lists: [...board.lists, action.payload.list], updatedAt: new Date() }
            : board
        ),
        currentBoard: state.currentBoard?.id === action.payload.boardId
          ? { ...state.currentBoard, lists: [...state.currentBoard.lists, action.payload.list], updatedAt: new Date() }
          : state.currentBoard,
      };

    case 'UPDATE_LIST':
      return {
        ...state,
        boards: state.boards.map(board => ({
          ...board,
          lists: board.lists.map(list =>
            list.id === action.payload.listId
              ? { ...list, ...action.payload.updates, updatedAt: new Date() }
              : list
          ),
          updatedAt: new Date(),
        })),
        currentBoard: state.currentBoard ? {
          ...state.currentBoard,
          lists: state.currentBoard.lists.map(list =>
            list.id === action.payload.listId
              ? { ...list, ...action.payload.updates, updatedAt: new Date() }
              : list
          ),
          updatedAt: new Date(),
        } : null,
      };

    case 'DELETE_LIST':
      return {
        ...state,
        boards: state.boards.map(board => ({
          ...board,
          lists: board.lists.filter(list => list.id !== action.payload),
          updatedAt: new Date(),
        })),
        currentBoard: state.currentBoard ? {
          ...state.currentBoard,
          lists: state.currentBoard.lists.filter(list => list.id !== action.payload),
          updatedAt: new Date(),
        } : null,
      };

    case 'ADD_CARD':
      return {
        ...state,
        boards: state.boards.map(board => ({
          ...board,
          lists: board.lists.map(list =>
            list.id === action.payload.listId
              ? { ...list, cards: [...list.cards, action.payload.card], updatedAt: new Date() }
              : list
          ),
          updatedAt: new Date(),
        })),
        currentBoard: state.currentBoard ? {
          ...state.currentBoard,
          lists: state.currentBoard.lists.map(list =>
            list.id === action.payload.listId
              ? { ...list, cards: [...list.cards, action.payload.card], updatedAt: new Date() }
              : list
          ),
          updatedAt: new Date(),
        } : null,
      };

    case 'UPDATE_CARD':
      return {
        ...state,
        boards: state.boards.map(board => ({
          ...board,
          lists: board.lists.map(list => ({
            ...list,
            cards: list.cards.map(card =>
              card.id === action.payload.cardId
                ? { ...card, ...action.payload.updates, updatedAt: new Date() }
                : card
            ),
            updatedAt: new Date(),
          })),
          updatedAt: new Date(),
        })),
        currentBoard: state.currentBoard ? {
          ...state.currentBoard,
          lists: state.currentBoard.lists.map(list => ({
            ...list,
            cards: list.cards.map(card =>
              card.id === action.payload.cardId
                ? { ...card, ...action.payload.updates, updatedAt: new Date() }
                : card
            ),
            updatedAt: new Date(),
          })),
          updatedAt: new Date(),
        } : null,
      };

    case 'DELETE_CARD':
      return {
        ...state,
        boards: state.boards.map(board => ({
          ...board,
          lists: board.lists.map(list => ({
            ...list,
            cards: list.cards.filter(card => card.id !== action.payload),
            updatedAt: new Date(),
          })),
          updatedAt: new Date(),
        })),
        currentBoard: state.currentBoard ? {
          ...state.currentBoard,
          lists: state.currentBoard.lists.map(list => ({
            ...list,
            cards: list.cards.filter(card => card.id !== action.payload),
            updatedAt: new Date(),
          })),
          updatedAt: new Date(),
        } : null,
      };

    case 'MOVE_CARD':
      const { source, destination, draggableId } = action.payload;
      if (!destination) return state;

      const newState = { ...state };
      const sourceList = newState.currentBoard?.lists.find(list => list.id === source.droppableId);
      const destList = newState.currentBoard?.lists.find(list => list.id === destination.droppableId);

      if (sourceList && destList) {
        const card = sourceList.cards.find(c => c.id === draggableId);
        if (card) {
          // Remove da lista origem
          sourceList.cards = sourceList.cards.filter(c => c.id !== draggableId);
          
          // Adiciona na lista destino
          destList.cards.splice(destination.index, 0, {
            ...card,
            listId: destination.droppableId,
            updatedAt: new Date(),
          });

          // Atualiza posições
          sourceList.cards.forEach((c, index) => {
            c.position = index;
          });
          destList.cards.forEach((c, index) => {
            c.position = index;
          });
        }
      }

      return newState;

    case 'MOVE_LIST':
      const { source: listSource, destination: listDest, draggableId: listId } = action.payload;
      if (!listDest) return state;

      const newListState = { ...state };
      if (newListState.currentBoard) {
        const lists = [...newListState.currentBoard.lists];
        const [movedList] = lists.splice(listSource.index, 1);
        lists.splice(listDest.index, 0, movedList);

        // Atualiza posições
        lists.forEach((list, index) => {
          list.position = index;
        });

        newListState.currentBoard.lists = lists;
      }

      return newListState;

    default:
      return state;
  }
}

// Context
const BoardContext = createContext<BoardContextType | undefined>(undefined);

// Provider
export function BoardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(boardReducer, initialState);

  const addBoard = (title: string, description?: string) => {
    const newBoard: Board = {
      id: Date.now().toString(),
      title,
      description,
      lists: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_BOARD', payload: newBoard });
  };

  const updateBoard = (id: string, updates: Partial<Board>) => {
    dispatch({ type: 'UPDATE_BOARD', payload: { id, updates } });
  };

  const deleteBoard = (id: string) => {
    dispatch({ type: 'DELETE_BOARD', payload: id });
  };

  const setCurrentBoard = (board: Board | null) => {
    dispatch({ type: 'SET_CURRENT_BOARD', payload: board });
  };

  const addList = (boardId: string, title: string) => {
    const newList: List = {
      id: Date.now().toString(),
      title,
      boardId,
      position: state.currentBoard?.lists.length || 0,
      cards: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_LIST', payload: { boardId, list: newList } });
  };

  const updateList = (listId: string, updates: Partial<List>) => {
    dispatch({ type: 'UPDATE_LIST', payload: { listId, updates } });
  };

  const deleteList = (listId: string) => {
    dispatch({ type: 'DELETE_LIST', payload: listId });
  };

  const addCard = (listId: string, title: string, description?: string) => {
    const newCard: Card = {
      id: Date.now().toString(),
      title,
      description,
      listId,
      position: state.currentBoard?.lists.find(l => l.id === listId)?.cards.length || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_CARD', payload: { listId, card: newCard } });
  };

  const updateCard = (cardId: string, updates: Partial<Card>) => {
    dispatch({ type: 'UPDATE_CARD', payload: { cardId, updates } });
  };

  const deleteCard = (cardId: string) => {
    dispatch({ type: 'DELETE_CARD', payload: cardId });
  };

  const moveCard = (result: DragResult) => {
    dispatch({ type: 'MOVE_CARD', payload: result });
  };

  const moveList = (result: DragResult) => {
    dispatch({ type: 'MOVE_LIST', payload: result });
  };

  const value: BoardContextType = {
    boards: state.boards,
    currentBoard: state.currentBoard,
    addBoard,
    updateBoard,
    deleteBoard,
    setCurrentBoard,
    addList,
    updateList,
    deleteList,
    addCard,
    updateCard,
    deleteCard,
    moveCard,
    moveList,
  };

  return (
    <BoardContext.Provider value={value}>
      {children}
    </BoardContext.Provider>
  );
}

// Hook
export function useBoard() {
  const context = useContext(BoardContext);
  if (context === undefined) {
    throw new Error('useBoard must be used within a BoardProvider');
  }
  return context;
}

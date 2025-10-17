export interface Card {
  id: string;
  title: string;
  description?: string;
  listId: string;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface List {
  id: string;
  title: string;
  boardId: string;
  position: number;
  cards: Card[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Board {
  id: string;
  title: string;
  description?: string;
  lists: List[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DragResult {
  draggableId: string;
  type: string;
  source: {
    droppableId: string;
    index: number;
  };
  destination?: {
    droppableId: string;
    index: number;
  };
}

export interface BoardContextType {
  boards: Board[];
  currentBoard: Board | null;
  addBoard: (title: string, description?: string) => void;
  updateBoard: (id: string, updates: Partial<Board>) => void;
  deleteBoard: (id: string) => void;
  setCurrentBoard: (board: Board | null) => void;
  addList: (boardId: string, title: string) => void;
  updateList: (listId: string, updates: Partial<List>) => void;
  deleteList: (listId: string) => void;
  addCard: (listId: string, title: string, description?: string) => void;
  updateCard: (cardId: string, updates: Partial<Card>) => void;
  deleteCard: (cardId: string) => void;
  moveCard: (result: DragResult) => void;
  moveList: (result: DragResult) => void;
}

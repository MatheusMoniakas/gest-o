export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  initials: string;
}

export interface Comment {
  id: string;
  text: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'file';
  size: number;
  uploadedAt: Date;
}

export interface Card {
  id: string;
  title: string;
  description?: string;
  listId: string;
  position: number;
  labels: Label[];
  members: Member[];
  dueDate?: Date | null;
  isCompleted: boolean;
  comments: Comment[];
  attachments: Attachment[];
  coverColor?: string | null;
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
  addLabelToCard: (cardId: string, label: Label) => void;
  removeLabelFromCard: (cardId: string, labelId: string) => void;
  addMemberToCard: (cardId: string, member: Member) => void;
  removeMemberFromCard: (cardId: string, memberId: string) => void;
  setCardDueDate: (cardId: string, dueDate: Date | null) => void;
  toggleCardCompletion: (cardId: string) => void;
  addComment: (cardId: string, comment: Comment) => void;
  deleteComment: (cardId: string, commentId: string) => void;
  addAttachment: (cardId: string, attachment: Attachment) => void;
  deleteAttachment: (cardId: string, attachmentId: string) => void;
  setCardCover: (cardId: string, color: string | null) => void;
}

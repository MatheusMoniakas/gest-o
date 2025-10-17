import React, { useState } from 'react';
import { useBoard } from '../context/BoardContext';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';

export function BoardSelector() {
  const { boards, currentBoard, addBoard, setCurrentBoard, deleteBoard } = useBoard();
  const [isAddingBoard, setIsAddingBoard] = useState(false);
  const [isEditingBoard, setIsEditingBoard] = useState<string | null>(null);
  const [boardTitle, setBoardTitle] = useState('');
  const [boardDescription, setBoardDescription] = useState('');
  const [editingTitle, setEditingTitle] = useState('');
  const [editingDescription, setEditingDescription] = useState('');

  const handleAddBoard = () => {
    if (boardTitle.trim()) {
      addBoard(boardTitle.trim(), boardDescription.trim() || undefined);
      setBoardTitle('');
      setBoardDescription('');
      setIsAddingBoard(false);
    }
  };

  const handleCancelAddBoard = () => {
    setBoardTitle('');
    setBoardDescription('');
    setIsAddingBoard(false);
  };

  const handleEditBoard = (boardId: string) => {
    const board = boards.find(b => b.id === boardId);
    if (board) {
      setEditingTitle(board.title);
      setEditingDescription(board.description || '');
      setIsEditingBoard(boardId);
    }
  };

  const handleSaveEdit = () => {
    if (editingTitle.trim() && isEditingBoard) {
      // Aqui você implementaria a função updateBoard se necessário
      setIsEditingBoard(null);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingBoard(null);
    setEditingTitle('');
    setEditingDescription('');
  };

  const handleDeleteBoard = (boardId: string, boardTitle: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o board "${boardTitle}"?`)) {
      deleteBoard(boardId);
    }
  };

  return (
    <div className="board-selector">
      <div className="board-selector-header">
        <h2>Meus Boards</h2>
        <button
          onClick={() => setIsAddingBoard(true)}
          className="btn-add-board"
        >
          <Plus size={16} />
          Novo Board
        </button>
      </div>

      <div className="boards-grid">
        {boards.map((board) => (
          <div
            key={board.id}
            className={`board-item ${currentBoard?.id === board.id ? 'active' : ''}`}
            onClick={() => setCurrentBoard(board)}
          >
            {isEditingBoard === board.id ? (
              <div className="board-edit-form">
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  className="board-title-input"
                  autoFocus
                />
                <textarea
                  value={editingDescription}
                  onChange={(e) => setEditingDescription(e.target.value)}
                  className="board-description-input"
                  placeholder="Descrição (opcional)"
                  rows={2}
                />
                <div className="board-edit-actions">
                  <button onClick={handleSaveEdit} className="btn-save">
                    <Check size={14} />
                  </button>
                  <button onClick={handleCancelEdit} className="btn-cancel">
                    <X size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="board-item-content">
                  <h3 className="board-item-title">{board.title}</h3>
                  {board.description && (
                    <p className="board-item-description">{board.description}</p>
                  )}
                  <div className="board-item-stats">
                    <span>{board.lists.length} listas</span>
                    <span>{board.lists.reduce((acc, list) => acc + list.cards.length, 0)} cards</span>
                  </div>
                </div>
                <div className="board-item-actions">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditBoard(board.id);
                    }}
                    className="btn-edit"
                    title="Editar board"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteBoard(board.id, board.title);
                    }}
                    className="btn-delete"
                    title="Excluir board"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}

        {isAddingBoard && (
          <div className="add-board-form">
            <input
              type="text"
              value={boardTitle}
              onChange={(e) => setBoardTitle(e.target.value)}
              className="board-title-input"
              placeholder="Título do board"
              autoFocus
            />
            <textarea
              value={boardDescription}
              onChange={(e) => setBoardDescription(e.target.value)}
              className="board-description-input"
              placeholder="Descrição (opcional)"
              rows={2}
            />
            <div className="add-board-actions">
              <button onClick={handleAddBoard} className="btn-add">
                Criar Board
              </button>
              <button onClick={handleCancelAddBoard} className="btn-cancel">
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

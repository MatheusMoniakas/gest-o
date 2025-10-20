import { useState } from 'react';
import { X, Plus } from 'lucide-react';

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBoard: (title: string, description?: string) => void;
}

export function CreateBoardModal({ isOpen, onClose, onCreateBoard }: CreateBoardModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onCreateBoard(title.trim(), description.trim() || undefined);
      setTitle('');
      setDescription('');
      onClose();
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Criar Novo Board</h2>
          <button onClick={handleClose} className="modal-close-btn">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="board-title">Nome do Board *</label>
            <input
              id="board-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Projeto Web App"
              className="form-input"
              autoFocus
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="board-description">Descrição (opcional)</label>
            <textarea
              id="board-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o propósito deste board..."
              className="form-textarea"
              rows={3}
            />
          </div>
          
          <div className="modal-actions">
            <button type="button" onClick={handleClose} className="btn-cancel">
              Cancelar
            </button>
            <button type="submit" className="btn-create">
              <Plus size={16} />
              Criar Board
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

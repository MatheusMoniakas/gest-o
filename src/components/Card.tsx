import React, { useState } from 'react';
import { Card as CardType } from '../types';
import { useBoard } from '../context/BoardContext';
import { Edit2, Trash2, X, Check } from 'lucide-react';

interface CardProps {
  card: CardType;
}

export function Card({ card }: CardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const { updateCard, deleteCard } = useBoard();

  const handleSave = () => {
    updateCard(card.id, { title, description });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(card.title);
    setDescription(card.description || '');
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir este card?')) {
      deleteCard(card.id);
    }
  };

  if (isEditing) {
    return (
      <div className="card editing">
        <div className="card-content">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="card-title-input"
            placeholder="Título do card"
            autoFocus
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="card-description-input"
            placeholder="Descrição (opcional)"
            rows={3}
          />
        </div>
        <div className="card-actions">
          <button onClick={handleSave} className="btn-save" title="Salvar">
            <Check size={16} />
          </button>
          <button onClick={handleCancel} className="btn-cancel" title="Cancelar">
            <X size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-content">
        <h4 className="card-title">{card.title}</h4>
        {card.description && (
          <p className="card-description">{card.description}</p>
        )}
      </div>
      <div className="card-actions">
        <button onClick={() => setIsEditing(true)} className="btn-edit" title="Editar">
          <Edit2 size={14} />
        </button>
        <button onClick={handleDelete} className="btn-delete" title="Excluir">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

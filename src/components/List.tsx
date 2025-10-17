import React, { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { List as ListType } from '../types';
import { useBoard } from '../context/BoardContext';
import { Card } from './Card';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';

interface ListProps {
  list: ListType;
  index: number;
}

export function List({ list, index }: ListProps) {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [cardTitle, setCardTitle] = useState('');
  const [cardDescription, setCardDescription] = useState('');
  const [listTitle, setListTitle] = useState(list.title);
  const { addCard, updateList, deleteList } = useBoard();

  const handleAddCard = () => {
    if (cardTitle.trim()) {
      addCard(list.id, cardTitle.trim(), cardDescription.trim() || undefined);
      setCardTitle('');
      setCardDescription('');
      setIsAddingCard(false);
    }
  };

  const handleCancelAddCard = () => {
    setCardTitle('');
    setCardDescription('');
    setIsAddingCard(false);
  };

  const handleSaveTitle = () => {
    if (listTitle.trim()) {
      updateList(list.id, { title: listTitle.trim() });
      setIsEditingTitle(false);
    }
  };

  const handleCancelEditTitle = () => {
    setListTitle(list.title);
    setIsEditingTitle(false);
  };

  const handleDeleteList = () => {
    if (window.confirm('Tem certeza que deseja excluir esta lista? Todos os cards serão removidos.')) {
      deleteList(list.id);
    }
  };

  return (
    <Draggable draggableId={list.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`list ${snapshot.isDragging ? 'dragging' : ''}`}
        >
          <div className="list-header" {...provided.dragHandleProps}>
            {isEditingTitle ? (
              <div className="list-title-edit">
                <input
                  type="text"
                  value={listTitle}
                  onChange={(e) => setListTitle(e.target.value)}
                  className="list-title-input"
                  autoFocus
                />
                <div className="list-title-actions">
                  <button onClick={handleSaveTitle} className="btn-save" title="Salvar">
                    <Check size={14} />
                  </button>
                  <button onClick={handleCancelEditTitle} className="btn-cancel" title="Cancelar">
                    <X size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="list-title-container">
                <h3 className="list-title">{list.title}</h3>
                <div className="list-actions">
                  <button onClick={() => setIsEditingTitle(true)} className="btn-edit" title="Editar título">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={handleDeleteList} className="btn-delete" title="Excluir lista">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>

          <Droppable droppableId={list.id} type="CARD">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`list-content ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
              >
                {list.cards.map((card, cardIndex) => (
                  <Draggable key={card.id} draggableId={card.id} index={cardIndex}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`card-container ${snapshot.isDragging ? 'dragging' : ''}`}
                      >
                        <Card card={card} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}

                {isAddingCard ? (
                  <div className="add-card-form">
                    <input
                      type="text"
                      value={cardTitle}
                      onChange={(e) => setCardTitle(e.target.value)}
                      className="card-title-input"
                      placeholder="Título do card"
                      autoFocus
                    />
                    <textarea
                      value={cardDescription}
                      onChange={(e) => setCardDescription(e.target.value)}
                      className="card-description-input"
                      placeholder="Descrição (opcional)"
                      rows={2}
                    />
                    <div className="add-card-actions">
                      <button onClick={handleAddCard} className="btn-add">
                        Adicionar Card
                      </button>
                      <button onClick={handleCancelAddCard} className="btn-cancel">
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAddingCard(true)}
                    className="add-card-btn"
                  >
                    <Plus size={16} />
                    Adicionar um card
                  </button>
                )}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}

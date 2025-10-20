import { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { List as ListType } from '../types';
import { useData } from '../context/DataContext';
import { Card } from './Card';
import { Plus, MoreHorizontal } from 'lucide-react';

interface ListProps {
  list: ListType;
  index: number;
}

export function List({ list, index }: ListProps) {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [cardTitle, setCardTitle] = useState('');
  const { createCard, moveCard } = useData();

  const handleAddCard = async () => {
    if (cardTitle.trim()) {
      const { error } = await createCard(list.id, cardTitle.trim());
      if (!error) {
        setCardTitle('');
        setIsAddingCard(false);
      }
    }
  };

  const handleCancelAddCard = () => {
    setCardTitle('');
    setIsAddingCard(false);
  };

  const handleDragStart = (cardId: string) => {
    // Adicionar classe de drag ativo na lista
    const listElement = document.querySelector(`[data-list-id="${list.id}"]`);
    listElement?.classList.add('drag-active');
  };

  const handleDragEnd = (cardId: string, targetListId?: string) => {
    // Remover classe de drag ativo
    const listElement = document.querySelector(`[data-list-id="${list.id}"]`);
    listElement?.classList.remove('drag-active');
    
    if (targetListId && targetListId !== list.id) {
      // Mover card para outra lista
      moveCard({
        draggableId: cardId,
        source: { droppableId: list.id, index: 0 },
        destination: { droppableId: targetListId, index: 0 }
      });
    }
  };

  return (
    <Draggable draggableId={list.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`list ${snapshot.isDragging ? 'dragging' : ''}`}
          data-list-id={list.id}
        >
          <div className="list-header" {...provided.dragHandleProps}>
            <div className="list-title-container">
              <h3 className="list-title">{list.title}</h3>
              <button className="list-action" title="Mais opções">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>

          <div
            className="list-content"
            data-list-id={list.id}
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add('drag-over');
            }}
            onDragLeave={(e) => {
              e.currentTarget.classList.remove('drag-over');
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove('drag-over');
              
              const cardId = e.dataTransfer.getData('text/plain');
              if (cardId && cardId !== list.id) {
                // Mover card para esta lista
                moveCard({
                  draggableId: cardId,
                  source: { droppableId: '', index: 0 },
                  destination: { droppableId: list.id, index: 0 }
                });
              }
            }}
          >
                {list.cards.map((card, cardIndex) => (
                  <div
                    key={card.id}
                    className="card-container"
                  >
                    <Card 
                      card={card} 
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                    />
                  </div>
                ))}

                {isAddingCard ? (
                  <div className="add-card-form">
                    <input
                      type="text"
                      value={cardTitle}
                      onChange={(e) => setCardTitle(e.target.value)}
                      className="add-card-input"
                      placeholder="Título do card"
                      autoFocus
                    />
                    <div className="add-card-actions">
                      <button onClick={handleAddCard} className="add-card-btn-primary">
                        Adicionar Card
                      </button>
                      <button onClick={handleCancelAddCard} className="add-card-btn-secondary">
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
        </div>
      )}
    </Draggable>
  );
}

import { useState, useRef, useCallback } from 'react';
import { Card as CardType } from '../types';
import { Paperclip, MessageSquare, CheckSquare, Calendar, User } from 'lucide-react';

interface CardProps {
  card: CardType;
  onDragStart?: (cardId: string) => void;
  onDragEnd?: (cardId: string, targetListId?: string) => void;
}

export function Card({ card, onDragStart, onDragEnd }: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDragStart = useCallback((e: React.DragEvent) => {
    if (!cardRef.current) return;
    
    // Configurar a imagem de drag para ser o próprio card
    const dragImage = cardRef.current.cloneNode(true) as HTMLElement;
    dragImage.style.transform = 'rotate(2deg) scale(1.05)';
    dragImage.style.opacity = '0.8';
    dragImage.style.pointerEvents = 'none';
    dragImage.style.position = 'fixed';
    dragImage.style.top = '-1000px';
    dragImage.style.left = '-1000px';
    dragImage.style.zIndex = '9999';
    
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    
    // Limpar a imagem após um tempo
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
    
    // Armazenar dados do drag
    e.dataTransfer.setData('text/plain', card.id);
    e.dataTransfer.effectAllowed = 'move';
    
    onDragStart?.(card.id);
  }, [card.id, onDragStart]);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    // Encontrar a lista de destino
    const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
    const targetList = elementBelow?.closest('[data-list-id]');
    const targetListId = targetList?.getAttribute('data-list-id');
    
    onDragEnd?.(card.id, targetListId || undefined);
  }, [card.id, onDragEnd]);

  return (
    <div 
      ref={cardRef}
      className="card"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{
        cursor: 'grab'
      }}
    >
      {/* Labels coloridos */}
      {card.labels && card.labels.length > 0 && (
        <div className="card-labels">
          {card.labels.map((label, index) => (
            <div key={index} className={`card-label ${label.color}`}></div>
          ))}
        </div>
      )}
      
      <div className="card-content">
        <h4 className="card-title">{card.title}</h4>
        
        {card.description && (
          <p className="card-description">{card.description}</p>
        )}
        
        <div className="card-meta">
          {card.attachments && card.attachments > 0 && (
            <div className="card-attachment">
              <Paperclip size={12} />
              <span>{card.attachments}</span>
            </div>
          )}
          
          {card.comments && card.comments > 0 && (
            <div className="card-comments">
              <MessageSquare size={12} />
              <span>{card.comments}</span>
            </div>
          )}
          
          {card.checklist && (
            <div className="card-checklist">
              <CheckSquare size={12} />
              <span>{card.checklist.completed}/{card.checklist.total}</span>
            </div>
          )}
          
          {card.dueDate && (
            <div className="card-due-date">
              <Calendar size={12} />
              <span>{new Date(card.dueDate).toLocaleDateString()}</span>
            </div>
          )}
          
          {card.assignee && (
            <div className="card-assignee">
              <User size={12} />
              <span>{card.assignee}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

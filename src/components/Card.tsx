import { useState } from 'react';
import { Card as CardType, Label, Member, Comment } from '../types';
import { useBoard } from '../context/BoardContext';
import { 
  Edit2, 
  Trash2, 
  X, 
  Check, 
  Calendar, 
  User, 
  MessageSquare, 
  Paperclip, 
  Tag,
  MoreHorizontal,
  CheckCircle,
  Circle
} from 'lucide-react';

interface CardProps {
  card: CardType;
}

// Cores predefinidas para etiquetas
const LABEL_COLORS = [
  '#61bd4f', '#f2d600', '#ff9f1a', '#eb5a46',
  '#c377e0', '#0079bf', '#00c2e0', '#51e898',
  '#ff78cb', '#344563'
];

// Membros mock para demonstração
const MOCK_MEMBERS: Member[] = [
  { id: '1', name: 'João Silva', email: 'joao@email.com', initials: 'JS' },
  { id: '2', name: 'Maria Santos', email: 'maria@email.com', initials: 'MS' },
  { id: '3', name: 'Pedro Costa', email: 'pedro@email.com', initials: 'PC' },
];

export function Card({ card }: CardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const [newComment, setNewComment] = useState('');
  const [showLabelMenu, setShowLabelMenu] = useState(false);
  const [showMemberMenu, setShowMemberMenu] = useState(false);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  
  const { 
    updateCard, 
    deleteCard, 
    toggleCardCompletion,
    addComment,
    deleteComment,
    addLabelToCard,
    removeLabelFromCard,
    addMemberToCard,
    removeMemberFromCard,
    setCardDueDate
  } = useBoard();

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

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        text: newComment.trim(),
        authorId: 'current-user',
        authorName: 'Você',
        createdAt: new Date(),
      };
      addComment(card.id, comment);
      setNewComment('');
    }
  };

  const handleAddLabel = (color: string) => {
    const label: Label = {
      id: Date.now().toString(),
      name: `Etiqueta ${color}`,
      color,
    };
    addLabelToCard(card.id, label);
    setShowLabelMenu(false);
  };

  const handleAddMember = (member: Member) => {
    addMemberToCard(card.id, member);
    setShowMemberMenu(false);
  };

  const handleSetDueDate = (date: string) => {
    setCardDueDate(card.id, new Date(date));
    setShowDueDatePicker(false);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const isOverdue = card.dueDate && new Date() > card.dueDate && !card.isCompleted;

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
    <>
      <div className={`card ${card.isCompleted ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}>
        {card.coverColor && (
          <div 
            className="card-cover" 
            style={{ backgroundColor: card.coverColor }}
          />
        )}
        
        <div className="card-content">
          <div className="card-header">
            <h4 className="card-title">{card.title}</h4>
            <button 
              onClick={() => toggleCardCompletion(card.id)}
              className="completion-btn"
              title={card.isCompleted ? 'Marcar como não concluído' : 'Marcar como concluído'}
            >
              {card.isCompleted ? <CheckCircle size={16} /> : <Circle size={16} />}
            </button>
          </div>
          
          {card.description && (
            <p className="card-description">{card.description}</p>
          )}

          {card.labels.length > 0 && (
            <div className="card-labels">
              {card.labels.map(label => (
                <span
                  key={label.id}
                  className="label"
                  style={{ backgroundColor: label.color }}
                  title={label.name}
                />
              ))}
            </div>
          )}

          <div className="card-meta">
            {card.dueDate && (
              <div className={`due-date ${isOverdue ? 'overdue' : ''}`}>
                <Calendar size={12} />
                <span>{formatDate(card.dueDate)}</span>
              </div>
            )}
            
            {card.members.length > 0 && (
              <div className="card-members">
                {card.members.slice(0, 3).map(member => (
                  <div key={member.id} className="member-avatar" title={member.name}>
                    {member.initials}
                  </div>
                ))}
                {card.members.length > 3 && (
                  <div className="member-avatar more">
                    +{card.members.length - 3}
                  </div>
                )}
              </div>
            )}

            <div className="card-stats">
              {card.comments.length > 0 && (
                <div className="stat">
                  <MessageSquare size={12} />
                  <span>{card.comments.length}</span>
                </div>
              )}
              {card.attachments.length > 0 && (
                <div className="stat">
                  <Paperclip size={12} />
                  <span>{card.attachments.length}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="card-actions">
          <button onClick={() => setIsEditing(true)} className="btn-edit" title="Editar">
            <Edit2 size={14} />
          </button>
          <button onClick={() => setShowDetails(true)} className="btn-details" title="Ver detalhes">
            <MoreHorizontal size={14} />
          </button>
          <button onClick={handleDelete} className="btn-delete" title="Excluir">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {showDetails && (
        <div className="card-details-modal">
          <div className="modal-overlay" onClick={() => setShowDetails(false)} />
          <div className="modal-content">
            <div className="modal-header">
              <h3>Detalhes do Card</h3>
              <button onClick={() => setShowDetails(false)} className="btn-close">
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="detail-section">
                <h4>Ações</h4>
                <div className="action-buttons">
                  <button 
                    onClick={() => setShowLabelMenu(!showLabelMenu)}
                    className="action-btn"
                  >
                    <Tag size={16} />
                    Etiquetas
                  </button>
                  <button 
                    onClick={() => setShowMemberMenu(!showMemberMenu)}
                    className="action-btn"
                  >
                    <User size={16} />
                    Membros
                  </button>
                  <button 
                    onClick={() => setShowDueDatePicker(!showDueDatePicker)}
                    className="action-btn"
                  >
                    <Calendar size={16} />
                    Data de Vencimento
                  </button>
                </div>

                {showLabelMenu && (
                  <div className="label-menu">
                    <h5>Adicionar Etiqueta</h5>
                    <div className="label-colors">
                      {LABEL_COLORS.map(color => (
                        <button
                          key={color}
                          className="label-color-btn"
                          style={{ backgroundColor: color }}
                          onClick={() => handleAddLabel(color)}
                          title={`Adicionar etiqueta ${color}`}
                        />
                      ))}
                    </div>
                    <div className="current-labels">
                      <h6>Etiquetas Atuais:</h6>
                      {card.labels.map(label => (
                        <div key={label.id} className="current-label">
                          <span 
                            className="label-color" 
                            style={{ backgroundColor: label.color }}
                          />
                          <span>{label.name}</span>
                          <button 
                            onClick={() => removeLabelFromCard(card.id, label.id)}
                            className="remove-label"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {showMemberMenu && (
                  <div className="member-menu">
                    <h5>Adicionar Membro</h5>
                    {MOCK_MEMBERS.filter(member => 
                      !card.members.some(cardMember => cardMember.id === member.id)
                    ).map(member => (
                      <button
                        key={member.id}
                        className="member-option"
                        onClick={() => handleAddMember(member)}
                      >
                        <div className="member-avatar">{member.initials}</div>
                        <span>{member.name}</span>
                      </button>
                    ))}
                    <div className="current-members">
                      <h6>Membros Atuais:</h6>
                      {card.members.map(member => (
                        <div key={member.id} className="current-member">
                          <div className="member-avatar">{member.initials}</div>
                          <span>{member.name}</span>
                          <button 
                            onClick={() => removeMemberFromCard(card.id, member.id)}
                            className="remove-member"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {showDueDatePicker && (
                  <div className="due-date-picker">
                    <h5>Definir Data de Vencimento</h5>
                    <input
                      type="date"
                      value={card.dueDate ? card.dueDate.toISOString().split('T')[0] : ''}
                      onChange={(e) => handleSetDueDate(e.target.value)}
                      className="date-input"
                    />
                    {card.dueDate && (
                      <button 
                        onClick={() => setCardDueDate(card.id, null)}
                        className="remove-due-date"
                      >
                        Remover data
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="detail-section">
                <h4>Comentários ({card.comments.length})</h4>
                <div className="comments">
                  {card.comments.map(comment => (
                    <div key={comment.id} className="comment">
                      <div className="comment-header">
                        <strong>{comment.authorName}</strong>
                        <span className="comment-date">
                          {formatDate(comment.createdAt)}
                        </span>
                        <button 
                          onClick={() => deleteComment(card.id, comment.id)}
                          className="delete-comment"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                      <p>{comment.text}</p>
                    </div>
                  ))}
                </div>
                <div className="add-comment">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Adicionar comentário..."
                    className="comment-input"
                    rows={2}
                  />
                  <button onClick={handleAddComment} className="btn-add-comment">
                    Comentar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

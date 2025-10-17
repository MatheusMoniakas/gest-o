import { useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { useBoard } from '../context/BoardContext';
import { List } from './List';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';

export function Board() {
  const { currentBoard, addList, updateBoard, deleteBoard, moveCard, moveList } = useBoard();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isAddingList, setIsAddingList] = useState(false);
  const [boardTitle, setBoardTitle] = useState(currentBoard?.title || '');
  const [boardDescription, setBoardDescription] = useState(currentBoard?.description || '');
  const [listTitle, setListTitle] = useState('');

  if (!currentBoard) {
    return (
      <div className="no-board">
        <h2>Nenhum board selecionado</h2>
        <p>Selecione um board existente ou crie um novo.</p>
      </div>
    );
  }

  const handleDragEnd = (result: any) => {
    const { destination, source, type } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    if (type === 'LIST') {
      moveList(result);
    } else {
      moveCard(result);
    }
  };

  const handleAddList = () => {
    if (listTitle.trim()) {
      addList(currentBoard.id, listTitle.trim());
      setListTitle('');
      setIsAddingList(false);
    }
  };

  const handleCancelAddList = () => {
    setListTitle('');
    setIsAddingList(false);
  };

  const handleSaveBoard = () => {
    if (boardTitle.trim()) {
      updateBoard(currentBoard.id, { 
        title: boardTitle.trim(), 
        description: boardDescription.trim() || undefined 
      });
      setIsEditingTitle(false);
    }
  };

  const handleCancelEditBoard = () => {
    setBoardTitle(currentBoard.title);
    setBoardDescription(currentBoard.description || '');
    setIsEditingTitle(false);
  };

  const handleDeleteBoard = () => {
    if (window.confirm('Tem certeza que deseja excluir este board? Todas as listas e cards serão removidos.')) {
      deleteBoard(currentBoard.id);
    }
  };

  return (
    <div className="board">
      <div className="board-header">
        {isEditingTitle ? (
          <div className="board-title-edit">
            <input
              type="text"
              value={boardTitle}
              onChange={(e) => setBoardTitle(e.target.value)}
              className="board-title-input"
              autoFocus
            />
            <textarea
              value={boardDescription}
              onChange={(e) => setBoardDescription(e.target.value)}
              className="board-description-input"
              placeholder="Descrição do board (opcional)"
              rows={2}
            />
            <div className="board-title-actions">
              <button onClick={handleSaveBoard} className="btn-save">
                <Check size={16} />
                Salvar
              </button>
              <button onClick={handleCancelEditBoard} className="btn-cancel">
                <X size={16} />
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="board-title-container">
            <div className="board-title-info">
              <h1 className="board-title">{currentBoard.title}</h1>
              {currentBoard.description && (
                <p className="board-description">{currentBoard.description}</p>
              )}
            </div>
            <div className="board-actions">
              <button onClick={() => setIsEditingTitle(true)} className="btn-edit" title="Editar board">
                <Edit2 size={16} />
              </button>
              <button onClick={handleDeleteBoard} className="btn-delete" title="Excluir board">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="board" type="LIST" direction="horizontal">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`board-content ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
            >
              {currentBoard.lists.map((list, index) => (
                <List key={list.id} list={list} index={index} />
              ))}
              {provided.placeholder}

              {isAddingList ? (
                <div className="add-list-form">
                  <input
                    type="text"
                    value={listTitle}
                    onChange={(e) => setListTitle(e.target.value)}
                    className="list-title-input"
                    placeholder="Título da lista"
                    autoFocus
                  />
                  <div className="add-list-actions">
                    <button onClick={handleAddList} className="btn-add">
                      Adicionar Lista
                    </button>
                    <button onClick={handleCancelAddList} className="btn-cancel">
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsAddingList(true)}
                  className="add-list-btn"
                >
                  <Plus size={16} />
                  Adicionar uma lista
                </button>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

import { useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { useData } from '../context/DataContext';
import { List } from './List';
import { CreateBoardModal } from './CreateBoardModal';
import { Plus } from 'lucide-react';

export function Board() {
  const { currentBoard, boards, createBoard, createList, setCurrentBoard, loading } = useData();
  const [isAddingList, setIsAddingList] = useState(false);
  const [listTitle, setListTitle] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateBoard = async (title: string, description?: string) => {
    const { data, error } = await createBoard(title, description);
    if (data) {
      setCurrentBoard(data);
    }
  };

  if (!currentBoard) {
    return (
      <>
        <div className="no-board">
          <div className="no-board-content">
            <h1>Kanban</h1>
            <h2>Organize suas tarefas de forma visual</h2>
            <p>
              Crie boards personalizados, organize tarefas em listas e acompanhe o progresso 
              com um sistema visual intuitivo e moderno.
            </p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="btn-create-board"
            >
              <Plus size={20} />
              Criar Primeiro Board
            </button>
            
            <div className="welcome-features">
              <div className="feature-card">
                <h3>📋 Organize</h3>
                <p>Crie listas personalizadas para organizar suas tarefas</p>
              </div>
              <div className="feature-card">
                <h3>🎯 Foque</h3>
                <p>Mantenha o foco com um sistema visual claro</p>
              </div>
              <div className="feature-card">
                <h3>🚀 Produza</h3>
                <p>Aumente sua produtividade com organização visual</p>
              </div>
            </div>
          </div>
        </div>
        
        <CreateBoardModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreateBoard={handleCreateBoard}
        />
      </>
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

  const handleAddList = async () => {
    if (listTitle.trim() && currentBoard) {
      const { error } = await createList(currentBoard.id, listTitle.trim());
      if (!error) {
        setListTitle('');
        setIsAddingList(false);
      }
    }
  };

  const handleCancelAddList = () => {
    setListTitle('');
    setIsAddingList(false);
  };

  return (
    <>
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
      
      <CreateBoardModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateBoard={handleCreateBoard}
      />
    </>
  );
}

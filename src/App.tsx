import { useState } from 'react';
import { BoardProvider } from './context/BoardContext';
import { BoardSelector } from './components/BoardSelector';
import { Board } from './components/Board';
import { Menu, X } from 'lucide-react';
import './App.css';

function App() {
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <BoardProvider>
      <div className="app">
        <div className={`sidebar ${showSidebar ? 'open' : 'closed'}`}>
          <div className="sidebar-header">
            <h1>Trello Clone</h1>
            <button
              onClick={() => setShowSidebar(false)}
              className="btn-close-sidebar"
            >
              <X size={20} />
            </button>
          </div>
          <BoardSelector />
        </div>

        <div className="main-content">
          <div className="main-header">
            <button
              onClick={() => setShowSidebar(true)}
              className="btn-open-sidebar"
            >
              <Menu size={20} />
            </button>
            <h2>Gerenciador de Tarefas</h2>
          </div>
          <Board />
        </div>
      </div>
    </BoardProvider>
  );
}

export default App;

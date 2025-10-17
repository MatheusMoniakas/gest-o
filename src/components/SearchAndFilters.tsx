import { useState } from 'react';
import { useBoard } from '../context/BoardContext';
import { Search, Filter, X } from 'lucide-react';

export function SearchAndFilters() {
  const { currentBoard } = useBoard();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    labels: [] as string[],
    members: [] as string[],
    dueDate: 'all' as 'all' | 'overdue' | 'today' | 'thisWeek' | 'completed',
  });

  if (!currentBoard) return null;

  // Filtrar cards baseado nos critérios
  const filteredLists = currentBoard.lists.map(list => ({
    ...list,
    cards: list.cards.filter(card => {
      // Busca por texto
      if (searchTerm && !card.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !card.description?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Filtro por etiquetas
      if (filters.labels.length > 0 && 
          !filters.labels.some(labelId => card.labels.some(label => label.id === labelId))) {
        return false;
      }

      // Filtro por membros
      if (filters.members.length > 0 && 
          !filters.members.some(memberId => card.members.some(member => member.id === memberId))) {
        return false;
      }

      // Filtro por data de vencimento
      if (filters.dueDate !== 'all') {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
        const thisWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

        switch (filters.dueDate) {
          case 'overdue':
            if (!card.dueDate || card.dueDate >= today || card.isCompleted) return false;
            break;
          case 'today':
            if (!card.dueDate || card.dueDate < today || card.dueDate >= tomorrow) return false;
            break;
          case 'thisWeek':
            if (!card.dueDate || card.dueDate < today || card.dueDate >= thisWeek) return false;
            break;
          case 'completed':
            if (!card.isCompleted) return false;
            break;
        }
      }

      return true;
    })
  }));

  const clearFilters = () => {
    setFilters({
      labels: [],
      members: [],
      dueDate: 'all',
    });
    setSearchTerm('');
  };

  const hasActiveFilters = searchTerm || 
    filters.labels.length > 0 || 
    filters.members.length > 0 || 
    filters.dueDate !== 'all';

  return (
    <div className="search-and-filters">
      <div className="search-container">
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar cards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="clear-search"
            >
              <X size={14} />
            </button>
          )}
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`filter-toggle ${hasActiveFilters ? 'active' : ''}`}
        >
          <Filter size={16} />
          Filtros
        </button>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filter-section">
            <h4>Data de Vencimento</h4>
            <select
              value={filters.dueDate}
              onChange={(e) => setFilters(prev => ({ ...prev, dueDate: e.target.value as any }))}
              className="filter-select"
            >
              <option value="all">Todas as datas</option>
              <option value="overdue">Vencidas</option>
              <option value="today">Hoje</option>
              <option value="thisWeek">Esta semana</option>
              <option value="completed">Concluídas</option>
            </select>
          </div>

          <div className="filter-section">
            <h4>Etiquetas</h4>
            <div className="label-filters">
              {currentBoard.lists.flatMap(list => list.cards)
                .flatMap(card => card.labels)
                .filter((label, index, self) => 
                  index === self.findIndex(l => l.id === label.id)
                )
                .map(label => (
                  <label key={label.id} className="label-filter">
                    <input
                      type="checkbox"
                      checked={filters.labels.includes(label.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters(prev => ({ 
                            ...prev, 
                            labels: [...prev.labels, label.id] 
                          }));
                        } else {
                          setFilters(prev => ({ 
                            ...prev, 
                            labels: prev.labels.filter(id => id !== label.id) 
                          }));
                        }
                      }}
                    />
                    <span 
                      className="label-color" 
                      style={{ backgroundColor: label.color }}
                    />
                    <span>{label.name}</span>
                  </label>
                ))}
            </div>
          </div>

          <div className="filter-section">
            <h4>Membros</h4>
            <div className="member-filters">
              {currentBoard.lists.flatMap(list => list.cards)
                .flatMap(card => card.members)
                .filter((member, index, self) => 
                  index === self.findIndex(m => m.id === member.id)
                )
                .map(member => (
                  <label key={member.id} className="member-filter">
                    <input
                      type="checkbox"
                      checked={filters.members.includes(member.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters(prev => ({ 
                            ...prev, 
                            members: [...prev.members, member.id] 
                          }));
                        } else {
                          setFilters(prev => ({ 
                            ...prev, 
                            members: prev.members.filter(id => id !== member.id) 
                          }));
                        }
                      }}
                    />
                    <div className="member-avatar">{member.initials}</div>
                    <span>{member.name}</span>
                  </label>
                ))}
            </div>
          </div>

          {hasActiveFilters && (
            <div className="filter-actions">
              <button onClick={clearFilters} className="clear-filters-btn">
                Limpar Filtros
              </button>
            </div>
          )}
        </div>
      )}

      {hasActiveFilters && (
        <div className="active-filters">
          <span className="filter-count">
            {filteredLists.reduce((acc, list) => acc + list.cards.length, 0)} cards encontrados
          </span>
        </div>
      )}
    </div>
  );
}

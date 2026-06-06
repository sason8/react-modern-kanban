import React, { useState, useEffect } from 'react';
import Column from './components/Column';
import TaskModal from './components/TaskModal';

const initialColumns = [
  { id: 'todo', title: 'To Do' },
  { id: 'inProgress', title: 'In Progress' },
  { id: 'review', title: 'Code Review' },
  { id: 'done', title: 'Done' }
];

const initialTasks = {
  todo: [
    {
      id: 1,
      content: 'Implement JWT Auth',
      description: 'Secure API endpoints with access tokens, bcrypt hashing, and database verification.',
      priority: 'high',
      dueDate: '2026-06-15',
      tags: ['feature'],
      subtasks: [
        { id: 101, title: 'Create DB user models', completed: true },
        { id: 102, title: 'Write token generator logic', completed: false },
        { id: 103, title: 'Integrate oauth2 endpoints', completed: false }
      ]
    },
    {
      id: 2,
      content: 'Fix Memory Leak in Logger',
      description: 'Locate and resolve file descriptor leak occurring during file transport rotation.',
      priority: 'high',
      dueDate: '2026-06-08',
      tags: ['bug'],
      subtasks: [
        { id: 104, title: 'Check stream cleanup', completed: true }
      ]
    }
  ],
  inProgress: [
    {
      id: 3,
      content: 'Design Glassmorphism Dashboard',
      description: 'Craft beautiful, transparent card designs with backdrop filter blurs and neon glows.',
      priority: 'medium',
      dueDate: '2026-06-12',
      tags: ['refactor'],
      subtasks: [
        { id: 105, title: 'Set CSS custom properties', completed: true },
        { id: 106, title: 'Implement drag-over transitions', completed: false }
      ]
    }
  ],
  review: [
    {
      id: 4,
      content: 'Write Unit Tests for Go CLI',
      description: 'Provide 85%+ test coverage for command flags, clipboard routines, and entropy checks.',
      priority: 'low',
      dueDate: '2026-06-10',
      tags: ['docs'],
      subtasks: [
        { id: 107, title: 'Test similar chars exclusion', completed: true },
        { id: 108, title: 'Mock OS clipboard', completed: false }
      ]
    }
  ],
  done: [
    {
      id: 5,
      content: 'Setup Monorepo Structure',
      description: 'Configure initial folder configurations and root repository git setup.',
      priority: 'low',
      dueDate: '2026-06-05',
      tags: ['feature'],
      subtasks: [
        { id: 109, title: 'Run git init', completed: true },
        { id: 110, title: 'Add basic licenses', completed: true }
      ]
    }
  ]
};

export default function App() {
  const [columns, setColumns] = useState(() => {
    const saved = localStorage.getItem('kanban-cols');
    return saved ? JSON.parse(saved) : initialColumns;
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('kanban-tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState(null); // null means creating
  const [targetColumnId, setTargetColumnId] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('kanban-cols', JSON.stringify(columns));
  }, [columns]);

  useEffect(() => {
    localStorage.setItem('kanban-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddColumn = () => {
    const newId = `col-${Date.now()}`;
    const newCol = { id: newId, title: 'New Column' };
    setColumns([...columns, newCol]);
    setTasks(prev => ({ ...prev, [newId]: [] }));
  };

  const handleRenameColumn = (columnId, newTitle) => {
    setColumns(columns.map(col => col.id === columnId ? { ...col, title: newTitle } : col));
  };

  const handleDeleteColumn = (columnId) => {
    if (window.confirm("Are you sure you want to delete this column and all its tasks?")) {
      setColumns(columns.filter(col => col.id !== columnId));
      setTasks(prev => {
        const copy = { ...prev };
        delete copy[columnId];
        return copy;
      });
    }
  };

  const handleAddTaskClick = (columnId) => {
    setActiveTask(null);
    setTargetColumnId(columnId);
    setIsModalOpen(true);
  };

  const handleEditTaskClick = (task) => {
    // Find column containing task
    let colId = null;
    for (const key of Object.keys(tasks)) {
      if (tasks[key].some(t => t.id === task.id)) {
        colId = key;
        break;
      }
    }
    setActiveTask(task);
    setTargetColumnId(colId);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (taskId, columnId) => {
    if (window.confirm("Delete this task?")) {
      setTasks(prev => ({
        ...prev,
        [columnId]: prev[columnId].filter(t => t.id !== taskId)
      }));
    }
  };

  const handleSaveTask = (savedTask) => {
    setTasks(prev => {
      const colTasks = prev[targetColumnId] || [];
      const isEdit = colTasks.some(t => t.id === savedTask.id) || 
                     Object.values(prev).some(arr => arr.some(t => t.id === savedTask.id));

      if (isEdit) {
        // Find which column it's in, remove it or update it
        const nextTasks = {};
        for (const colId of Object.keys(prev)) {
          nextTasks[colId] = prev[colId].map(t => t.id === savedTask.id ? savedTask : t);
        }
        return nextTasks;
      } else {
        // Create new
        return {
          ...prev,
          [targetColumnId]: [...colTasks, savedTask]
        };
      }
    });
  };

  const handleMoveTask = (taskId, sourceCol, destCol) => {
    setTasks(prev => {
      const sourceList = [...(prev[sourceCol] || [])];
      const destList = [...(prev[destCol] || [])];
      
      const taskIndex = sourceList.findIndex(t => t.id === taskId);
      if (taskIndex === -1) return prev;
      
      const [movedTask] = sourceList.splice(taskIndex, 1);
      
      // If moving to 'done' column, mark task completed
      if (destCol === 'done') {
        movedTask.is_completed = true;
      } else {
        movedTask.is_completed = false;
      }

      destList.push(movedTask);
      
      return {
        ...prev,
        [sourceCol]: sourceList,
        [destCol]: destList
      };
    });
  };

  const handleResetBoard = () => {
    if (window.confirm("Reset board to default demo state?")) {
      setColumns(initialColumns);
      setTasks(initialTasks);
      localStorage.removeItem('kanban-cols');
      localStorage.removeItem('kanban-tasks');
    }
  };

  // Filter tasks based on search query
  const getFilteredTasks = (colId) => {
    const colTasks = tasks[colId] || [];
    if (!searchQuery.trim()) return colTasks;
    const query = searchQuery.toLowerCase();
    return colTasks.filter(t => 
      t.content.toLowerCase().includes(query) || 
      (t.description && t.description.toLowerCase().includes(query)) ||
      (t.tags && t.tags.some(tag => tag.toLowerCase().includes(query)))
    );
  };

  return (
    <div className="app-container">
      <header>
        <div>
          <h1>✨ Modern Kanban Dashboard</h1>
          <p>Organize your software engineering tasks with glassmorphism style.</p>
        </div>
        <div className="toolbar">
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search tasks, tags, descriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn" onClick={handleAddColumn}>
            + Add Column
          </button>
          <button className="btn btn-secondary btn-danger" onClick={handleResetBoard}>
            Reset Board
          </button>
        </div>
      </header>

      <main className="board">
        {columns.map(col => (
          <Column 
            key={col.id}
            column={col}
            tasks={getFilteredTasks(col.id)}
            onAddTaskClick={handleAddTaskClick}
            onEditTask={handleEditTaskClick}
            onDeleteTask={handleDeleteTask}
            onRenameColumn={handleRenameColumn}
            onDeleteColumn={handleDeleteColumn}
            onMoveTask={handleMoveTask}
          />
        ))}
      </main>

      <TaskModal 
        isOpen={isModalOpen}
        task={activeTask}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
      />
    </div>
  );
}

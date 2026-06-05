import React, { useState, useEffect } from 'react';
import Column from './components/Column';

const initialData = {
  todo: [{ id: 1, content: 'Research architectural patterns' }],
  inProgress: [{ id: 2, content: 'Design glassmorphism UI' }],
  done: [{ id: 3, content: 'Setup GitHub repository' }]
};

export default function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('kanban-tasks');
    return saved ? JSON.parse(saved) : initialData;
  });

  useEffect(() => {
    localStorage.setItem('kanban-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (columnId, content) => {
    const newTask = { id: Date.now(), content };
    setTasks(prev => ({
      ...prev,
      [columnId]: [...prev[columnId], newTask]
    }));
  };

  const moveTask = (taskId, sourceCol, destCol) => {
    setTasks(prev => {
      const sourceTasks = [...prev[sourceCol]];
      const taskIndex = sourceTasks.findIndex(t => t.id === taskId);
      const [task] = sourceTasks.splice(taskIndex, 1);
      
      const destTasks = [...prev[destCol], task];
      return { ...prev, [sourceCol]: sourceTasks, [destCol]: destTasks };
    });
  };

  return (
    <div className="app-container">
      <header>
        <h1>âś¨ Modern Kanban</h1>
        <p>Organize your work with premium style.</p>
      </header>
      <main className="board">
        <Column id="todo" title="To Do" tasks={tasks.todo} addTask={addTask} moveTask={moveTask} />
        <Column id="inProgress" title="In Progress" tasks={tasks.inProgress} addTask={addTask} moveTask={moveTask} />
        <Column id="done" title="Done" tasks={tasks.done} addTask={addTask} moveTask={moveTask} />
      </main>
    </div>
  );
}

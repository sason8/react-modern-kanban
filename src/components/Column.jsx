import React, { useState } from 'react';
import Task from './Task';

export default function Column({ id, title, tasks, addTask, moveTask }) {
  const [newTaskContent, setNewTaskContent] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (newTaskContent.trim()) {
      addTask(id, newTaskContent.trim());
      setNewTaskContent('');
    }
  };

  return (
    <div className="column">
      <h2>{title} <span>{tasks.length}</span></h2>
      <div className="task-list">
        {tasks.map(task => (
          <Task key={task.id} task={task} currentColumn={id} moveTask={moveTask} />
        ))}
      </div>
      <form onSubmit={handleAdd} className="add-task-form">
        <input 
          type="text" 
          placeholder="Add new task..." 
          value={newTaskContent}
          onChange={(e) => setNewTaskContent(e.target.value)}
        />
        <button type="submit">+</button>
      </form>
    </div>
  );
}

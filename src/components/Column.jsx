import React, { useState } from 'react';
import Task from './Task';

export default function Column({ 
  column, 
  tasks, 
  onAddTaskClick, 
  onEditTask, 
  onDeleteTask, 
  onRenameColumn, 
  onDeleteColumn, 
  onMoveTask 
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    try {
      const dataStr = e.dataTransfer.getData('text/plain');
      if (!dataStr) return;
      const { taskId, sourceCol } = JSON.parse(dataStr);
      if (sourceCol !== column.id) {
        onMoveTask(taskId, sourceCol, column.id);
      }
    } catch (err) {
      console.error("Failed to handle drop", err);
    }
  };

  return (
    <div 
      className={`column ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="column-header">
        <div className="column-title-container">
          <input 
            type="text" 
            className="column-title-input" 
            value={column.title} 
            onChange={(e) => onRenameColumn(column.id, e.target.value)}
            title="Click to rename column"
          />
          <span className="task-counter">{tasks.length}</span>
        </div>
        
        <div className="column-actions">
          <button 
            className="column-btn delete" 
            onClick={() => onDeleteColumn(column.id)}
            title="Delete column"
          >
            &times;
          </button>
        </div>
      </div>

      <div className="task-list">
        {tasks.length === 0 ? (
          <div className="empty-state">
            Drag tasks here
          </div>
        ) : (
          tasks.map(task => (
            <Task 
              key={task.id} 
              task={task} 
              columnId={column.id} 
              onEditTask={onEditTask} 
              onDeleteTask={onDeleteTask}
            />
          ))
        )}
      </div>

      <button className="add-task-btn" onClick={() => onAddTaskClick(column.id)}>
        <span>+</span> Add Task
      </button>
    </div>
  );
}

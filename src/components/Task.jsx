import React from 'react';

export default function Task({ task, columnId, onEditTask, onDeleteTask }) {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ taskId: task.id, sourceCol: columnId }));
    e.dataTransfer.effectAllowed = 'move';
    // Add small delay to allow ghost image to render before applying dragging class
    setTimeout(() => {
      e.target.classList.add('dragging');
    }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging');
  };

  // Calculate subtask progress
  const totalSubtasks = task.subtasks ? task.subtasks.length : 0;
  const completedSubtasks = task.subtasks ? task.subtasks.filter(s => s.completed).length : 0;
  const progressPercent = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  // Check if date is overdue
  const isOverdue = () => {
    if (!task.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today && !task.is_completed;
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  return (
    <div 
      className={`task-card priority-${task.priority || 'medium'}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={() => onEditTask(task)}
    >
      <div className="task-header">
        <h4 className="task-title">{task.content}</h4>
        <button 
          className="column-btn delete" 
          onClick={(e) => {
            e.stopPropagation();
            onDeleteTask(task.id, columnId);
          }}
          title="Delete task"
        >
          &times;
        </button>
      </div>

      {task.description && <p className="task-desc">{task.description}</p>}

      {task.tags && task.tags.length > 0 && (
        <div className="task-tags">
          {task.tags.map((tag, idx) => (
            <span key={idx} className={`tag tag-${tag}`}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {totalSubtasks > 0 && (
        <div className="task-progress">
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="progress-text">
            <span>📋</span> {completedSubtasks}/{totalSubtasks} subtasks ({Math.round(progressPercent)}%)
          </div>
        </div>
      )}

      <div className="task-footer">
        <span className="task-priority" title={`Priority: ${task.priority}`}>
          {getPriorityIcon(task.priority)} {task.priority}
        </span>
        
        {task.dueDate && (
          <span className={`task-date ${isOverdue() ? 'overdue' : ''}`}>
            📅 {task.dueDate}
          </span>
        )}
      </div>
    </div>
  );
}

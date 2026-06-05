import React from 'react';

export default function Task({ task, currentColumn, moveTask }) {
  return (
    <div className="task">
      <p>{task.content}</p>
      <div className="task-actions">
        {currentColumn !== 'todo' && (
          <button onClick={() => moveTask(task.id, currentColumn, 'todo')} title="Move to To Do">âŹŞ</button>
        )}
        {currentColumn !== 'inProgress' && (
          <button onClick={() => moveTask(task.id, currentColumn, 'inProgress')} title="Move to In Progress">đź”„</button>
        )}
        {currentColumn !== 'done' && (
          <button onClick={() => moveTask(task.id, currentColumn, 'done')} title="Move to Done">âś…</button>
        )}
      </div>
    </div>
  );
}

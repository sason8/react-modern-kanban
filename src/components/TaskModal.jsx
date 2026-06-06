import React, { useState, useEffect } from 'react';

export default function TaskModal({ task, isOpen, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [tag, setTag] = useState('feature');
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.content || '');
      setDesc(task.description || '');
      setPriority(task.priority || 'medium');
      setDueDate(task.dueDate || '');
      setTag(task.tags && task.tags.length > 0 ? task.tags[0] : 'feature');
      setSubtasks(task.subtasks || []);
    } else {
      // Clear state for new task
      setTitle('');
      setDesc('');
      setPriority('medium');
      setDueDate('');
      setTag('feature');
      setSubtasks([]);
    }
    setNewSubtaskTitle('');
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: task ? task.id : Date.now(),
      content: title.trim(),
      description: desc.trim(),
      priority,
      dueDate,
      tags: [tag],
      subtasks
    });
    onClose();
  };

  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    const newSub = {
      id: Date.now(),
      title: newSubtaskTitle.trim(),
      completed: false
    };
    setSubtasks([...subtasks, newSub]);
    setNewSubtaskTitle('');
  };

  const toggleSubtask = (subtaskId) => {
    setSubtasks(subtasks.map(sub => 
      sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
    ));
  };

  const deleteSubtask = (subtaskId) => {
    setSubtasks(subtasks.filter(sub => sub.id !== subtaskId));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{task ? 'Edit Task' : 'Create Task'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSave}>
          <div className="form-group">
            <label>Title</label>
            <input 
              type="text" 
              required 
              placeholder="e.g. Implement OAuth" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea 
              placeholder="Add details here..." 
              value={desc} 
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>

            <div className="form-group">
              <label>Tag</label>
              <select value={tag} onChange={(e) => setTag(e.target.value)}>
                <option value="feature">✨ Feature</option>
                <option value="bug">🐛 Bug</option>
                <option value="refactor">♻️ Refactor</option>
                <option value="docs">📝 Docs</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Due Date</label>
            <input 
              type="date" 
              value={dueDate} 
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="subtasks-manager">
            <label style={{ fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
              Subtasks
            </label>
            
            <div className="subtask-list">
              {subtasks.length === 0 ? (
                <div style={{ fontSize: '0.8rem', color: '#6b7280', textAlign: 'center', padding: '0.5rem 0' }}>
                  No subtasks added yet
                </div>
              ) : (
                subtasks.map(sub => (
                  <div key={sub.id} className="subtask-item">
                    <div className="subtask-item-left">
                      <input 
                        type="checkbox" 
                        checked={sub.completed} 
                        onChange={() => toggleSubtask(sub.id)}
                      />
                      <span className={sub.completed ? 'completed' : ''}>{sub.title}</span>
                    </div>
                    <button 
                      type="button" 
                      className="column-btn delete" 
                      onClick={() => deleteSubtask(sub.id)}
                      title="Delete subtask"
                    >
                      &times;
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="subtask-add-row">
              <input 
                type="text" 
                placeholder="Add new subtask..." 
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask(e);
                  }
                }}
              />
              <button type="button" className="btn btn-secondary" onClick={handleAddSubtask}>
                Add
              </button>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn">
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

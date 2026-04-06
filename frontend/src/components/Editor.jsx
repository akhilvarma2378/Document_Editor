import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function Editor({ document, users, currentUserId, onSave, onShare }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [shareTarget, setShareTarget] = useState('');

  // Sync internal state when a new document is passed in
  useEffect(() => {
    if (document) {
      setTitle(document.title);
      setContent(document.content || '');
      setShareTarget('');
    }
  }, [document]);

  if (!document) {
    return <div className="editor-empty">Select or create a document to start editing.</div>;
  }

  const isOwner = document.owner_id === currentUserId;
  const otherUsers = users.filter(u => u.id !== currentUserId);

  return (
    <div className="editor-container">
      <div className="editor-header">
        <input
          className="title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Document Title"
        />
        <div className="editor-actions">
          <button onClick={() => onSave(document.id, { title, content })}>Save Changes</button>

          {isOwner && (
            <div className="share-controls">
              <select value={shareTarget} onChange={(e) => setShareTarget(e.target.value)}>
                <option value="">Share with...</option>
                {otherUsers.map(u => (
                  <option key={u.id} value={u.id}>{u.username}</option>
                ))}
              </select>
              <button onClick={() => onShare(document.id, shareTarget)} disabled={!shareTarget}>
                Share
              </button>
            </div>
          )}
        </div>
      </div>

      <ReactQuill
        theme="snow"
        value={content}
        onChange={setContent}
        className="rich-text"
      />
    </div>
  );
}
import React from 'react';
import { uploadFile } from '../api/client';

export default function TopBar({ users, currentUser, onUserChange, onNewDoc, onUploadSuccess }) {
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const result = await uploadFile(file);
      onUploadSuccess(result.filename, result.content);
    } catch (err) {
      alert("Upload failed. Ensure it is a .txt or .md file.");
    }
  };

  return (
    <div className="top-bar">
      <h2>AI-Native Editor MVP</h2>

      <div className="actions">
        <label>
          Log in as:
          <select
            value={currentUser?.id || ""}
            onChange={(e) => onUserChange(Number(e.target.value))}
          >
            <option value="" disabled>Select User</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.username}</option>
            ))}
          </select>
        </label>

        <button onClick={onNewDoc} disabled={!currentUser}>+ New Document</button>

        <label className="upload-btn" disabled={!currentUser}>
          Upload .txt
          <input
            type="file"
            accept=".txt,.md"
            style={{ display: 'none' }}
            onChange={handleFileUpload}
            disabled={!currentUser}
          />
        </label>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import * as api from './api/client';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import './App.css';

export default function App() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);

  // Load users on mount
  useEffect(() => {
    api.fetchUsers().then(res => setUsers(res.data)).catch(console.error);
  }, []);

  // Load documents when user changes
  useEffect(() => {
    if (currentUser) {
      loadDocuments(currentUser.id);
      setSelectedDoc(null);
    } else {
      setDocuments([]);
    }
  }, [currentUser]);

  const loadDocuments = async (userId) => {
    try {
      const res = await api.fetchDocuments(userId);
      setDocuments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUserChange = (userId) => {
    const user = users.find(u => u.id === userId);
    setCurrentUser(user);
  };

  const handleNewDoc = async () => {
    const res = await api.createDocument(currentUser.id, { title: "New Document", content: "" });
    setDocuments([...documents, res.data]);
    setSelectedDoc(res.data);
  };

  const handleUploadSuccess = async (filename, content) => {
    const res = await api.createDocument(currentUser.id, { title: filename, content: content });
    await loadDocuments(currentUser.id);
    setSelectedDoc(res.data);
  };

  const handleSave = async (docId, data) => {
    try {
      const res = await api.updateDocument(currentUser.id, docId, data);
      await loadDocuments(currentUser.id);
      setSelectedDoc(res.data); // Update local selected doc
      alert("Saved!");
    } catch (err) {
      alert("Failed to save.");
    }
  };

  const handleShare = async (docId, targetUserId) => {
    try {
      const res = await api.shareDocument(currentUser.id, docId, targetUserId);
      alert(res.data.msg);
    } catch (err) {
      alert("Failed to share.");
    }
  };

  return (
    <div className="app-container">
      <TopBar
        users={users}
        currentUser={currentUser}
        onUserChange={handleUserChange}
        onNewDoc={handleNewDoc}
        onUploadSuccess={handleUploadSuccess}
      />
      <div className="main-layout">
        <Sidebar
          documents={documents}
          currentUserId={currentUser?.id}
          selectedDocId={selectedDoc?.id}
          onSelectDoc={setSelectedDoc}
        />
        <Editor
          document={selectedDoc}
          users={users}
          currentUserId={currentUser?.id}
          onSave={handleSave}
          onShare={handleShare}
        />
      </div>
    </div>
  );
}
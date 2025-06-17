

import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate} from 'react-router-dom';
import axios from 'axios';
import '../styles/Chatbot.css'; // Reuse styles from chatbot
import backIcon from '../Assets/back.png';
import uploadIcon from '../Assets/attachment.png';
import sendIcon from '../Assets/sent.png';
import closeIcon from '../Assets/close-b.png';
import botLogo from '../Assets/logo.png';
import previewIcon from '../Assets/file-preview.png';

const PreChatbot = () => {
    const location = useLocation();
    const { chatName, initialItems } = location.state || { chatName: '', initialItems: [] };
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [currentInput, setCurrentInput] = useState('');
    const [documents, setDocuments] = useState([]);
    const [showDocuments, setShowDocuments] = useState(false); // Toggle for document panel
    const messagesEndRef = useRef(null);
    const backclick = () => {
        navigate('/'); // Redirect to Home page
    };
    useEffect(() => {
        // Convert initialItems to the appropriate message structure
        const convertedMessages = initialItems.map((item) => {
            if (item.type === 'document') {
                const fileName = item.url.split('_').pop();
                const docEntry = {
                    name: fileName,
                    url: item.url,
                    date: new Date().toLocaleDateString(),
                };
                setDocuments((prevDocs) => [...prevDocs, docEntry]); // Add document to the panel
                return {
                    text: fileName, // Extract file name from URL
                    sender: 'user', // Documents are uploaded by the user
                    fileUrl: item.url, // Use the provided URL for href
                    isFile: true, // Mark as a file message
                };
            } else if (item.type === 'chat') {
                return [
                    {
                        text: item.query, // Query from the user
                        sender: 'user',
                        isFile: false,
                    },
                    {
                        text: item.response, // Bot's response
                        sender: 'bot',
                        isFile: false,
                    },
                ];
            }
            return null;
        }).flat().filter(Boolean); // Flatten the array and remove any null values

        setMessages(convertedMessages);
    }, [initialItems]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleInputChange = (event) => {
        setCurrentInput(event.target.value);
    };

    const handleSendMessage = async () => {
        if (!currentInput.trim()) return;

        const newMessage = { text: currentInput, sender: 'user' };
        setMessages((prev) => [...prev, newMessage]);

        try {
            const userId = localStorage.getItem('user_id');

            // Create FormData for the message
            const formData = new FormData();
            formData.append('chat_name', chatName);
            formData.append('query', currentInput);
            formData.append('user_id', parseInt(userId));

            // Send FormData to the backend
            const response = await axios.post("http://localhost:8000/chat/", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.response) {
                setMessages((prev) => [
                    ...prev,
                    {
                        text: response.data.response,
                        sender: 'bot',
                        isFile: false,
                    },
                ]);
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages((prev) => [
                ...prev,
                { text: "Failed to send message. Please try again.", sender: 'bot', isFile: false },
            ]);
        }

        setCurrentInput('');
    };

    const handleFileUpload = async (files) => {
        const userId = localStorage.getItem('user_id');
        const formData = new FormData();
    
        // Append all files with key 'files' to match the backend
        Array.from(files).forEach((file) => {
            formData.append("files", file);
        });
    
        formData.append("chat_name", chatName);
        formData.append("user_id", userId);
    
        try {
            const response = await axios.post("http://localhost:8000/upload_file_to_collection/", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            const uploadedFiles = response.data.uploaded_files;
            const newDocuments = uploadedFiles.map((file) => ({
                name: file.filename,
                fileUrl: file.url, // Backend URL
                date: new Date().toLocaleDateString(),
            }));
    
            setDocuments((prevDocs) => [...prevDocs, ...newDocuments]);
            setMessages((prev) => [
                ...prev,
                ...newDocuments.map((doc) => ({
                    text: doc.name,
                    sender: 'user',
                    fileUrl: doc.fileUrl,
                    isFile: true,
                })),
                {
                    text: "Uploaded Successfully!<br>You can now ask a query about your document(s).",
                    sender: 'bot',
                    isHTML: true,
                },
            ]);
        } catch (error) {
            console.error("Error uploading files:", error);
            setMessages((prev) => [
                ...prev,
                { text: "Failed to upload the file(s). Please try again.", sender: 'bot' },
            ]);
        }
    };
    

    const toggleDocuments = () => {
        setShowDocuments(!showDocuments);
    };

    return (
        <div className="chatbot-container">
            <div className="header">
                <div className="title">
                <img
                    src={backIcon}
                    alt="Logo"
                    onClick={backclick}
                    style={{ cursor: 'pointer' }}
                />
                    <h1>{chatName || 'Chat'}</h1>
                </div>
                <div className="header-actions">
                    <button className="view-all-docs" onClick={toggleDocuments}>
                        View All Docs
                    </button>
                </div>
            </div>

            <div className="chat-messages">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.sender}`}>
                        {message.sender === 'bot' && (
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <img
                                    src={botLogo}
                                    alt="Bot Logo"
                                    style={{ marginRight: '10px', width: '30px', height: '30px' }}
                                />
                                {message.isHTML ? (
                                    <span dangerouslySetInnerHTML={{ __html: message.text }} />
                                ) : (
                                    <span>{message.text}</span>
                                )}
                            </div>
                        )}
                        {message.sender === 'user' && (
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                {message.isFile && (
                                    <img
                                        src={uploadIcon}
                                        alt="File Icon"
                                        style={{ marginRight: '10px', width: '20px', height: '20px' }}
                                    />
                                )}
                                {message.isFile ? (
                                    <a
                                        href={message.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: '#007bff', textDecoration: 'none' }}
                                    >
                                        {message.text}
                                    </a>
                                ) : (
                                    <span>{message.text}</span>
                                )}
                            </div>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {showDocuments && (
                <div className="document-panel">
                    <div className="panel-header">
                        <h2>All Documents</h2>
                        <button onClick={toggleDocuments} className="close-button">
                            <img src={closeIcon} alt="Close" />
                        </button>
                    </div>
                    <div className="document-list">
                        {documents.length > 0 ? (
                            documents.map((doc, index) => (
                                <div key={index} className="document-item">
                                    <img src={previewIcon} alt={`${doc.name} preview`} className="document-preview" />
                                    <div className="file-info">
                                        <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                                            {doc.name}
                                        </a>
                                        <span className="document-date">{doc.date}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No documents available.</p>
                        )}
                    </div>
                </div>
            )}

            <div className="query-input">
                <img
                    src={uploadIcon}
                    alt="Upload"
                    onClick={() => document.getElementById('fileInput').click()}
                />
                <input
                    id="fileInput"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileUpload(e.target.files)}
                    accept=".pdf,.jpg,.png,.docx"
                />
                <input
                    type="text"
                    value={currentInput}
                    onChange={handleInputChange}
                    placeholder="Type your query here..."
                />
                <button type="button" onClick={handleSendMessage}>
                    <img src={sendIcon} alt="Send" />
                </button>
            </div>
        </div>
    );
};

export default PreChatbot;

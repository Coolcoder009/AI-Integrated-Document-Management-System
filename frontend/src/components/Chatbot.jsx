import React, { useEffect, useRef, useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import backIcon from '../Assets/back.png';
import uploadIcon from '../Assets/attachment.png';
import sendIcon from '../Assets/sent.png';
import fileUploadIcon from '../Assets/file-upload.png';
import botResponseIcon from '../Assets/logo.png'; 
import fileIcon from '../Assets/pdf.png';
import closeIcon from '../Assets/close-b.png';  
import previewIcon from '../Assets/file-preview.png';  
import optionsIcon from '../Assets/more.png';  
import closeButton from '../Assets/close.png';
import '../styles/Chatbot.css';

const Header = ({ onViewAllDocs, chatName}) => {
    const [displayedText, setDisplayedText] = useState("");
    const navigate = useNavigate();

    // Animate `chatName` display letter-by-letter
    useEffect(() => {
        let index = 0;
        setDisplayedText(""); // Reset displayed text for each new chat name

        const timer = setInterval(() => {
            setDisplayedText((prev) => prev + chatName[index]);
            index++;

            if (index === chatName.length) {
                clearInterval(timer);
            }
        }, 100); // Adjust speed here (100ms per letter)

        return () => clearInterval(timer); // Cleanup interval on component unmount
    }, [chatName]);

    // Handle click on title icon
    const backclick = () => {
        navigate('/'); // Redirect to Home page
    };

    return (
        <div className="header">
            <div className="title">
                <img
                    src={backIcon}
                    alt="Logo"
                    onClick={backclick}
                    style={{ cursor: 'pointer' }}
                />
                <h1 className="animated-text">{displayedText}</h1>
            </div>
            <div className="docs-link">
                <button onClick={onViewAllDocs} className="view-all-docs">View all docs</button>
            </div>
        </div>
    );
};


const DocumentPanel = ({ documents, onClose }) => {
    const [selectedDoc, setSelectedDoc] = useState(null);

    const openDocument = (doc) => {
        setSelectedDoc(doc);
    };

    const closeDocument = () => {
        setSelectedDoc(null);
    };

    return (
        <div className="document-panel">
            <div className="panel-header">
                <span className="panel-title">All Documents</span>
                <button onClick={onClose}>
                    <img src={closeIcon} alt="Close document panel" className="close-icon" />
                </button>
            </div>
            <div className="document-list">
                {documents.length > 0 ? (
                    documents.map((doc, index) => (
                        <div key={index} className="document-item">
                            <img
                                src={previewIcon}
                                alt={`${doc.name} preview`}
                                className="document-preview"
                                onClick={() => openDocument(doc)}
                            />
                            <div className="file-info">
                                <img src={fileIcon} alt="File" className="file-icon" />
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        openDocument(doc);
                                    }}
                                    className="document-name"
                                >
                                    {doc.name.length > 15 ? `${doc.name.substring(0, 12)}...` : doc.name}
                                </button>
                            </div>
                            <div className="date-options">
                                <span className="document-date">{doc.date || "June 12, 2024"}</span>
                                <button className="document-options">
                                    <img src={optionsIcon} alt="More options" className="options-icon" />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No documents available.</p>
                )}
            </div>

            {/* Modal for document preview */}
            {selectedDoc && (
                <div className="modal-overlay" onClick={closeDocument}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={closeButton}
                            alt="Close document"
                            className="close-button"
                            onClick={closeDocument}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

const FileUploadArea = ({ onFileUploaded }) => {
  const fileInputRef = React.useRef(null);

  const handleBrowseClick = () => {
      fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files.length) {
        onFileUploaded(Array.from(files));  // Pass all selected files as an array
    }
};

  return (
      <div className="file-upload-area">
          <img src={fileUploadIcon} alt="Upload files" />
          <p className="upload-instructions">Browse or Drag & Drop your files here</p>
          <p className="supported-formats">Supported format (.pdf, .jpg, .png, .docx)</p>
          <div className="upload-buttons">
              <button onClick={handleBrowseClick}>Browse from device</button>
              <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                  accept=".pdf,.txt,.jpg,.png,.docx"
                  multiple
              />
              <button onClick={handleBrowseClick}>Choose from uploads</button>
          </div>
      </div>
  );
};

const QueryInput = ({ onSendMessage, currentInput, onInputChange, onFileUploaded }) => {
    const fileInputRef = useRef(null);

    // Handle Enter key press to send message
    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            onSendMessage();
        }
    };

    // Handle file input change to process file uploads
    const handleFileChange = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            const fileArray = Array.from(files); // Convert FileList to array
            onFileUploaded(fileArray); // Pass file array to the parent function
            console.log("Files selected:", fileArray.map(file => file.name));
        }
    };

    return (
        <div className="query-input">
            {/* Upload Icon triggers file input */}
            <img src={uploadIcon} alt="Upload" onClick={() => fileInputRef.current.click()} />
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange} // Trigger handleFileChange on file selection
                accept=".pdf,.txt,.jpg,.png,.docx"
                multiple
            />
            {/* Text Input for typing query */}
            <input 
                type="text"
                value={currentInput}
                onChange={onInputChange}
                onKeyPress={handleKeyPress} // Trigger handleKeyPress on key press
                placeholder="Type your query here..." 
            />
            {/* Send Button */}
            <button type="button" onClick={onSendMessage}>
                <img src={sendIcon} alt="Send" />
            </button>
        </div>
    );
};

const Chatbot = () => {
    const [hasStartedChat, setHasStartedChat] = useState(false);
    const [messages, setMessages] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [showDocuments, setShowDocuments] = useState(false);
    const [currentInput, setCurrentInput] = useState('');
    const messagesEndRef = useRef(null);  // Reference to the end of the messages
    const [hasUploadedFiles, setHasUploadedFiles] = useState(false);
    const [chatName, setChatName] = useState("New Chat");
    const [uploadedFile, setUploadedFile] = useState(null);

    const handleFileUploaded = (files) => {
        const newDocuments = files.map(file => ({
            name: file.name,
            fileUrl: URL.createObjectURL(file),
            icon: fileIcon
        }));
        setDocuments(prevDocs => [...prevDocs, ...newDocuments]);
    
        const newMessages = files.map(file => ({
            text: file.name,
            sender: 'user',
            icon: fileIcon,
            fileUrl: URL.createObjectURL(file),
            isFile: true
        }));
        
        const uploadMessage = {
            text: "<strong>Uploaded Successfully!</strong><br>You can now ask a query about your document.",
            sender: 'bot',
            isHTML: true
        };
        
        setMessages(currentMessages => [...currentMessages, ...newMessages, uploadMessage]);
        setHasUploadedFiles(true); // Hide the file upload area
    
        // Store the uploaded file for later backend call
        if (files.length > 0) {
            setUploadedFile(files[0]);  // Save the uploaded file in state
        }
    };                    

    const handleInputChange = (event) => {
        setCurrentInput(event.target.value);
    };

    const handleSendMessage = async () => {
        if (!currentInput.trim()) return;
    
        const newMessage = { text: currentInput, sender: 'user' };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
    
        const userId = localStorage.getItem('user_id'); // Get user_id from localStorage
    
        if (!hasStartedChat && uploadedFile) {
            // Initial message with document content
            const formData = new FormData();
            formData.append("file", uploadedFile);
            formData.append("query", currentInput);
            formData.append("user_id", userId); 
    
            try {
                const response = await axios.post("http://localhost:8000/upload_and_initialize/", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
    
                const { chat_name, message, initial_response } = response.data;
    
                if (chat_name) {
                    setChatName(chat_name);
                    setHasStartedChat(true);
                }
    
                setMessages((prevMessages) => [
                    ...prevMessages,
                    message ? { text: message, sender: 'bot' } : null,
                    initial_response ? { text: initial_response, sender: 'bot' } : null,
                ].filter(Boolean));
            } catch (error) {
                console.error("Error initializing chat:", error);
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { text: "Failed to initialize chat. Please try again.", sender: 'bot' },
                ]);
            }
        } else {
            // Subsequent message with only query text
            try {
                const formData = new FormData();
                formData.append("chat_name", chatName);
                formData.append("query", currentInput);
                formData.append("user_id", parseInt(userId)); // Add user_id for subsequent queries
    
                const response = await axios.post("http://localhost:8000/chat/", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
    
                if (response.data.response) {
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { text: response.data.response, sender: 'bot' },
                    ]);
                }
            } catch (error) {
                console.error("Error in sending message:", error);
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { text: "Failed to send message. Please try again.", sender: 'bot' },
                ]);   
            }
        }
    
        setCurrentInput(''); // Clear the input field
    };
     
    
    const onFileUploaded = async (files) => {
        const userId = localStorage.getItem('user_id'); // Get user_id from localStorage
    
        if (files.length > 0 && chatName) {
            const formData = new FormData();
            
            // Append all files to the FormData object
            Array.from(files).forEach((file) => {
                formData.append("files", file); // Use "files" as it matches the backend parameter
            });
            formData.append("chat_name", chatName);
            formData.append("user_id", userId); // Include user_id
    
            const newDocuments = Array.from(files).map((file) => ({
                name: file.name,
                fileUrl: URL.createObjectURL(file),
                date: new Date().toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                }),
            }));
            setDocuments((prevDocs) => [...prevDocs, ...newDocuments]);
    
            try {
                const response = await axios.post(
                    "http://localhost:8000/upload_file_to_collection/",
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
    
                // Display the response messages for each uploaded file
                const messages = response.data.uploaded_files.map((file) => ({
                    text: `<strong>${file.filename}</strong>: ${file.message}`,
                    sender: "bot",
                    isHTML: true,
                }));
    
                // Include any error messages
                if (response.data.errors && response.data.errors.length > 0) {
                    response.data.errors.forEach((error) => {
                        messages.push({
                            text: `<strong>${error.filename}</strong>: ${error.error}`,
                            sender: "bot",
                            isHTML: true,
                        });
                    });
                }
    
                setMessages((prevMessages) => [...prevMessages, ...messages]);
            } catch (error) {
                console.error("Error uploading files:", error);
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { text: "Failed to process files. Please try again.", sender: "bot" },
                ]);
            }
        } else {
            console.warn("No chat initialized or files selected.");
        }
    };
    
          
    
    const handleViewAllDocs = () => {
        setShowDocuments(true);
    };


    // Scroll to the bottom of the chat window
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);  // Dependency on messages means this runs every time messages update

    return (
        <div className="chatbot-container">
            <Header onViewAllDocs={handleViewAllDocs} chatName={chatName} />
            {!hasUploadedFiles && <FileUploadArea onFileUploaded={handleFileUploaded} />}
            {showDocuments && <DocumentPanel documents={documents} onClose={() => setShowDocuments(false)} />}
            <div className="chat-messages">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.sender}`}>
                        {message.sender === 'bot' && (
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <img src={botResponseIcon} alt="Bot" style={{ marginRight: '15px' }} />
                                {message.isHTML ? (
                                    // Render HTML content safely for bot responses
                                    <span dangerouslySetInnerHTML={{ __html: message.text }} />
                                ) : (
                                    // Render plain text
                                    <span>{message.text}</span>
                                )}
                            </div>
                        )}
                        {message.sender === 'user' && (
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                {message.isFile && <img src={message.icon || fileUploadIcon} alt="File Icon" style={{ marginRight: '10px' }} />}
                                {message.isFile ? (
                                    <a href={message.fileUrl} target="_blank" rel="noopener noreferrer">{message.text}</a>
                                ) : (
                                    <span>{message.text}</span>
                                )}
                            </div>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <QueryInput
                onSendMessage={handleSendMessage}
                currentInput={currentInput}
                onInputChange={handleInputChange}
                onFileUploaded={onFileUploaded}
            />
        </div>
    );            
};
export default Chatbot;

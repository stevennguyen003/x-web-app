import React, { useState } from 'react';
import { FileUploader } from "react-drag-drop-files";
import ReactDOM from 'react-dom';

// Props used for the modal
interface NewGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (groupName: string, file: File | null) => void;
    onJoin: (groupCode: string) => void;
}
// Modal for either creating or joining a group
const NewGroupModal: React.FC<NewGroupModalProps> = ({ isOpen, onClose, onSubmit, onJoin }) => {
    // State to hold user uploaded files
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    // State to hold inputted group name for creating a group
    const [groupName, setGroupName] = useState("");
    // State to hold invite link when joining a group
    const [inviteCode, setInviteCode] = useState("");
    // State to represent which tab user is on
    const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');

    if (!isOpen) return null;

    const handleFileChange = (file: File) => {
        setSelectedFile(file);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        if (id === "nameInput") {
            setGroupName(value);
        } else if (id === "codeInput") {
            setInviteCode(value);
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (activeTab === 'create') {
            onSubmit(groupName, selectedFile);
        } else {
            onJoin(inviteCode);
        }
        onClose();
    };

    return ReactDOM.createPortal(
        <div className="create-group-modal-overlay">
            <div className="create-group-modal-content">
                <div className="create-group-modal-tabs">
                    <button
                        className={`tab-button ${activeTab === 'create' ? 'active' : ''}`}
                        onClick={() => setActiveTab('create')}
                    >
                        Create
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'join' ? 'active' : ''}`}
                        onClick={() => setActiveTab('join')}
                    >
                        Join
                    </button>
                </div>
                {/* <h2 className="create-group-modal-title">
                    {activeTab === 'create' ? 'Create a new group!' : 'Join a group!'}
                </h2> */}
                <form onSubmit={handleSubmit}>
                    {activeTab === 'create' ? (
                        <>
                            <div className="form-group">
                                <label htmlFor="nameInput" className="create-group-label">Group Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="nameInput"
                                    value={groupName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="materialInput" className="create-group-label">Material</label>
                                <FileUploader
                                    handleChange={handleFileChange}
                                    name="file"
                                    id="materialInput"
                                />
                            </div>
                        </>
                    ) : (
                        <div className="form-group">
                            <label htmlFor="codeInput" className="create-group-label">Invite Code</label>
                            <input
                                type="text"
                                className="form-control"
                                id="codeInput"
                                value={inviteCode}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    )}
                    <div className="pfp-modal-button-set">
                        <button type="button" onClick={onClose} className="btn btn-light">Cancel</button>
                        <button type="submit" className="btn btn-primary">
                            {activeTab === 'create' ? 'Create Group' : 'Join Group'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default NewGroupModal;
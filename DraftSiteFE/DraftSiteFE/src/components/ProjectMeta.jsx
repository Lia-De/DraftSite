import { useState } from "react";
import { PROJECT_STATUS_LABELS } from "../constants/projectStatus.js";
import { GrEdit } from "react-icons/gr";

export default function ProjectMeta({project, showMeta, setUiState, onChange}) {
    const [editMode, setEditMode] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(project.status);

    const formatDate = (date) =>
        date ? new Date(date).toLocaleDateString("sv-SE") : "—";

    const updateStatus = () => {
        onChange(selectedStatus);
        console.log("Updating status to:", selectedStatus);
        // After successful update:
        setEditMode(false);
    }

    const handleStatusChange = (e) => {
        setSelectedStatus(Number(e.target.value));
    }
    
    return showMeta ? (
    <div className="projectMeta">
        <p className="error"  onClick={() => setUiState(prev => ({...prev, showMeta: false}))}>X</p>
        <p className="metaStatus">
            Status: {editMode ? (
                <select 
                    className="opt"
                    value={selectedStatus} 
                    onChange={handleStatusChange}
                    onClick={(e) => e.stopPropagation()}
                >
                    {Object.entries(PROJECT_STATUS_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                    ))}
                </select>
            ) : (
                PROJECT_STATUS_LABELS[project.status] ?? "Odefinerat"
            )}
            <GrEdit 
                className="icon btnUpdateMeta" 
                onClick={(e) => {
                    e.stopPropagation();
                    if (editMode) {
                        updateStatus();
                    } else {
                        setEditMode(true);
                    }
                }}
            />
            </p>
        <p className="metaCreated">
            Skapat: {formatDate(project.createdAt)}</p>
        {project.lastUpdatedAt && 
            <p className="metaUpdated">
                Uppdaterat: {formatDate(project.lastUpdatedAt)}</p>}
        {project.finishedAt && 
            <p className="metaFinished">
                Färdig: {formatDate(project.finishedAt)}</p>}
    </div>
    ) : 
     (
    <div className="projectMetaLink" 
      onClick={()=> setUiState(prev => ({...prev, showMeta: !prev.showMeta}))}> 
        visa info 
    </div>
    )
}
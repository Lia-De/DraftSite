import { PROJECT_STATUS_LABELS } from "../constants/projectStatus.js";
export default function ProjectMeta({project, showMeta, setUiState}) {
    const formatDate = (date) =>
        date ? new Date(date).toLocaleDateString("sv-SE") : "—";

    
    return showMeta ? (
    <div className="project-meta" onClick={() => setUiState(prev => ({...prev, showMeta: false}))}>
        <p className="meta-status">
            Status: {PROJECT_STATUS_LABELS[project.status] ?? "Odefinerat"}</p>
        <p className="meta-created">
            Skapat: {formatDate(project.createdAt)}</p>
        {project.lastUpdatedAt && 
            <p className="meta-updated">
                Uppdaterat: {formatDate(project.lastUpdatedAt)}</p>}
        {project.finishedAt && 
            <p className="meta-finished">
                Färdig: {formatDate(project.finishedAt)}</p>}
    </div>
    ) : 
     (
    <div className="project-meta-link" 
      onClick={()=> setUiState(prev => ({...prev, showMeta: !prev.showMeta}))}> 
        visa info 
    </div>
    )
}
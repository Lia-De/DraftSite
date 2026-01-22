import { PROJECT_STATUS_LABELS } from "../constants/projectStatus.js";
import { GrEdit } from "react-icons/gr";

export default function ProjectMeta({project, showMeta, setUiState}) {
    const formatDate = (date) =>
        date ? new Date(date).toLocaleDateString("sv-SE") : "—";

    const updateStatus = (data) => {
        console.log(data);
    }
    
    return showMeta ? (
    <div className="projectMeta" onClick={() => setUiState(prev => ({...prev, showMeta: false}))}>
        <p className="metaStatus">
            Status: {PROJECT_STATUS_LABELS[project.status] ?? "Odefinerat"}
            <GrEdit className="icon btnUpdateMeta" onClick={updateStatus}/>
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
import "../css/ProjectView.css";
import { Link, useParams } from "react-router";
import React, { useEffect, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import { projectListAtom } from "../atoms/projectListAtom.js";
import { RiExpandLeftFill } from "react-icons/ri";
import EndsBoxes from "../components/WarpingEndsBoxes.jsx";
import ProjectMeta from "../components/ProjectMeta.jsx";
import YarnInfoShort from "../components/YarnInfoShort.jsx";
import ShowYarnList from "../components/ShowYarnList.jsx";
import UpdateProjectMetrics from "../components/UpdateProjectMetrics.jsx";
import { MdInfoOutline } from "react-icons/md";
import { getById } from "../services/APICalls.js";
import { defaultYarn } from "../constants/yarnConstants.js";


export default function ProjectView() {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);

    const [warp, setWarp] = useState({...defaultYarn});
    const [weft, setWeft] = useState({...defaultYarn});
    
    const [uiState, setUiState] = useState({
        isLoading: false,
        loadingError: null,
        showMeta: false,
        forceReload: false,
        warpAsWeft: false,
    });
    
    const projectList = useAtomValue(projectListAtom);

    const fetchProjectById = async () => {
      setUiState(prevState => ({...prevState, isLoading: true}));
      try {
          const response = await getById('projects', projectId)
          
          setProject(response);
            // Fetch warp yarn details, first one with the type Warp (0)
            const warpYarn = response.yarns.find(
            (yarn) => yarn.usageType === 0
          );
          if (warpYarn) {
            setWarp(warpYarn);
          }
          // Fetch weft yarn details, first one with the type Weft (1)
          const weftYarn = response.yarns.find(
            (yarn) => yarn.usageType === 1
          );
          if (weftYarn) 
            setWeft(weftYarn)
          else {
            setWeft(warpYarn);
            setUiState(prev => ({...prev, warpAsWeft: true}))
          }
         
          
      } catch (error) {
          console.error("Error fetching project:", error);
          setUiState(prevState => ({...prevState, loadingError: "Hittade inte projektet."}));

      } finally {
          setUiState(prevState => ({...prevState, isLoading: false}));
      }
    }

    useEffect(() => {
      if (uiState.forceReload == true) {
        fetchProjectById(projectId);
        setUiState(prev => ({...prev, forceReload: false}))
      }
    }, [uiState.forceReload]);

    useEffect(() => {
        if (projectList && projectId) {
            const foundProject = projectList.find(p => p.id.toString() === projectId.toString());
            setProject(foundProject || null);

        fetchProjectById();
      }

    }, [projectList, projectId]);

    if (!project) return (
      uiState.loadingError 
      ? <p>{uiState.loadingError} <Link to="/"><RiExpandLeftFill /> Tillbaka till framsidan</Link></p> 
      : <p>Laddar projekt... {uiState.loadingError}</p>);


  return (
    <div>
      <Link to="/"><RiExpandLeftFill /> Tillbaka </Link>


    <section id="project-detail">
      <h2>{project.name}</h2>
      <p className="desc">{project.description || "—"}</p>
      
      <ProjectMeta project={project} showMeta={uiState.showMeta} setUiState={setUiState} />     

      <div className="yarn-metrics-warp">
        <h2>Varpgarn</h2>
        <YarnInfoShort yarn={warp} />
      </div>
      
      <div className="yarn-metrics-weft">
        <h2>Inslagsgarn {uiState.warpAsWeft && 
          (<MdInfoOutline className="icon" title="Varpgarn används även som inslag" />)}
        </h2>
        <YarnInfoShort yarn={weft} />
      </div>
      <div className="yarn-calculations">

        <div id="warp-metrics-grid">
          <p>Vävbredd (cm)</p>
          <p>EPC </p>
          <p>Längd (m)</p>
          <p>Trådar</p>

          <p className="opt">{project.widthInput ? project.weavingWidthCm : project.effectiveWeavingWidthCm} </p>
          <p className="opt">{project.endsPerCm}</p>
          <p className="opt">{project.warpLengthMeters} </p>
          <p className="opt">{project.totalEndsInWarp}</p>

          <UpdateProjectMetrics project={project} setUiState={setUiState} warp={true}/>

          <p className="span2"></p>
          <p>Åtgång varp (m)</p>
          <p>Åtgång nystan</p>

          <p className="span2"> </p>
          <p className="opt">{project.totalWarpLengthMeters} </p>
          <p className="opt">{(project?.totalWarpLengthMeters / warp?.lengthPerSkeinMeters).toFixed(2)}</p>

          <p> </p>
          <p> PPC </p>
          <p>Åtgång inslag (m)</p>
          <p>Åtgång nystan</p>

          <p>  </p>
          <p className="opt">{project.picksPerCm}</p>
          <p className="opt">{project.totalWeftLengthMeters} </p>
          <p className="opt"> {(project?.totalWeftLengthMeters / weft?.lengthPerSkeinMeters).toFixed(2) } </p>

          <UpdateProjectMetrics project={project} setUiState={setUiState} warp={false}/>

        </div>  
      </div>
      <hr />     
      <h3>Varpa - räkning</h3>

      <EndsBoxes totalEnds={project?.totalEndsInWarp ?? 0} />

    </section>
    <section className="page-break">
      <h3>Garn i projektet</h3>

      <ShowYarnList yarnList={project.yarns} />


    </section>

    </div>
  );
}

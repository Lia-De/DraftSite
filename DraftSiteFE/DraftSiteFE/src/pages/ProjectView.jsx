import "../css/ProjectView.css";
import { Link, useParams } from "react-router";
import logo from '../assets/weave-svgrepo-com.svg';
import React, { useEffect, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import { projectListAtom } from "../atoms/projectListAtom.js";
import { RiExpandLeftFill } from "react-icons/ri";
import ProjectMeta from "../components/ProjectMeta.jsx";
import YarnInfoShort from "../components/YarnInfoShort.jsx";
import ShowYarnList from "../components/ShowYarnList.jsx";
import UpdateProjectMetrics from "../components/UpdateProjectMetrics.jsx";
import UpdateProjectInfo from "../components/UpdateProjectInfo.jsx";
import { MdInfoOutline } from "react-icons/md";
import { deleteItem, getById, update } from "../services/APICalls.js";
import { currentProjectAtom } from "../atoms/currentProjectAtom.js";
import WarpingHelp from "../components/WarpingHelp.jsx";
import ShowWarpChains from "../components/ShowWarpChains.jsx";
import YarnEditing from "../components/YarnEditing.jsx";
import { GrEdit } from "react-icons/gr";
import AddNewYarn from "../components/AddNewYarn.jsx";
import { MdAddCircleOutline } from "react-icons/md";

export default function ProjectView() {
    const { projectId } = useParams();
    const [project, setProject] = useAtom(currentProjectAtom)

    const [warp, setWarp] = useState(null);
    const [weft, setWeft] = useState(null);
    
    const [uiState, setUiState] = useState({
        isLoading: false,
        loadingError: null,
        showMeta: false,
        forceReload: false,
        warpAsWeft: false,
        yarnEditing: false,
        addYarn: false,
        yarnToEdit: null
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
    const onWarpChainDelete = async (chainId) => {
      try {
        const res = await deleteItem("Projects/warpchain", chainId);
      } catch (error) {
        console.error("Error deleting warp chain:", error);
      } finally {
        setUiState(prev => ({...prev, forceReload: true}));
      }
    }
    const onUpdateStatus = async (newStatus) => {
      try {
      const res = await update('projects/status', {projectId: project.id, status: newStatus})
      } catch (error) {
        console.error('error updating status: ', error)
      } finally {
        setUiState(prev => ({...prev, forceReload: true}))
      } 
    }
    const onYarnChanges = async (editedYarn) => {
      try {
        const res = await update('Yarns', editedYarn);
      }
      catch (error) {
        console.log('onYarnChanges error: ', res)
      } finally {
        setUiState(prev => ({...prev, forceReload: true}))
      }
    }
    const onYarnAdded = (newYarn) => {
      console.log('add new yarn:', newYarn)
      setUiState(prev => ({...prev, addYarn: false}))
      setUiState(prev => ({...prev, forceReload: false}))
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
    <h1 className="headerfontBold">
        Lias <img src={logo} alt="logo" height="36px" /> Vävnota
    </h1>
      <Link to="/" className="printHidden"><RiExpandLeftFill /> Tillbaka </Link>


    <section id="projectDetail">
      <h2 className="visuallyHidden">{project.name}</h2>
      <UpdateProjectInfo project={project} setUiState={setUiState} name={true}/>
      
      <UpdateProjectInfo project={project} setUiState={setUiState} description={true}/>
      
      <ProjectMeta project={project} showMeta={uiState.showMeta} setUiState={setUiState} onChange={onUpdateStatus}/>     

      {uiState.yarnEditing &&
        <YarnEditing 
          yarn={uiState.yarnToEdit} 
          hide={()=> setUiState(prev => ({...prev, yarnEditing: false}))}
          onChange={onYarnChanges} 
        />}

      {!uiState.yarnEditing &&
      <>
      <div className="yarnMetricsWarp">
        <h2>Varpgarn 
          <button className="submitBtn printHidden" onClick={() => 
            setUiState(prev => ({...prev, yarnEditing: true, yarnToEdit: warp}))} >
                <GrEdit />
          </button>
        </h2>
      
       <YarnInfoShort yarn={warp} />

      </div>

      <div className="yarnMetricsWeft">
        <h2>Inslagsgarn {uiState.warpAsWeft ? 
          (<MdInfoOutline className="icon" title="Varpgarn används även som inslag" />) 
          : <button className="submitBtn printHidden" onClick={() => 
            setUiState(prev => ({...prev, yarnEditing: true, yarnToEdit: weft}))} >
                <GrEdit />
          </button>}
        </h2>
        <YarnInfoShort yarn={weft} warpAsWeft={uiState.warpAsWeft} />
      </div>
      </>
      }

      <div className="yarnCalculations">

        <div id="warpMetricsGrid" >
          <p>Vävbredd (cm)</p>
          <p>EPC </p>
          <p>Längd (m)</p>
          <p>Trådar</p>
          <UpdateProjectMetrics project={project} setUiState={setUiState} warp={true}/>

          <p className="col3">Åtgång varp (m)</p>
          <p>Åtgång nystan</p>
          <p className="col3 opt optComputed">{project.calculatedWarpLengthMeters} </p>
          <p className="opt optComputed">{(project?.calculatedWarpLengthMeters / warp?.lengthPerSkeinMeters).toFixed(2)}</p>

          
          <p className="col2"> PPC </p>
          <p>Åtgång inslag (m)</p>
          <p>Åtgång nystan</p>
          <UpdateProjectMetrics project={project} setUiState={setUiState} warp={false}/>
          <p className="opt optComputed">{project.totalWeftLengthMeters} </p>
          <p className="opt optComputed"> {(project?.totalWeftLengthMeters / weft?.lengthPerSkeinMeters).toFixed(2) } </p>
        </div>  
        
      </div>
      <hr />     
      <h3>Varpa - räkning</h3>
      <WarpingHelp project={project} onChainCreated={() => setUiState(prev => ({...prev, forceReload: true}))} />
    </section>

    <section className="pageBreak">
      
      {project.warpChains?.length > 0 && 
        <div className="warpChainsSaved">
          <h3>Sparade Varpkedjor med totalt {project.warpChainEndsInWarp} trådar</h3>
          <ShowWarpChains chains={project.warpChains} onDelete={onWarpChainDelete} />
          </div>
      }
      <h3>Garn i projektet</h3>
      <ShowYarnList yarnList={project.yarns} />
      
      {!uiState.addYarn ? (
      <button className="col2" onClick={ () => 
      setUiState(prev => ({...prev, addYarn: true})) }>
        <MdAddCircleOutline  /> Nytt garn
      </button>
      ) : <AddNewYarn onSubmit={onYarnAdded} projectId={projectId} />}
    </section>

    </div>
  );
}

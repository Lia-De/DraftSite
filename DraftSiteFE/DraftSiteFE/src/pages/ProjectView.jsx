import "../css/ProjectView.css";
import { Link, useParams } from "react-router";
import React, { useEffect, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import axios from "axios";
import { projectListAtom } from "../atoms/projectListAtom.js";
import { RiExpandLeftFill } from "react-icons/ri";
import EndsBoxes from "../components/WarpingEndsBoxes.jsx";
import ProjectMeta from "../components/ProjectMeta.jsx";
import YarnInfoShort from "../components/YarnInfoShort.jsx";
import ShowYarnList from "../components/ShowYarnList.jsx";
import UpdateProjectMetrics from "../components/UpdateProjectMetrics.jsx";


export default function ProjectView() {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [warp, setWarp] = useState({
      id: '',
      usageType: '',
      brand: '',
      color: '',
      colorCode: '',
      dyeLot: '',
      fibreType: '',
      ply: '',
      thicknessNM: '',
      notes: '',
      weightPerSkeinGrams: '',
      lengthPerSkeinMeters: '',
      numberOfSkeins: '',
      pricePerSkein: '',
      totalWeightGrams: '',
      totalLengthMeters: '',
      totalPrice: ''
    });
    const [weft, setWeft] = useState({
      id: '',
      usageType: '',
      brand: '',
      color: '',
      colorCode: '',
      dyeLot: '',
      fibreType: '',
      ply: '',
      thicknessNM: '',
      notes: '',
      weightPerSkeinGrams: '',
      lengthPerSkeinMeters: '',
      numberOfSkeins: '',
      pricePerSkein: '',
      totalWeightGrams: '',
      totalLengthMeters: '',
      totalPrice: ''
    });
    
    const [uiState, setUiState] = useState({
        isLoading: false,
        loadingError: null,
        showMeta: false,
        forceReload: false,
    });
    
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const projectList = useAtomValue(projectListAtom);

    const fetchProjectById = async () => {
      setUiState(prevState => ({...prevState, isLoading: true}));
      try {
          const response =  await axios.get(`${API_BASE_URL}/projects/${projectId}`);
          setProject(response.data);

            // Fetch warp yarn details, first one with the type Warp (0)
            const warpYarn = response.data.yarns.find(
            (yarn) => yarn.usageType === 0
          );
          if (warpYarn) {
            setWarp(warpYarn);
          }
          // Fetch weft yarn details, first one with the type Weft (1)
          const weftYarn = response.data.yarns.find(
            (yarn) => yarn.usageType === 1
          );
          setWeft(weftYarn ? weftYarn : warpYarn);
          
          
      } catch (error) {
          console.error("Error fetching project:", error);
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

    if (!project) return null;


  return (
    <div>
      <Link to="/"><RiExpandLeftFill /> Tillbaka </Link>


    <section id="project-detail">
      <h2>{project.name}</h2>
      <p className="desc">{project.description || "—"}</p>
      
      <ProjectMeta project={project} showMeta={uiState.showMeta} setUiState={setUiState} />     

      <div className="yarn-metrics">
        <h2>Varpgarn</h2>
        <YarnInfoShort yarn={warp} />
      </div>
      
      <div className="yarn-metrics">
        <h2>Inslagsgarn</h2>
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

          <UpdateProjectMetrics project={project} setUiState={setUiState}/>

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
        </div>  
        </div>
      <hr />     
      <h3>Varpa - räkning</h3>

      <EndsBoxes totalEnds={project?.totalEndsInWarp ?? 0} />

    </section>
    <section>
      <h3>Garn i projektet</h3>

      <ShowYarnList yarnList={project.yarns} />


    </section>

    </div>
  );
}

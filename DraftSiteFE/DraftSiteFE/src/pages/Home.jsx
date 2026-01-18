import axios from "axios";
import { useAtom } from "jotai";
import { projectListAtom } from "../atoms/projectListAtom.js";
import React, { useEffect, useState } from "react";
import { RxUpdate } from "react-icons/rx";
import { MdExpandMore } from "react-icons/md";
import { MdExpandLess } from "react-icons/md";

import AdminYarnValidationSetting from "../components/AdminYarnValidationSetting.jsx";
import ShowProjectList from "../components/ShowProjectList.jsx";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Home() {

const [uiState, setUiState] = useState({
    yarnCount: 0,
    projectCount: 0,
    warpChainCount: 0,
    isLoading: false,
    loadingError: null,
    adminView: false,
    projectListView: false
});
const [yarnValidationConstants, setYarnValidationConstants]= useState({
           PlyMin: 1,
            PlyMax: 10,
            ThicknessMin: 5,
            ThicknessMax: 50,
    });
    
    const [fetchCategory, setFetchCategory] = useState(null);
    
    const [projectList, setProjectList] = useAtom(projectListAtom);


    // When fetchCategory is set - fetch that category of data
    useEffect(() => {
        if (!fetchCategory) return;
        const fetchData = async () => {
            setUiState(prevState => ({...prevState, isLoading: true}));
            try {
                const response =  await axios.get(`${API_BASE_URL}/${fetchCategory}`);
                // console.log(`Fetched ${fetchCategory} data:`, response.data);
                if (fetchCategory === "Yarns") {
                    // Example: process yarn data
                    const yarns = response.data;
                    setUiState(prevState => ({
                        ...prevState,
                        yarnCount: yarns.length,
                    }));
                }
                if (fetchCategory === "Projects") {
                    const projects = response.data;
                    setProjectList(projects);
                    setUiState(prevState => ({
                        ...prevState,
                        projectCount: projects.length,
                    }));
                }
                if (fetchCategory === "WarpChains") {
                    const warpChains = response.data;
                    setUiState(prevState => ({
                        ...prevState,
                        warpChainCount: warpChains.length,
                    }));
                }
                if (fetchCategory === "admin/yarn-validation") {
                    setYarnValidationConstants({
                        PlyMin: response.data.plyMin,
                        PlyMax: response.data.plyMax,
                        ThicknessMin: response.data.thicknessMin,
                        ThicknessMax: response.data.thicknessMax,
                    });
                }
            } catch (err) {
                console.error(`Error fetching ${fetchCategory} data:`, err);
                setUiState(prevState => ({...prevState, loadingError: err.message || "Unknown error"}));
            }
            finally {
                setUiState(prevState => ({...prevState, isLoading: false}));
                setFetchCategory(null);
            }
        }
        fetchCategory!==null && fetchData();

        
    }, [fetchCategory]);

    useEffect(() => {
        console.log("Project list updated:", projectList );
        projectList?.length!=0 && setUiState(prev => ({...prev, projectCount: projectList?.length}))
    }, [projectList]);

    const onFetchRequest = (category) => {
        setUiState(prev => ({...prev, loadingError: null, isLoading: true}));
        setFetchCategory(category);
    }
    // on load, fetch yarn validation constants
    useEffect(() => {
        setFetchCategory("admin/yarn-validation");
    }, []);
    


return (
    <div className="home-container">
        <h1 className="headerfont-bold">Hämta data</h1>
        {uiState.loadingError && <p style={{color: 'red'}}>Error: {uiState.loadingError}</p>}

        <section>
            <button onClick={() => onFetchRequest("Projects")}>
                Hämta projekt 
                {': ' + uiState.projectCount} 
                {uiState.isLoading && fetchCategory==="Projects" ? <RxUpdate /> : ""}
            </button>
            <button onClick={() => onFetchRequest("Yarns") }>
                Hämta garn 
                {': ' + uiState.yarnCount} 
                {uiState.isLoading && fetchCategory==="Yarns" ? <RxUpdate /> : ""}
            </button>
            <button onClick={() => onFetchRequest("WarpChains") }>
                Varpflätor 
                {': ' + uiState.warpChainCount} 
                {uiState.isLoading && fetchCategory==="WarpChains" ? <RxUpdate /> : ""}
            </button>
        </section>
        <section>
            <button className="btn-toggle" 
            onClick={() => setUiState(prev => ({...prev, projectListView: !prev.projectListView}))}>
                {uiState.projectListView 
                ? (<> <MdExpandLess />Dölj projektlista </>) 
                : (<> <MdExpandMore /> Visa projektlista </>)}
            </button>

            <button className="btn-toggle" onClick={() => setUiState(prev => ({...prev, adminView: !prev.adminView}))}>
            {uiState.adminView 
            ? (<><MdExpandLess /> Stäng admin vy</>) 
            : (<><MdExpandMore /> Visa admin vy</>)}
            </button>
        </section>
            {projectList && projectList.length>0 && uiState.projectListView  && <ShowProjectList />}
            {uiState.adminView && 
            <AdminYarnValidationSetting 
            onFetchRequest={onFetchRequest}
            yarnValidationConstants={yarnValidationConstants}
            />}

    </div>
    );
}
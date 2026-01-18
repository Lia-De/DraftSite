import axios from "axios";
import { useAtom } from "jotai";
import { projectListAtom } from "../atoms/projectListAtom.js";
import React, { useEffect, useState } from "react";
import { RxUpdate } from "react-icons/rx";
import { MdExpandMore } from "react-icons/md";
import { MdExpandLess } from "react-icons/md";

import AdminYarnValidationSetting from "../components/AdminYarnValidationSetting.jsx";
import ShowProjectList from "../components/ShowProjectList.jsx";
import { getAll } from "../services/APICalls.js";
import ShowYarnList from "../components/ShowYarnList.jsx";

export default function Home() {

const [uiState, setUiState] = useState({
    yarnCount: 0,
    projectCount: 0,
    warpChainCount: 0,
    isLoading: false,
    loadingError: null,
    adminView: false,
    projectListView: false,
    yarnListView: false,
});
const [yarnValidationConstants, setYarnValidationConstants]= useState({
           PlyMin: 1,
            PlyMax: 10,
            ThicknessMin: 5,
            ThicknessMax: 50,
    });
    
    const [fetchCategory, setFetchCategory] = useState(null);
    
    const [projectList, setProjectList] = useAtom(projectListAtom);
    const [yarnList, setYarnList] = useState(null);


    // When fetchCategory is set - fetch that category of data
    useEffect(() => {
        if (!fetchCategory) return;
        const fetchData = async () => {
            setUiState(prevState => ({...prevState, isLoading: true}));
            try {
                const response =  await getAll(fetchCategory)
                if (fetchCategory === "Yarns") {
                    // Example: process yarn data
                    const yarns = response;
                    setYarnList(yarns);
                    setUiState(prevState => ({
                        ...prevState,
                        yarnCount: yarns.length,
                    }));
                }
                if (fetchCategory === "Projects") {
                    const projects = response;
                    setProjectList(projects);
                    setUiState(prevState => ({
                        ...prevState,
                        projectCount: projects.length,
                    }));
                }
                if (fetchCategory === "WarpChains") {
                    const warpChains = response;
                    setUiState(prevState => ({
                        ...prevState,
                        warpChainCount: warpChains.length,
                    }));
                }
                if (fetchCategory === "admin/yarn-validation") {
                    setYarnValidationConstants({
                        PlyMin: response?.plyMin,
                        PlyMax: response?.plyMax,
                        ThicknessMin: response?.thicknessMin,
                        ThicknessMax: response?.thicknessMax,
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
        <section>   {/* Buttons to select expanded information */}
            <button className="btn-toggle" 
            onClick={() => setUiState(prev => ({...prev, projectListView: !prev.projectListView}))}>
                {uiState.projectListView 
                ? (<> <MdExpandLess />Dölj projektlista </>) 
                : (<> <MdExpandMore /> Visa projektlista </>)}
            </button>
            <button className="btn-toggle"
                onClick={() => setUiState(prev => ({...prev, yarnListView: !prev.yarnListView}))}>
                {uiState.yarnListView 
                ? (<> <MdExpandLess />Dölj Garnlista </>) 
                : (<> <MdExpandMore /> Visa Garnlista </>)                }
            </button>

            <button className="btn-toggle" onClick={() => setUiState(prev => ({...prev, adminView: !prev.adminView}))}>
            {uiState.adminView 
            ? (<><MdExpandLess /> Stäng admin vy</>) 
            : (<><MdExpandMore /> Visa admin vy</>)}
            </button>
        </section>
                {/* Display the expanded information checked from the Button section */}
            {projectList && projectList.length>0 && uiState.projectListView  && <ShowProjectList />}
            {yarnList && yarnList.length>0 && uiState.yarnListView && <ShowYarnList yarnList={yarnList}/>}
            {uiState.adminView && 
                <AdminYarnValidationSetting 
                    onFetchRequest={onFetchRequest}
                    yarnValidationConstants={yarnValidationConstants}
                />
                }

    </div>
    );
}
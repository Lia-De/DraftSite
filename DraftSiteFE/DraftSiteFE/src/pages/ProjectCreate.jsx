import { useState, useEffect } from "react";
import { Link } from "react-router";
import { RiExpandLeftFill } from "react-icons/ri";
import LoomProjectForm from "../components/LoomProjectForm";
import { create } from "../services/APICalls";
import { FiLoader } from "react-icons/fi";

export default function ProjectCreate() {
    const [uiState, setUiState] = useState({ 
        loading: false, 
        error: null,
        isCreated: false,
        createdProject: null,
     });

    const createProject = async (data) => {
        console.log("Creating project with data:", data);
        // Here you would typically send the data to your backend API
        try {
            setUiState({ ...uiState, loading: true, error: null });
            const response = await create("projects", data);
            setUiState({ ...uiState, isCreated: true, createdProject: response });

            
        } catch (error) {
            setUiState({ ...uiState, error: error.message });
        } finally {
            setUiState((prevState) => ({ ...prevState, loading: false }));
        }
        
    }

    return (
        <>
        <h1>Skapa projekt</h1>
        <Link to="/"><RiExpandLeftFill /> Tillbaka </Link>

        {uiState.error && 
        (<div>
            <p className="error">{uiState.error}</p>
            <button onClick={() => 
                setUiState({ ...uiState, isCreated: false, createdProject: null, error: null })}>
                Skapa nytt projekt
            </button>
        </div>
        )

        }
        {!uiState.error && !uiState.isCreated && <LoomProjectForm onSubmit={createProject} />}

        {uiState.loading && <p> Skapar projektet ... <FiLoader /> </p>}

        {uiState.isCreated && uiState.createdProject && (
            <div>
                <h2>Projekt skapat!</h2>
                <p>Projektet har nu skapats.</p>
                <button onClick={() => 
                    setUiState({ ...uiState, isCreated: false, createdProject: null })}>
                    Skapa nytt projekt
                </button>
                <h3>Projektdata:</h3>
                <pre>
                    {JSON.stringify(uiState.createdProject, null, 2)}
                </pre>
                <Link to={`/projects/${uiState.createdProject.id}`}>Gå till projektet</Link>

            </div>
        )}

        </>
    )
}

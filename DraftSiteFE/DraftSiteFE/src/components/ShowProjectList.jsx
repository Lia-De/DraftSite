import React from "react";
import { useAtom } from "jotai";
import { projectListAtom } from "../atoms/projectListAtom.js";
import { Link } from "react-router";

export default function ShowProjectList() {
    const [projectList] = useAtom(projectListAtom);
    return (
        <div>
            <h2>Projektlista</h2>
            <ul className="project-list">
                {projectList.map(project => (
                    <li key={project.id}>
                        <h3>
                           
                            <Link to={`/detail/${project.id}`}>  {project.name} </Link>
                        </h3>
                    <ul>
                        <li>{project.description}</li>
                        <li>Projekt skapat: {new Date(project.createdAt).toLocaleDateString("sv-SE")}</li>
                        <li>Projekt uppdaterat: {new Date(project.lastUpdatedAt).toLocaleDateString("sv-SE")}</li> 
                        {project.finishedAt && <li>Projekt avslutat: {new Date(project.finishedAt).toLocaleDateString("sv-SE")}</li>}
                    </ul>
                    </li>
                ))}
            </ul>
        </div>
    )
}
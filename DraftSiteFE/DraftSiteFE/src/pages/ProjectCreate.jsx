import { useState, useEffect } from "react";
import { Link } from "react-router";
import { RiExpandLeftFill } from "react-icons/ri";
import LoomProjectForm from "../components/LoomProjectForm";


export default function ProjectCreate() {

    const createProject = async (data) => {
        console.log("Creating project with data:", data);
        // Here you would typically send the data to your backend API
        
    }

    return (
        <>
        <h1>Skapa projekt</h1>
        <Link to="/"><RiExpandLeftFill /> Tillbaka </Link>


        <LoomProjectForm onSubmit={createProject} />


        </>
    )
}

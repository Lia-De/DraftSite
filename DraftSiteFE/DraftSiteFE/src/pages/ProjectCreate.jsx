import { useState, useEffect } from "react";
import { Link } from "react-router";
import { RiExpandLeftFill } from "react-icons/ri";
import LoomProjectForm from "../components/LoomProjectForm";
import '../css/projectCreate.css';

export default function ProjectCreate() {


    return (
        <>
        <h1>Skapa projekt</h1>
        <Link to="/"><RiExpandLeftFill /> Tillbaka </Link>


        <LoomProjectForm onSubmit={(data) => console.log("Project DTO:", data)} />


        </>
    )
}

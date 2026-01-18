import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Home() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            name: "",
            description: "",
            weaveStructure: "plain",
            tags: "",
            initSample: false,
        },
    });

    const [serverError, setServerError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleChange = (e) => {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        setInputs(values => ({...values, [name]: value}))
    }
    const onSubmit = async (data) => {
        setServerError(null);
        setSuccessMessage(null);

        const payload = {
            name: data.name.trim(),
            description: data.description.trim(),
            visibility: data.visibility,
            tags: data.tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
            repositoryUrl: data.repoUrl ? data.repoUrl.trim() : null,
            initSample: !!data.initSample,
        };
        console.log("Submitting payload:", payload);

        try {
            axios.get(`${API_BASE_URL}/Yarns`)
                .then(res => {
                    const yarndata = res.data;
                    console.log("Fetched yarn data:", yarndata);
                })
                .catch(err => {
                    console.error('Error fetching data:', err);
                });
        } catch (err) {
            setServerError(err.message || "Unknown error");
        }

    };

    return (
        <div style={{ maxWidth: 720, margin: "32px auto", padding: 16 }}>
            <h1 className="headerfont-bold">Skapa ny Vävnota</h1>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div style={{ marginBottom: 12 }}>
                    <label>
                        Project name
                        <input
                            type="text"
                            placeholder="My Loom Project"
                            {...register("name", { required: "Project name is required", minLength: { value: 3, message: "Name must be at least 3 characters" } })}
                            style={{ display: "block", width: "100%", padding: 8, marginTop: 6 }}
                        />
                    </label>
                    {errors.name && <div style={{ color: "red", marginTop: 4 }}>{errors.name.message}</div>}
                </div>

                <div style={{ marginBottom: 12 }}>
                    <label>
                        Description
                        <textarea
                            rows={4}
                            placeholder="Describe the project..."
                            {...register("description", { maxLength: { value: 1000, message: "Description is too long" } })}
                            style={{ display: "block", width: "100%", padding: 8, marginTop: 6 }}
                        />
                    </label>
                    {errors.description && <div style={{ color: "red", marginTop: 4 }}>{errors.description.message}</div>}
                </div>

                <div style={{ marginBottom: 12 }}>
                    <label>
                        Tags (comma separated)
                        <input
                            type="text"
                            placeholder="frontend, react, api"
                            {...register("tags")}
                            style={{ display: "block", width: "100%", padding: 8, marginTop: 6 }}
                        />
                    </label>
                </div>
                <div style={{ marginBottom: 12 }}>
                    <label>
                        Bindesätt
                        Tuskaft <input {...register("weaveStructure")} type="radio" value="plain" 
                            style={{ display: "block", width: "100%", padding: 8, marginTop: 6 }}/> 
                        Kypert <input {...register("weaveStructure")} type="radio" value="twill" 
                            style={{ display: "block", width: "100%", padding: 8, marginTop: 6 }}/> 
                        Satin <input {...register("weaveStructure")} type="radio" value="satin" 
                            style={{ display: "block", width: "100%", padding: 8, marginTop: 6 }}/> 
                    </label>
                </div>

                <div style={{ marginBottom: 16 }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <input type="checkbox" {...register("initSample")} />
                        Initialize with sample data
                    </label>
                </div>

                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <button type="submit" disabled={isSubmitting} style={{ padding: "8px 16px" }}>
                        {isSubmitting ? "Creating..." : "Create Project"}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            reset();
                            setServerError(null);
                            setSuccessMessage(null);
                        }}
                        style={{ padding: "8px 12px" }}
                    >
                        Reset
                    </button>
                    {successMessage && <div style={{ color: "green", marginLeft: 12 }}>{successMessage}</div>}
                    {serverError && <div style={{ color: "red", marginLeft: 12 }}>{serverError}</div>}
                </div>
            </form>

            <hr style={{ margin: "24px 0" }} />

        </div>
    );
}
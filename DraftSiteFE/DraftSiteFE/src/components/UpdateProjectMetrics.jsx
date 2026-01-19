import { useForm } from "react-hook-form";
import { update } from "../services/APICalls";
import { GrEdit } from "react-icons/gr";

export default function UpdateProjectMetrics ({project, setUiState, warp}) {
       
    function MetricForm({ label, fieldName, projectId, onSubmit }) {
        const { register, handleSubmit, reset, watch,  formState: { errors } } = useForm();

        const submit = (data) => {
            onSubmit({
            projectId,
            [fieldName]: data[fieldName],
            });
            reset();
        };
        const value = watch(fieldName);
        return (
            <div className="updateMetricsGrid">
            <form onSubmit={handleSubmit(submit)}>
                <input
                type="number"
                className="updateInput"
                {...register(fieldName, {min: {value: 1, message: "Måste vara positivt"}})}
                />
                <button type="submit" className="submitBtn"  disabled={!value}>
                    <GrEdit />
                    <span>{label}</span>
                    </button>
                
                {errors[fieldName] && (
                <p className="error">
                    {errors[fieldName].message}
                </p>
                )}
            </form>
            </div>
        );
    }
    const handleMetricSubmit = async (payload) => {
        
        try {
            const result = await update('Projects/update', payload);
        } catch (err) {
            console.error(`Error fetching ${fetchCategory} data:`, err);
            setUiState(prevState => ({...prevState, loadingError: err.message || "Unknown error"}));
        }  
        finally {
            setUiState(prevState => ({...prevState, isLoading: false}));
            setUiState(prev => ({...prev, forceReload: true}))
        }
    
    };

   return warp ?  (
    <>
        <MetricForm
        label="Bredd"
        fieldName="weavingWidthCm"
        projectId={project.id}
        onSubmit={handleMetricSubmit}
        />

        <MetricForm
        label="EPC"
        fieldName="endsPerCm"
        projectId={project.id}
        onSubmit={handleMetricSubmit}
        />

        <MetricForm
        label="Längd"
        fieldName="warpLengthMeters"
        projectId={project.id}
        onSubmit={handleMetricSubmit}
        />

        <MetricForm
        label="Trådar"
        fieldName="inputEndsInWarp"
        projectId={project.id}
        onSubmit={handleMetricSubmit}
        />
    </>
    )
    :  (
        <>
        <span></span>
        <MetricForm
            label="PPC"
            fieldName="picksPerCm"
            projectId={project.id}
            onSubmit={handleMetricSubmit}
        />
        </>
    );
    
}
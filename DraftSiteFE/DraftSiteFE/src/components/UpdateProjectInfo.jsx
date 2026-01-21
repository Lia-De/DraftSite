import { useForm } from "react-hook-form";
import { update } from "../services/APICalls";
import { GrEdit } from "react-icons/gr";

export default function UpdateProjectInfo ({project, setUiState, name=false, description=false}) {
       
    function InfoForm({ label, fieldName, defaultValue, projectId, onSubmit }) {
        const { register, handleSubmit, reset, watch,  
                formState: { errors, isDirty }} = useForm({
                            defaultValues: {[fieldName]: defaultValue}});

        const submit = (data) => {
            onSubmit({
            projectId,
            [fieldName]: data[fieldName],
            });
            reset({ [fieldName]: data[fieldName] });
        };
        const value = watch(fieldName);
        return (
            <form onSubmit={handleSubmit(submit)}>
                <input
                    className={name? "updateNameInput" : "updateDescInput desc"}
                {...register(fieldName, {required: "Fältet är obligatoriskt"})}
                />
                <button type="submit" className="submitBtn printHidden"  disabled={!isDirty}>
                    <GrEdit />
                </button>
                
                {errors[fieldName] && (
                <p className="error"> 
                    {errors[fieldName].message}
                </p>
                )}
            </form>
        );
    }
    const handleInfoSubmit = async (payload) => {
        
        try {
            const result = await update('Projects/update', payload);
        } catch (err) {
            console.error(`Error fetching project data:`, err);
            setUiState(prevState => ({...prevState, loadingError: err.message || "Unknown error"}));
        }  
        finally {
            setUiState(prevState => ({...prevState, isLoading: false}));
            setUiState(prev => ({...prev, forceReload: true}))
        }
    
    };

   return name? (
        <div className="updateInfoContainer">
        <InfoForm
            label="Namn"
            fieldName="name"
            defaultValue={project.name}
            projectId={project.id}
            onSubmit={handleInfoSubmit}
        />
        </div>
    ) : (
    description ? (
        <div className="updateInfoContainer">
        <InfoForm
            label="Beskrivning"
            fieldName="description"
            defaultValue={project.description}
            projectId={project.id}
            onSubmit={handleInfoSubmit}
        />
        </div>
    ) : (
        <p className="desc">Okänd information</p>
    ));
}
import YarnForm from "./YarnForm";
import styles from './LoomProjectForm.module.css';
import { useForm } from "react-hook-form";
import { defaultYarn } from "../constants/yarnConstants";
import { MdAddCircleOutline } from "react-icons/md";


export default function AddNewYarn({onSubmit, projectId}){
  const { register, handleSubmit, formState: { errors, isValid } } = 
  useForm({mode:"onChange",
    defaultValues: {...defaultYarn, loomProjectId: projectId}});

return (
        <form className="addYarnForm" onSubmit={handleSubmit(onSubmit)}>
        
        <YarnForm
            register={register}
            errors={errors}
            styles={styles}
        />

        <button className="col2" type="submit" disabled={!isValid}>
        <MdAddCircleOutline  /> Lägg till garn
        </button>
        </form>
    )
}
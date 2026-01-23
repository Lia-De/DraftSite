import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import styles from './LoomProjectForm.module.css';
import YarnForm from "./YarnForm";

export default function YarnEditing({yarn, hide, onChange}) {

    const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm();

    useEffect(() => {
        if (yarn) {
            reset(yarn);
        }
    }, [yarn, reset]);

    const onSubmit = (data) => {
        if (isDirty) {
            onChange(data);
        }
            hide();
    }
    
    return !yarn ? (''): (
        <div className="yarnEditingContainer">
        <form className={styles.createForm} onSubmit={handleSubmit(onSubmit)}>
            <h3>Redigera {yarn?.brand}   
                <button type="submit" 
                    className="printHidden btnWarpingToggle" 
                    title="Spara ändringar och stäng">✓</button>
                <button
                    type="button"
                    className="btnWarpingToggle"
                    title="Återställ ändringar"
                    onClick={() => reset()}
                    disabled={!isDirty}
                    >
                    ↺
                </button>
            </h3>

            <YarnForm
                register={register}
                errors={errors}
                styles={styles}
            />

            </form>
        </div>
    )
}
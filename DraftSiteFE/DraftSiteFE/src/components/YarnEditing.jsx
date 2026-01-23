import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { GrEdit } from "react-icons/gr";
import styles from './LoomProjectForm.module.css';
import { FIBRE_TYPES, USAGE_TYPES } from "../constants/yarnConstants";


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
            <div key={yarn?.id} className={styles.yarnEntry}>
                <label className="span3">
                    Märke: 
                    <input className={styles.optLong} {...register("brand")} />
                </label>
                <label>
                    * Nm (tjocklek/trådar) <br />
                    <input className={styles.optHalf} type="number" 
                    {...register("thicknessNM", { valueAsNumber: true ,
                    required: "Tjocklek (Nm) är obligatoriskt",
                    min: { value: 1, message: "Tjocklek måste vara större än 0" }
                    })} />
                    /<input className={styles.optHalf} type="number" 
                    {...register("ply", { valueAsNumber: true ,
                    required: "Trådantal (Nm) är obligatoriskt",
                    min: { value: 1, message: "Trådar måste vara större än 0" }
                    })} />
                {/* Error messages */}
                {errors?.thicknessNM && (
                    <p className="error"> {errors.thicknessNM.message}</p>
                )}
                {errors?.ply && (
                    <p className="error">{errors.ply.message}</p>
                )}
                </label>
                <label>
                    Färg <br />
                    <input className={`opt ${styles.opt}`}{...register("color")} />
                </label>
                <label>
                    Färgkod / Färgbad <br />
                    <input className={`opt ${styles.opt}`} {...register("colorCode")} />
                    
                    <input className={`opt ${styles.opt}`} {...register("dyeLot")} />
                </label>
                <span className={styles.yarnEntry}>
                <h4>Nystan</h4>
                <label>
                    * Vikt (g)
                    <input className={`opt ${styles.opt}`} type="number" 
                    {...register("weightPerSkeinGrams", { valueAsNumber: true ,
                    required: "Vikt är obligatoriskt",
                    min: { value: 1, message: "Vikt måste vara större än 0" }
                    })} />
                    {errors?.weightPerSkeinGrams && (
                    <p className="error">
                        {errors.weightPerSkeinGrams.message}
                    </p>
                    )}
                </label>
                <label>
                    * Längd (m)
                    <input className={`opt ${styles.opt}`} type="number" 
                    {...register("lengthPerSkeinMeters", { valueAsNumber: true ,
                    required: "Längd är obligatoriskt",
                    min: { value: 1, message: "Längd måste vara större än 0" }
                    })} />
                {errors?.lengthPerSkeinMeters && (
                    <p className="error">
                    {errors.lengthPerSkeinMeters.message}
                    </p>
                )}
                </label>
                <label>
                    Pris
                    <input className={`opt ${styles.opt}`} type="number" 
                    {...register("pricePerSkein", { valueAsNumber: true })} />
                </label>
                    

                <label className="col1">
                Fiber:&nbsp;
                <select className={styles.optDouble}
                    {...register("fibreType", {
                    valueAsNumber: true
                    })}>
                    <option value="">Välj fiber</option>
                    {FIBRE_TYPES.map(opt => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                    ))}
                </select>
                </label>
                <label>
                Syfte:&nbsp;
                <select className={styles.optDouble}
                    {...register("usageType", {
                    valueAsNumber: true
                    })}
                >
                    <option value="">Välj alternativ</option>
                    {USAGE_TYPES.map(opt => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                    ))}
                </select>
                </label>
                <label>
                    * Nystan: 
                    <input className={styles.optHalf} type="number" 
                    {...register("numberOfSkeins", { valueAsNumber: true,
                        required: "Lägg till minst 1 nystan",
                        min: { value: 1, message: "Antal nystan måste vara 1 eller mer" }
                        })} />
                    {errors?.numberOfSkeins && (
                    <p className="error">
                        {errors.numberOfSkeins.message}
                    </p>
                    )}
                </label>
                </span>
                <label className="span3">
                    Anteckning
                    <input className={styles.optLong} {...register("notes")} />
                </label>
                </div>       
            </form>
        </div>
    )
}
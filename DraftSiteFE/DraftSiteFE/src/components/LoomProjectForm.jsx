import React, { useState } from "react";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import { defaultYarn, USAGE_TYPES, FIBRE_TYPES } from "../constants/yarnConstants";
import { MdPlaylistRemove } from "react-icons/md";
import { MdAddCircleOutline } from "react-icons/md";
import styles from "./LoomProjectForm.module.css";
import YarnForm from "./YarnForm";

export default function LoomProjectForm({ onSubmit }) {
  const { register, control, watch, handleSubmit, formState: { errors, isValid } } = useForm({mode:"onChange",
    defaultValues: {
      name: null,
      description: null,
      owner: null,
      weavingWidthCm: null,
      inputEndsInWarp: null,
      endsPerCm: null,
      picksPerCm: null,
      warpLengthMeters: null,
      tags: [""],
      yarns: [
        {...defaultYarn}
      ]
    }
  });

  const { fields: tagFields, append: appendTag, remove: removeTag } = 
    useFieldArray({ control, name: "tags" });
  const { fields: yarnFields, append: appendYarn, remove: removeYarn } = 
    useFieldArray({ control, name: "yarns" });
  const { fields: chainFields, append: appendChain, remove: removeChain } = 
    useFieldArray({ control, name: "warpChains" });

    const calcFields = {};
    calcFields.endsPerCm = useWatch({control, name:"endsPerCm"});
    calcFields.weavingWidthCm = useWatch({control, name:"weavingWidthCm"});
    calcFields.picksPerCm = useWatch({control, name:"picksPerCm"});
    calcFields.warpLengthMeters = useWatch({control, name:"warpLengthMeters"});
    calcFields.lengthPerSkeinMeters = useWatch({control, name:"yarns.0.lengthPerSkeinMeters"});

    const totalEnds = calcFields.endsPerCm && calcFields.weavingWidthCm
    ? Math.round(calcFields.endsPerCm * calcFields.weavingWidthCm)
    : null;

  const [uiLabel, setUiLabel] = useState({
    totalWarpLength: null,
    totalWeftLength: null,
    warpSkeins: null,
    weftSkeins: null,
  })
  React.useEffect(() => {
    // Calculate total warp length and skeins
    if (calcFields.endsPerCm && calcFields.weavingWidthCm) {
      const totalWarpLength = (calcFields.endsPerCm * calcFields.weavingWidthCm) * calcFields.warpLengthMeters; // Example calculation
      const warpSkeins = calcFields.lengthPerSkeinMeters 
        ?  (totalWarpLength / calcFields.lengthPerSkeinMeters).toFixed(2)
        : null;
      setUiLabel(prev => ({
        ...prev,
        totalWarpLength,
        warpSkeins
      }));
    }}, [calcFields.endsPerCm, 
        calcFields.weavingWidthCm, 
        calcFields.warpLengthMeters, 
        calcFields.lengthPerSkeinMeters]);
  
    React.useEffect(() => {
    // Calculate total weft length and skeins
    if (calcFields.picksPerCm && calcFields.weavingWidthCm) {
      const totalWeftLength = (calcFields.picksPerCm * calcFields.weavingWidthCm) * calcFields.warpLengthMeters; // Example calculation
      const weftSkeins = calcFields.lengthPerSkeinMeters 
      ? (totalWeftLength / calcFields.lengthPerSkeinMeters).toFixed(2)
      : null;
      setUiLabel(prev => ({
        ...prev,  
        totalWeftLength,
        weftSkeins
      }));
    }}, [calcFields.picksPerCm, 
        calcFields.weavingWidthCm, 
        calcFields.warpLengthMeters, 
        calcFields.lengthPerSkeinMeters]);

    return (
    <form className={styles.createForm} onSubmit={handleSubmit(onSubmit)}>
     <section id="projectDetail">
      <label className="span2">
        <h2>Projektnamn</h2>
        <input className={styles.optLong} 
        placeholder="* Projektnamn" {...register("name", {required: true})} />
        {errors?.name && <p className="error">Projektnamn är obligatoriskt</p>}
      </label>

      <label className="span2">
      <textarea rows="3" placeholder="Beskrivning" className={styles.optLong} {...register("description")} />
      </label>
      <label className="span2">
        Projektägare
        <input className={styles.optLong} {...register("owner")} />
  </label>

      <div className={styles.yarnMetricsWarp}>
    
        <h2>Garn</h2>
    {yarnFields.map((_, index) => (
      <YarnForm
        key={yarnFields[index].id}
        register={register}
        errors={errors}
        styles={styles}
        namePrefix={`yarns.${index}`}
        onRemove={() => removeYarn(index)}
      />
    ))}

    <button className="col2" type="button" onClick={() => appendYarn({...defaultYarn})}>
      <MdAddCircleOutline  /> Lägg till garn
    </button>
    {!isValid && yarnFields.length === 0 &&
    <p className="error">Fyll i minst 1 garn för att registrera projektet.</p>}

      </div>
      
          <div className={styles.warpMetricsGrid}>
            <h2>Varputräkning</h2>

          <label className="col1">* Vävbredd (cm)
            <input className={`opt ${styles.opt}`} type="number" step="0.1"
            {...register("weavingWidthCm", { valueAsNumber: true,
              required: "Vävbredd är obligatoriskt",
              min: { value: 0.1, message: "Vävbredd måste vara större än 0" }
             })} />
            {errors.weavingWidthCm && (
              <p className="error"> {errors.weavingWidthCm.message} </p>
            )}
             </label>
          <label>* EPC (trådar/cm) <br />
          <input className={`opt ${styles.opt}`} type="number" {...register("endsPerCm", { valueAsNumber: true,
            required: "EPC är obligatoriskt",
            min: { value: 1, message: "EPC måste vara större än 0" }
           })} />
           {errors.endsPerCm && (
             <p className="error"> {errors.endsPerCm.message} </p>
           )}
           </label>
           <label>* Längd (m) <br />
            <input className={`opt ${styles.opt}`} type="number" step="0.1"
              {...register("warpLengthMeters", { valueAsNumber: true,
              required: "Längd är obligatoriskt",
              min: { value: 0.1, message: "Längd måste vara större än 0" }
            })} />
          {errors.warpLengthMeters && (
            <p className="error col3"> {errors.warpLengthMeters.message} </p>
          )}
           </label>
          <label>Trådar  <br />
          <p className="col4">{totalEnds ? totalEnds : '-'}</p>
          </label>
          
          <p className="col3">Åtgång varp (m)</p>
          <p className="col4">Åtgång nystan</p>

          <p className="col3">{uiLabel.totalWarpLength ? uiLabel.totalWarpLength : '-'}</p>
          <p className="col4">{uiLabel.warpSkeins ? uiLabel.warpSkeins : '-'}</p>
          

          <p className="col3">Åtgång inslag (m)</p>
          <p>Åtgång nystan</p>
          
          <label className="span2" style={{textAlign:"right"}}>* Inslag/cm&nbsp; 
          <input className={`opt ${styles.opt}`} type="number" 
            {...register("picksPerCm", { valueAsNumber: true,
              required: "Inslag per cm (PPC) är obligatoriskt",
              min: { value: 1, message: "Inslag per cm (PPC) måste vara större än 0" }
             })} />
          {errors.picksPerCm && (
            <p className="error col2"> {errors.picksPerCm.message} </p>
          )}
          </label>
          <p className="col3">{uiLabel.totalWeftLength ? uiLabel.totalWeftLength : '-' }</p>
          <p className="col4">{uiLabel.weftSkeins ? uiLabel.weftSkeins : '-'}</p>

        </div>  
      {/* Tags */}
      <div className={styles.yarnMetricsWarp}>
        <h2>Tags</h2>
        {tagFields.map((tag, index) => (
          <div key={tag.id}>
            <input {...register(`tags.${index}`)} />
            <button type="button" onClick={() => removeTag(index)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => appendTag("")}>Add Tag</button>
      </div>
    </section>

      <button className={isValid? styles.btnCreate: ''} type="submit">Create Project</button>
    </form>
  );
}

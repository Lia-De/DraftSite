import React, { useState } from "react";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import { defaultYarn, USAGE_TYPES, FIBRE_TYPES } from "../constants/yarnConstants";
import { MdPlaylistRemove } from "react-icons/md";
import { MdAddCircleOutline } from "react-icons/md";

export default function LoomProjectForm({ onSubmit }) {
  const { register, control, watch, handleSubmit, formState: { errors } } = useForm({
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
      ],
      warpChains: [
        {
          id: "",
          name: "",
          order: null,
          crossCount: null,
          loomProjectId: "",
          yarnId: "",
          ends: null,
          warpLength: null,
          notes: "",
          totalLengthMeters: null,
          skeinsNeeded: null
        }
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
    }}, [calcFields.endsPerCm, calcFields.weavingWidthCm, calcFields.warpLengthMeters, calcFields.lengthPerSkeinMeters]);
  
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
    }}, [calcFields.picksPerCm, calcFields.weavingWidthCm, calcFields.warpLengthMeters, calcFields.lengthPerSkeinMeters]);
  return (
    <>
    
    <form onSubmit={handleSubmit(onSubmit)} className="create-form">
     <section id="project-detail">

      <label className="span2">
        <h2>Projektnamn</h2>
        <input className="opt-long" placeholder="* Projektnamn" {...register("name", {required: true})} />
      </label>

      <label className="span2">
      <textarea rows="3" placeholder="Beskrivning" className="opt-long" {...register("description")} />
      </label>
      <label className="span2">
        Projektägare
        <input className="opt-long" {...register("owner")} />
  </label>

      <div className="yarn-metrics-warp">
        <h2>Garn</h2>
        {/* <YarnInfoShort yarn={warp} /> */}
    {yarnFields.map((yarn, index) => (
      <div key={yarn.id} className="yarn-entry">
        <label className="span3">
          Märke: 
          <input className="opt-long" {...register(`yarns.${index}.brand`)} />
        </label>
        <label>
          Nm (tjocklek/trådar) <br />
          <input className="opt-half" type="number" 
          {...register(`yarns.${index}.thicknessNM`, { valueAsNumber: true ,
            required: "Tjocklek (Nm) är obligatoriskt",
            min: { value: 1, message: "Tjocklek måste vara större än 0" }
            })} />
          /<input className="opt-half" type="number" 
          {...register(`yarns.${index}.ply`, { valueAsNumber: true ,
            required: "Trådantal (Nm) är obligatoriskt",
            min: { value: 1, message: "Trådar måste vara större än 0" }
          })} />
        </label>
        <label>
          Färg <br />
          <input className="opt" {...register(`yarns.${index}.color`)} />
        </label>
        <label>
          Färgkod <br />
          <input className="opt" {...register(`yarns.${index}.colorCode`)} />
        </label>
        {/* Error messages */}
        {errors?.yarns?.[index]?.thicknessNM && (
          <p className="error">
            {errors.yarns[index].thicknessNM.message}
          </p>
        )}

        {errors?.yarns?.[index]?.ply && (
          <p className="error">
            {errors.yarns[index].ply.message}
          </p>
        )}
        <span className="yarn-entry">
        <h4>Nystan</h4>
        <label>
          Vikt (g)
          <input className="opt" type="number" 
          {...register(`yarns.${index}.weightPerSkeinGrams`, { valueAsNumber: true ,
            required: "Vikt är obligatoriskt",
            min: { value: 1, message: "Vikt måste vara större än 0" }
          })} />
        </label>
        <label>
          Längd (m)
          <input className="opt" type="number" 
          {...register(`yarns.${index}.lengthPerSkeinMeters`, { valueAsNumber: true ,
            required: "Längd är obligatoriskt",
            min: { value: 1, message: "Längd måste vara större än 0" }
          })} />
        </label>
        <label>
          Pris
          <input className="opt" type="number" {...register(`yarns.${index}.pricePerSkein`, { valueAsNumber: true })} />
        </label>
          {/* Error messages */}
        {errors?.yarns?.[index]?.weightPerSkeinGrams && (
          <p className="error">
            {errors.yarns[index].weightPerSkeinGrams.message}
          </p>
        )}
        {errors?.yarns?.[index]?.lengthPerSkeinMeters && (
          <p className="error">
            {errors.yarns[index].lengthPerSkeinMeters.message}
          </p>
        )}

        <label className="col1">
        Fiber:&nbsp;
        <select className="opt-double"
            {...register(`yarns.${index}.fibreType`, {
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
        <select className="opt-double"
            {...register(`yarns.${index}.usageType`, {
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
          Nystan: 
          <input className="opt-half" type="number" 
            {...register(`yarns.${index}.numberOfSkeins`, { valueAsNumber: true,
              min: { value: 1, message: "Antal nystan måste vara 1 eller mer" }
             })} />
        </label>
        {/* errors */}
        {errors?.yarns?.[index]?.numberOfSkeins && (
          <p className="error col3">
            {errors.yarns[index].numberOfSkeins.message}
          </p>
        )}
        </span>
        <label className="span3">
          Anteckning
          <input className="opt-long" {...register(`yarns.${index}.notes`)} />
        </label>
        <button className="col2" type="button" onClick={() => removeYarn(index)}>
          <MdPlaylistRemove style={{ color: "red" }} /> Ta bort garn
        </button>
      </div>
    ))}
    <button className="col2" type="button" onClick={() => appendYarn({...defaultYarn})}>
      <MdAddCircleOutline  /> Lägg till garn
    </button>

      </div>
      
      <div className="yarn-calculations">

        <div id="warp-metrics-grid">
          
          <label className="col1"> Vävbredd (cm)
            <input className="opt" type="number" 
            {...register("weavingWidthCm", { valueAsNumber: true,
              required: "Vävbredd är obligatoriskt",
              min: { value: 1, message: "Vävbredd måste vara större än 0" }
             })} />
             </label>
          <label>EPC <br />
          <input className="opt" type="number" {...register("endsPerCm", { valueAsNumber: true,
            required: "EPC är obligatoriskt",
            min: { value: 1, message: "EPC måste vara större än 0" }
           })} />
           </label>
           <label>Längd (m) <br />
          <input className="opt" type="number" {...register("warpLengthMeters", { valueAsNumber: true,
            required: "Längd är obligatoriskt",
            min: { value: 1, message: "Längd måste vara större än 0" }
           })} /></label>
          <label>Trådar 
          <input className="opt" type="number" disabled placeholder={totalEnds ? totalEnds : '-'} {...register("inputEndsInWarp", { valueAsNumber: true })} />
          </label>
          {/* Error messages */}
          {errors.weavingWidthCm && (
            <p className="error col1">
              {errors.weavingWidthCm.message}
            </p>
          )}
          {errors.endsPerCm && (
            <p className="error col2">
              {errors.endsPerCm.message}
            </p>
          )}
          {errors.warpLengthMeters && (
            <p className="error col3">
              {errors.warpLengthMeters.message}
            </p>
          )}
          
          <p className="col3">Åtgång varp (m)</p>
          <p className="col4">Åtgång nystan</p>

          <p className="col3">{uiLabel.totalWarpLength ? uiLabel.totalWarpLength : '-'}</p>
          <p className="col4">{uiLabel.warpSkeins ? uiLabel.warpSkeins : '-'}</p>
          

          <p className="col3">Åtgång inslag (m)</p>
          <p>Åtgång nystan</p>
          
          <label className="col2">PPC:&nbsp; 
          <input className="opt" type="number" 
            {...register("picksPerCm", { valueAsNumber: true,
              required: "Inslag per cm (PPC) är obligatoriskt",
              min: { value: 1, message: "Inslag per cm (PPC) måste vara större än 0" }
             })} />
          </label>
          <p className="col3">{uiLabel.totalWeftLength ? uiLabel.totalWeftLength : '-' }</p>
          <p className="col4">{uiLabel.weftSkeins ? uiLabel.weftSkeins : '-'}</p>
          {/* Error messages */}
          {errors.picksPerCm && (
            <p className="error col2">
              {errors.picksPerCm.message}
            </p>
          )}
        </div>  
      </div>
    </section>
 




      {/* Tags */}
      <div>
        <h3>Tags</h3>
        {tagFields.map((tag, index) => (
          <div key={tag.id}>
            <input {...register(`tags.${index}`)} />
            <button type="button" onClick={() => removeTag(index)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => appendTag("")}>Add Tag</button>
      </div>

      {/* Warp Chains */}
      <div>
        <h3>Warp Chains</h3>
        {chainFields.map((chain, index) => (
          <div key={chain.id}>
            <label>
              Name
              <input {...register(`warpChains.${index}.name`)} />
            </label>
            <label>
              Order
              <input type="number" {...register(`warpChains.${index}.order`, { valueAsNumber: true })} />
            </label>
            <label>
              Cross Count
              <input type="number" {...register(`warpChains.${index}.crossCount`, { valueAsNumber: true })} />
            </label>
            <label>
              Ends
              <input type="number" {...register(`warpChains.${index}.ends`, { valueAsNumber: true })} />
            </label>
            <label>
              Warp Length
              <input type="number" {...register(`warpChains.${index}.warpLength`, { valueAsNumber: true })} />
            </label>
            <label>
              Notes
              <input {...register(`warpChains.${index}.notes`)} />
            </label>
            <button type="button" onClick={() => removeChain(index)}>Remove Chain</button>
          </div>
        ))}
        <button type="button" onClick={() =>
          appendChain({
            name: "",
            order: null,
            crossCount: null,
            loomProjectId: "",
            yarnId: "",
            ends: null,
            warpLength: null,
            notes: "",
            totalLengthMeters: null,
            skeinsNeeded: null
          })
        }>Add Warp Chain</button>
      </div>

      <button type="submit">Create Project</button>
    </form>
    </>
  );
}

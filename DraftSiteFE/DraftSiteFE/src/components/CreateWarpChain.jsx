import React, {useEffect} from "react";
import { useForm, useFieldArray } from "react-hook-form";

export default function CreateWarpChain({projectId, 
        yarnId,
        idealEndsPerChain,
        projectWarpLength, 
        chainCount, 
        onSubmit}) {
    const { register, control, watch, handleSubmit, reset, formState: { errors, isValid } } = 
    useForm({mode:"onChange",
          defaultValues: []
}); 
    const { fields: chainFields, append: appendChain, remove: removeChain } = 
    useFieldArray({ control, name: "warpChains" });

    useEffect(() => {
  if (!projectId || !yarnId) return;

  reset({
    warpChains: Array.from({ length: chainCount }, () => ({
      ends: null,
      name: "",
      crossCount: "1x1",
      loomProjectId: projectId,
      yarnId: yarnId,
      warpLength: projectWarpLength ?? null,
      notes: ""
    }))
  });
}, [projectId, yarnId, chainCount, projectWarpLength, reset]);

    return (
        <div>
            {/* Warp Chains */}
            <form onSubmit={handleSubmit(onSubmit)}>
            <h3 className="printHidden">Varpflätor</h3>
            <p>Idealt {idealEndsPerChain} trådar på {chainCount} kedjor
            <button className="printHidden btnWarpingToggle" 
            title="Fyll automatiskt i idealantal trådar per kedja"
                onClick={
                () => {
                    
                    reset({
                        warpChains: Array.from({ length: chainCount }, () => ({
                        ends: idealEndsPerChain,
                        name: "",
                        crossCount: "1x1",
                        loomProjectId: projectId,
                        yarnId: yarnId,
                        warpLength: projectWarpLength ?? null,
                        notes: ""
                        }))
                    });
                }
            }>✓</button></p>

        <div>
             {Array.from({ length: chainCount }).map((_, index) => (
        <div className="chainCount" key={index}>
          <p>
            <strong>{index + 1}:{" "} </strong>
            <input
              type="text"
              className="optHalf"
              name={`chain-${index + 1}`}
              id={`chain-${index + 1}`}
              {...register(`warpChains.${index}.ends`, {required:true})}
            />
          </p>
        </div>
      ))}

        </div>

            {chainFields.map((chain, index) => (
                <div key={chain.id} className="printHidden">
                <label> Kors: (1×1 - 20×20)<br />
                    <select className="opt"
                        {...register(`warpChains.${index}.crossCount`)}
                    >
                        {Array.from({ length: 20 }, (_, i) => {
                        const value = `${i + 1}x${i + 1}`;
                        return (
                            <option key={value} value={value}>
                            {value}
                            </option>
                        );
                        })}
                    </select>
                </label>
{/*                 
                <label> Varpad längd
                    <input className="opt optHalf" placeholder={projectWarpLength} type="number" {...register(`warpChains.${index}.warpLength`, { valueAsNumber: true })} />
                </label>
                <label> <br />Name <br />
                    <input className="opt optLong" {...register(`warpChains.${index}.name`)} />
                </label>
                <label> Anteckningar <br />
                    <input className="opt optLong" {...register(`warpChains.${index}.notes`)} />
                </label>
                <button type="button" onClick={() => removeChain(index)}>Remove Chain</button>
*/}
                </div> 
            )
            )}
            {/* <button type="button" onClick={() =>
                appendChain({
                    name: "",
                    crossCount: null,
                    loomProjectId: "",
                    yarnId: "",
                    ends: null,
                    warpLength: null,
                    notes: ""
                })}>Add Warp Chain</button> */}
            <button type="submit" disabled={!isValid}>Create Warp Chains</button>
            </form>
        </div>
    )
}
    
    
    
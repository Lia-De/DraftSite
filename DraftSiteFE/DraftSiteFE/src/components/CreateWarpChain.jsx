import React, {useEffect, useState} from "react";
import { useForm, useFieldArray } from "react-hook-form";

export default function CreateWarpChain({projectId, 
        yarnId,
        idealEndsPerChain,
        projectWarpLength, 
        chainCount, 
        onSubmit}) {
    const { register, control, handleSubmit, reset, getValues,setValue, 
            formState: { errors, isValid } 
            } = useForm({
                mode: "onChange",
                defaultValues: {
                    warpChains: [],
                    sharedCrossCount: "1x1"
                }
            });
    const { fields: chainFields, append: appendChain, remove: removeChain } = 
    useFieldArray({ control, name: "warpChains" });
    const [showNote, setShowNote] = useState(null);
    const isFormDisabled = !yarnId;

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

    useEffect(() => {
        // remove ideal ends per chain when it changes
        const currentValues = getValues("warpChains");
        currentValues.forEach((chain, index) => {
            setValue(`warpChains.${index}.ends`, null);
        });
    }, [chainCount]);

    return (
        <div>
            {/* Warp Chains */}
            <form onSubmit={handleSubmit(onSubmit)}>
            
            <p>Idealt {idealEndsPerChain} trådar på {chainCount} kedjor
            <button type="button"
                className="printHidden btnWarpingToggle"
                title="Fyll automatiskt i idealantal trådar per kedja"
                onClick={() => {
                const crossCount = getValues("sharedCrossCount");
                reset({
                    warpChains: Array.from({ length: chainCount }, () => ({
                    ends: idealEndsPerChain,
                    name: "",
                    crossCount: crossCount,
                    loomProjectId: projectId,   
                    yarnId: yarnId,
                    warpLength: projectWarpLength ?? null,
                    notes: ""
                    }))
                });
                
                }}
                >
                ✓
                </button>
            </p>
            <label>
                Kors (gäller alla kedjor)<br />
                <select
                    className="opt"
                    {...register("sharedCrossCount")}
                    defaultValue="1x1"
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

        <div>
        {Array.from({ length: chainCount }).map((_, index) => (
        
        <div className="chainCount" key={index}>
          <p>
            <button type="button" className="btnWarpingToggle printHidden" title="Visa/Dölj anteckning"
            onClick={() => setShowNote(showNote === index ? null : index)}>{index + 1}:{" "} </button>
            <input
              className="opt optHalf"
              name={`chain-${index + 1}`}
              id={`chain-${index + 1}`}
              {...register(`warpChains.${index}.ends`, {required:true, valueAsNumber:true})}
            />
          </p>
        </div>
      ))}
        {Array.from({ length: chainCount }).map((_, index) => (
            <div key={`notes-${index}`}>
            <label 
                className={showNote === index ? "showNote printHidden" : "hideNote printHidden"}>
                     Anteckning kedja {index + 1}:<br />
                <textarea className="optFull" {...register(`warpChains.${index}.notes`)} />
            </label>
        </div>
        ))}

        </div>

            {chainFields.map((chain, index) => (
                <input type="hidden"
                    {...register(`warpChains.${index}.crossCount`)}
                    key={chain.id} />
            )
            )}

            <button className="printHidden" type="submit"
             title= {isFormDisabled ? "För att spara varpkedjor måste garn finnas" : "Skapa varpflätor"}
             disabled={!isValid || isFormDisabled}>
                Create Warp Chains
            </button>
            </form>
        </div>
    )
}
    
    
    
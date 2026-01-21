import React, {useEffect} from "react";
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
            <strong>{index + 1}:{" "} </strong>
            <input
            //   type="number"
              className="optHalf"
              name={`chain-${index + 1}`}
              id={`chain-${index + 1}`}
              {...register(`warpChains.${index}.ends`, {required:true, valueAsNumber:true})}
            />
          </p>
        </div>
      ))}

        </div>

            {chainFields.map((chain, index) => (
                <input type="hidden"
                    {...register(`warpChains.${index}.crossCount`)}
                    key={chain.id} />
            )
            )}

            <button className="printHidden" type="submit" disabled={!isValid}>Create Warp Chains</button>
            </form>
        </div>
    )
}
    
    
    
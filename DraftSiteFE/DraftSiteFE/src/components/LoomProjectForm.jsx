import React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { defaultYarn, USAGE_TYPES, FIBRE_TYPES } from "../constants/yarnConstants";

export default function LoomProjectForm({ onSubmit }) {
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: "",
      description: "",
      owner: "",
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

  const { fields: tagFields, append: appendTag, remove: removeTag } = useFieldArray({ control, name: "tags" });
  const { fields: yarnFields, append: appendYarn, remove: removeYarn } = useFieldArray({ control, name: "yarns" });
  const { fields: chainFields, append: appendChain, remove: removeChain } = useFieldArray({ control, name: "warpChains" });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="create-form">
      <h2>Create Loom Project</h2>

      <label>
        Name
        <input {...register("name", {required: true})} />
      </label>

      <label>
        Description
        <textarea {...register("description")} />
      </label>

      <label>
        Owner
        <input {...register("owner")} />
      </label>

      <label>
        Weaving Width (cm)
        <input type="number" {...register("weavingWidthCm", { valueAsNumber: true })} />
      </label>

      <label>
        Input Ends in Warp
        <input type="number" {...register("inputEndsInWarp", { valueAsNumber: true })} />
      </label>

      <label>
        Ends per Cm
        <input type="number" {...register("endsPerCm", { valueAsNumber: true })} />
      </label>

      <label>
        Picks per Cm
        <input type="number" {...register("picksPerCm", { valueAsNumber: true })} />
      </label>

      <label>
        Warp Length (meters)
        <input type="number" {...register("warpLengthMeters", { valueAsNumber: true })} />
      </label>

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

      {/* Yarns */}
      <div>
        <h3>Yarns</h3>
        {yarnFields.map((yarn, index) => (
          <div key={yarn.id} style={{ border: "1px solid #ccc", padding: 8, marginBottom: 8 }}>
            <label>
              Brand
              <input {...register(`yarns.${index}.brand`)} />
            </label>
            <label>
              Color
              <input {...register(`yarns.${index}.color`)} />
            </label>
            <label>
              Color code
              <input {...register(`yarns.${index}.colorCode`)} />
            </label>
            <label>
              Ply
              <input type="number" {...register(`yarns.${index}.ply`, { valueAsNumber: true })} />
            </label>
            <label>
              Weight (grams)
              <input type="number" {...register(`yarns.${index}.weightPerSkeinGrams`, { valueAsNumber: true })} />
            </label>
            <label>
              Length (meters)
              <input type="number" {...register(`yarns.${index}.lengthPerSkeinMeters`, { valueAsNumber: true })} />
            </label>
            <label>
            Fibre type
            <select
                {...register(`yarns.${index}.fibreType`, {
                valueAsNumber: true
                })}
            >
                <option value="">Select fibre</option>
                {FIBRE_TYPES.map(opt => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
                ))}
            </select>
            </label>
            <label>
            Usage type
            <select
                {...register(`yarns.${index}.usageType`, {
                valueAsNumber: true
                })}
            >
                <option value="">Select usage</option>
                {USAGE_TYPES.map(opt => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
                ))}
            </select>
            </label>
            <label>
              Notes
              <input {...register(`yarns.${index}.notes`)} />
            </label>
            <button type="button" onClick={() => removeYarn(index)}>Remove Yarn</button>
          </div>
        ))}
        <button type="button" onClick={() =>
          appendYarn({...defaultYarn
          })
        }>Add Yarn</button>
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
          })
        }>Add Warp Chain</button>
      </div>

      <button type="submit">Create Project</button>
    </form>
  );
}

import React from "react";
import { useForm } from "react-hook-form";

export default function AdminYarnValidationSetting({
    onFetchRequest,
    yarnValidationConstants
    }) {

    const { register, handleSubmit, getValues, formState: { errors } } = useForm({});

        const onSubmit = data => {
            console.log(data);
        }

    return (
        <>
        <form onSubmit={handleSubmit(onSubmit)} className="yarn-validation-form"
         style={{marginTop: '20px', border: '1px solid gray', padding: '10px'}}>
            <h2>Giltiga garnegenskaper</h2>
            <h3>NM = tjocklek / antal trådar</h3>
        <div>
            <label htmlFor="ThicknessMin"><h4>Tjocklek</h4>
                    
                Nuvarande gränser Min: <strong>{yarnValidationConstants.ThicknessMin} </strong> 
                och Max: <strong>{yarnValidationConstants.ThicknessMax}</strong>
                    </label>
            <input type="number" placeholder="Min" 
                style={{maxWidth: '80px'}} 
                {...register("ThicknessMin", {max: 100, min: {
                value: 1, 
                message: "Minsta tjocklek är 1"
            }})} />
            {errors.ThicknessMin && <p style={{color: 'red'}}>{errors.ThicknessMin.message}</p>}
            <input type="number" placeholder="Max" 
                style={{maxWidth: '80px'}} 
                {...register("ThicknessMax", {
                validate: (value) => {
                const min = getValues("ThicknessMin");
                return (
                    Number(value) > Number(min) ||
                    "Max måste vara större än minsta tjocklek"
                  );
            },
            max: 100, min: {
                value: 1, 
                message: "Minsta tjocklek är 1"
            }})} />
            {errors.ThicknessMax && <p style={{color: 'red'}}>{errors.ThicknessMax.message}</p>}
        </div>
        <div>
            <label htmlFor="PlyMin"><h4>Antal trådar</h4>
                Nuvarande gränser Min: <strong>{yarnValidationConstants.PlyMin} </strong> och 
                Max: <strong>{yarnValidationConstants.PlyMax}</strong>
                </label>
            
            <input type="number" placeholder="Min" style={{maxWidth: '80px'}}
            {...register("PlyMin", {max: 100, min: {
                value: 1, 
                message: "Minsta antal trådar är 1"
            }})} />
            {errors.PlyMin && <p style={{color: 'red'}}>{errors.PlyMin.message}</p>}
            <input type="number" placeholder="Max" style={{maxWidth: '80px'}} 
            {...register("PlyMax", {
            validate: (value) => {
              const min = getValues("PlyMin");
              return (
                Number(value) > Number(min) ||
                "Max måste vara större än minsta antal trådar"
              );
            },
            max: 100, min: {
                value: 1, 
                message: "Minsta antal trådar är 1"
            }})} />
            {errors.PlyMax && <p style={{color: 'red'}}>{errors.PlyMax.message}</p>}

        </div>
        <div>
            <button type="submit">Save values</button>

        </div>

        </form>
                    <button className="btn-smaller" onClick={() => onFetchRequest("admin/yarn-validation")}>
            Update from db</button>
            </>
    )
}
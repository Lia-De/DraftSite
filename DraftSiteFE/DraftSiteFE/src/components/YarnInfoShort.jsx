import '../css/yarnInfo.css';
import { useState } from "react";
import { MdExpandMore } from "react-icons/md";
import { MdExpandLess } from "react-icons/md";
import { YARN_FIBRE_LABELS, YARN_USAGE_LABELS } from "../constants/yarnConstants.js";

export default function YarnInfoShort({ yarn }) {
  const [showInfo, setShowInfo] = useState(false);
    return (
        <>
        <p>{yarn.brand}</p>
        <p>{yarn.color} {yarn.colorCode ? "(" + yarn.colorCode + ") " : " "} 
          {yarn.dyeLot && "Färgbad: "+yarn.dyeLot}</p>
        
        <p>{yarn.thicknessNM}/{yarn.ply} Nm</p>
        <p>{yarn.weightPerSkeinGrams} g</p>
        <p>{yarn.lengthPerSkeinMeters} m</p>
        <p >Nystan: {yarn.numberOfSkeins}</p>
        
        <section id="yarn-extended-info">
          {!showInfo && <MdExpandMore size="2rem" className="icon" onClick={() => (setShowInfo(prev => !prev))}/>}
          {showInfo && 
          (
            <>
            <MdExpandLess className="icon" size="2rem" onClick={() => (setShowInfo(prev => !prev))}/>
             
                <p><i>Används som</i>: {YARN_USAGE_LABELS[yarn.usageType]}</p>
                <p><i>Fiber</i>: {YARN_FIBRE_LABELS[yarn.fibreType]}</p>
                <p><i>Inköpspris</i>: {yarn.totalPrice} kr ({yarn.pricePerSkein} kr/st)</p>
                {yarn.notes && <p><i>Anteckning</i>: {yarn.notes}</p>}
              
              </>
          )
            }
        </section>

        </>
        )
};

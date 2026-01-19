import '../css/yarnInfo.css';
import { useState } from "react";
import { MdExpandMore } from "react-icons/md";
import { MdExpandLess } from "react-icons/md";
import { USAGE_TYPES,  FIBRE_TYPES } from '../constants/yarnConstants.js';


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
             
                <p><i>Används som</i>: {USAGE_TYPES[yarn.usageType].label}</p>
                <p><i>Fiber</i>: {FIBRE_TYPES[yarn.fibreType].label}</p>
                <p><i>Inköpspris</i>: {yarn.totalPrice} kr ({yarn.pricePerSkein} kr/st)</p>
                {yarn.notes && <p><i>Anteckning</i>: {yarn.notes}</p>}
              
              </>
          )
            }
        </section>

        </>
        )
};

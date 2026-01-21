import '../css/yarnInfo.css';
import { useState } from "react";
import { MdExpandMore } from "react-icons/md";
import { MdExpandLess } from "react-icons/md";
import { USAGE_TYPES,  FIBRE_TYPES } from '../constants/yarnConstants.js';


export default function YarnInfoShort({ yarn, warpAsWeft=false }) {
  const [showInfo, setShowInfo] = useState(false);
    if (!yarn) return ('');
    return (
        <>
        <p className={warpAsWeft ? "italics" : ""}>{yarn.brand? yarn.brand : `${USAGE_TYPES[yarn.usageType].label}garn`}</p>
        <p className={warpAsWeft ? "italics" : ""}>{yarn.color? yarn.color : ""} {yarn.colorCode ? "(" + yarn.colorCode + ") " : " "} 
          {yarn.dyeLot && "Färgbad: "+yarn.dyeLot}</p>
        
        <p className={warpAsWeft ? "italics" : ""}>{yarn.thicknessNM}/{yarn.ply} Nm</p>
        <p className={warpAsWeft ? "italics" : ""}>{yarn.weightPerSkeinGrams} g</p>
        <p className={warpAsWeft ? "italics" : ""}>{yarn.lengthPerSkeinMeters} m</p>
        <p className={warpAsWeft ? "italics printHidden" : "printHidden"}>Nystan: {yarn.numberOfSkeins}</p>
        

        <section id="yarnExtendedInfo">
          {!showInfo && <MdExpandMore size="2rem" className="icon printHidden" onClick={() => (setShowInfo(prev => !prev))}/>}
          {showInfo && 
          (
            <>
            <MdExpandLess className="icon" size="2rem" onClick={() => (setShowInfo(prev => !prev))}/>
             
            {warpAsWeft && <p className='infoNote'>Varpgarn används som inslag</p>}
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

import { useState } from "react";
import { YARN_FIBRE_LABELS, YARN_USAGE_LABELS } from "../constants/yarnConstants.js";

export default function YarnInfoShort({ yarn }) {
  const [showInfo, setShowInfo] = useState(false);
    return (
        <>
        <p>{yarn.brand}</p>
        <p>{yarn.color} {yarn.colorCode ? "(" + yarn.colorCode + ")" : ""}</p>
        {yarn.dyeLot && <p>Färgbad: {yarn.dyeLot}</p>}
        <p>{yarn.thicknessNM} / {yarn.ply} Nm</p>
        <p>{yarn.weightPerSkeinGrams} g</p>
        <p>{yarn.lengthPerSkeinMeters} m</p>
        <p >Nystan: {yarn.numberOfSkeins}</p>


    {/* <section>
      <h3>Garn i projektet</h3>
              <strong>{yarn.brand}</strong> – {yarn.color}
              <ul>
                <li>Används som: {YARN_USAGE_LABELS[yarn.usageType]}</li>
                <li>Fiber: {YARN_FIBRE_LABELS[yarn.fibreType]}</li>
                <li>Storlek: Nm {yarn.thicknessNM} / {yarn.ply}</li>
                <li>Vikt/nystan: {yarn.weightPerSkeinGrams} g</li>
                <li>Längd/nystan: {yarn.lengthPerSkeinMeters} m</li>
                <li>Antal nystan: {yarn.numberOfSkeins}</li>
                <li>Total price: {yarn.totalPrice} kr</li>
              </ul>
    </section> */}

        </>
        )
};
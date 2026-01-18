import React from "react";
import { useAtom } from "jotai";
import YarnInfoShort from "./YarnInfoShort";


export default function ShowYarnList({yarnList}) {

    return yarnList.length === 0 ? (
        <p>Inget garn tillagt</p>
      ) : (
        <ul>
          {yarnList.map((yarn) => (
            <div className="yarn-metrics">
                <YarnInfoShort key={yarn.id} yarn={yarn} />
            </div>
          ))}
        </ul>
      )
}



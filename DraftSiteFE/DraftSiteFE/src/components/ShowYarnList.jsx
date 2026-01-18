import React from "react";
import { useAtom } from "jotai";
import YarnInfoShort from "./YarnInfoShort";


export default function ShowYarnList({yarnList}) {


    return (
      <section>
        <h3>Garnlista</h3>
        <ul>
          {yarnList.map((yarn) => (
            <div className="yarn-metrics" key={yarn.id}>
                <YarnInfoShort key={yarn.id} yarn={yarn} />
            </div>
          ))}
        </ul>
      </section>
      )
}



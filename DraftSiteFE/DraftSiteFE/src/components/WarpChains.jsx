import { useEffect, useState } from "react";
import CreateWarpChain from "../components/CreateWarpChain.jsx";
import { useAtomValue } from "jotai";
import { currentProjectAtom } from "../atoms/currentProjectAtom.js";
import { create } from "../services/APICalls.js";

export default function WarpChains({totalEnds, onChainCreated}) {
  const project = useAtomValue(currentProjectAtom);
  const [warp, setWarp] = useState(null);
  const [chainCount, setChainCount] = useState(4);
  const [idealEndsPerChain, setIdealEndsPerChain] = useState(Math.floor(totalEnds/chainCount));

  const createChainSubmit = async (data) => {
    try {
      const result = await create('WarpChains', data.warpChains);
      console.log("Warp chains created successfully:", result);
      onChainCreated();
    } catch (error) {
      console.error("Error creating warp chain:", error);
    }
  };

  useEffect(() => {
    setWarp(project?.yarns.find((yarn) => yarn.usageType === 0) || null);
  }, [project]);


  return (
    <div className="warpChainsGrid">
      {/* User input */}
      <h3 className="printHidden">Varpflätor {project.warpChains.length > 0 ? `(${project.warpChains.length})` : ''}</h3>
      <div className="chainControl">
        <label>
          Antal kedjor: <input
            className="opt optHalf"
            type="number"
            min="0"
            max="50"
            value={chainCount}
            onChange={(e) => {
              setChainCount(Number(e.target.value)); 
              setIdealEndsPerChain(Math.floor(totalEnds/Number(e.target.value)))
            }}
          /> 
        </label>
      </div>
        
        <CreateWarpChain 
          projectId={project?.id} 
          yarnId={warp?.id} 
          projectWarpLength={project?.warpLengthMeters}
          idealEndsPerChain={idealEndsPerChain}
          chainCount={chainCount}
          onSubmit={createChainSubmit} />
          
    </div>
  );
}



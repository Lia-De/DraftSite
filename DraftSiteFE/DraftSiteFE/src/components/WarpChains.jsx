import { useEffect, useState } from "react";
import CreateWarpChain from "../components/CreateWarpChain.jsx";
import { useAtomValue } from "jotai";
import { currentProjectAtom } from "../atoms/currentProjectAtom.js";

export default function WarpChains({totalEnds}) {
  const project = useAtomValue(currentProjectAtom);
  const [warp, setWarp] = useState(null);
  const [chainCount, setChainCount] = useState(4);
  const [idealEndsPerChain, setIdealEndsPerChain] = useState(Math.floor(totalEnds/chainCount));

  const createChainSubmit = async (data) => {
    console.log("Creating warp chain with data:", data.warpChains);
    // setUiState(prev => ({...prev, forceReload:true}));
  };

  useEffect(() => {
    setWarp(project?.yarns.find((yarn) => yarn.usageType === 0) || null);
  }, [project]);


  return (
    <div className="warpChainsGrid">
      {/* User input */}
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
        {chainCount>1 && <p>Idealt {idealEndsPerChain} trådar på {chainCount} kedjor</p>}

        <CreateWarpChain 
          projectId={project?.id} 
          yarnId={(project?.yarns.find((yarn) => yarn.usageType === 0)?.id || null)} 
          projectWarpLength={project?.warpLengthMeters}
          idealEndsPerChain={idealEndsPerChain}
          chainCount={chainCount}
          onSubmit={createChainSubmit} />
          

      {/* Generated chains */}
      {/* {Array.from({ length: chainCount }).map((_, index) => (
        <div className="chainCount" key={index}>
          <p>
            <strong>{index + 1}:{" "} </strong>
            <input
              type="text"
              name={`chain-${index + 1}`}
              id={`chain-${index + 1}`}
            />
          </p>
        </div>
      ))} */}
    </div>
  );
}



import { useState } from "react";

export default function WarpChains({totalEnds}) {
  const [chainCount, setChainCount] = useState(4);

  return (
    <div className="warpChainsGrid">
      <h4>Varpkedjor</h4>

      {/* User input */}
      <div className="chainControl">
        <label>
          Antal kedjor: <input
            type="number"
            min="0"
            max="50"
            value={chainCount}
            onChange={(e) => setChainCount(Number(e.target.value))}
          /> 
        </label>
      </div>
        {chainCount>1 && <p>Idealt {Math.floor(totalEnds/chainCount)} trådar på {chainCount} kedjor</p>}

      {/* Generated chains */}
      {Array.from({ length: chainCount }).map((_, index) => (
        <div className="chainCount" key={index}>
          <p>
            Kedja {index + 1}:{" "}
            <input
              type="text"
              name={`chain-${index + 1}`}
              id={`chain-${index + 1}`}
            />
          </p>
        </div>
      ))}
    </div>
  );
}



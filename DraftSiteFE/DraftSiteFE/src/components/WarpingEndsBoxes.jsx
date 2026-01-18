import { useState } from "react";
import WarpChains from "./WarpChains";

export default function EndsBoxes({
  totalEnds,
  boxesPerGroup = 5,
  maxPerRow = 10,
  boxSize = 20,
}) {
  const warpingGroupOptions = [10, 20, 30, 40, 50];
  const [groupSize, setGroupSize] = useState(20);
  if (!groupSize || groupSize <= 0) return null;

  const fullBoxes = Math.floor(totalEnds / groupSize);
  const remainder = totalEnds % groupSize;
  const remainderBoxes = remainder > 0 ? Math.floor(remainder/2) : 0;

  return (
    <div className="warping-help">
    <div className="warping-boxes-box">
      {/* Legend */}
      <div
        style={{
          marginBottom: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 12,
        }}
      >
        <div
          style={{
            width: boxSize,
            height: boxSize,
            border: '2px solid #000',
          }}
        />
        <span>= {groupSize} ends</span>

        {remainder > 0 && (
          <>
            <div
              style={{
                width: boxSize,
                height: boxSize,
                borderRadius: '50%',
                border: '1px solid #000',
                marginLeft: 12,
              }}
            />
            <span>= 2 end, remainder: {remainder}</span>
          </>
        )}
      </div>

      {/* Boxes grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${maxPerRow}, ${boxSize}px)`,
          gap: '4px',
        }}
      >
        {Array.from({ length: fullBoxes }).map((_, index) => {
          const isGroupDivider = (index + 1) % boxesPerGroup === 0;

          return (
            <div
              key={`box-${index}`}
              style={{
                width: boxSize,
                height: boxSize,
                border: '1px solid #000',
                borderRight: isGroupDivider ? '3px solid #000' : '1px solid #000',
              }}
            />
          );
        })}

        {/* Remainder circles */}
        {Array.from({ length: remainderBoxes }).map((_, index) => (
          <div
            key={`rem-${index}`}
            style={{
              width: boxSize,
              height: boxSize,
              borderRadius: '50%',
              border: '1px solid #000',
            }}
            title="2 ends"
          />
        ))}
      </div>
    </div>

      {/* Toggle */}
      <div className="warping-boxes-toggle" >
        {warpingGroupOptions.map((size) => (
          <button className={groupSize === size ?"btn-warping-toggle":"btn-warping-toggle-inactive"}
          key={size}
          onClick={() => setGroupSize(size)}
          >
            {size}
          </button>
        ))}
      </div>
        <WarpChains totalEnds={totalEnds} />
      </div>

  );
}


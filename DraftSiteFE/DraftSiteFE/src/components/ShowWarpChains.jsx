import { MdDeleteForever } from "react-icons/md";

export default function ShowWarpChains({chains, onDelete}) {
    if (!chains || chains.length === 0) return <p>Inga varpkedjor sparade ännu.</p>;
    return (
        <div className="warpChainsList">
            {chains.map((chain) => (
                <div key={chain.id} className="warpChainItem">
                    <p><strong>Kedja {chain.order}: </strong>
                        <span className="chainThreadCount">{chain.ends}</span> trådar</p>
                    <p>
                        Kors: {chain.crossCount} </p>
                    <p>
                        <button className="btnDeleteChain printHidden" title="Ta bort varpkedja (ej återställbart)"
                        onClick={() => { onDelete(chain.id); }}>
                            <MdDeleteForever />
                        </button>
                    </p>
                        {chain.notes? <p className="span3">Anteckning: {chain.notes}</p>: ''}
                </div>
            ))}
        </div>
    );
}
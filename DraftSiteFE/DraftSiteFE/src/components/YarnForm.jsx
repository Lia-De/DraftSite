import { FIBRE_TYPES, USAGE_TYPES } from "../constants/yarnConstants";

export default function YarnForm({
  register,
  errors,
  styles,
  namePrefix = "",
  onRemove
}) {
  const name = (field) =>
    namePrefix ? `${namePrefix}.${field}` : field;

  const getError = (field) => {
    if (!errors) return null;

    if (!namePrefix) return errors[field];

    const [, index] = namePrefix.split(".");
    return errors?.yarns?.[index]?.[field];
  };

  return (
    <div className={styles.yarnEntry}>
      {/* Brand */}
      <label className="span3">
        Märke:
        <input className={styles.optLong} {...register(name("brand"))} />
      </label>

      {/* Thickness / Ply */}
      <label>
        * Nm (tjocklek/trådar) <br />
        <input
          className={styles.optHalf}
          type="number"
          {...register(name("thicknessNM"), {
            valueAsNumber: true,
            required: "Tjocklek (Nm) är obligatoriskt",
            min: { value: 1, message: "Tjocklek måste vara större än 0" },
          })}
        />
        /
        <input
          className={styles.optHalf}
          type="number"
          {...register(name("ply"), {
            valueAsNumber: true,
            required: "Trådantal (Nm) är obligatoriskt",
            min: { value: 1, message: "Trådar måste vara större än 0" },
          })}
        />
        {getError("thicknessNM") && (
          <p className="error">{getError("thicknessNM").message}</p>
        )}
        {getError("ply") && (
          <p className="error">{getError("ply").message}</p>
        )}
      </label>

      {/* Color */}
      <label>
        Färg <br />
        <input className={`opt ${styles.opt}`} {...register(name("color"))} />
      </label>

      {/* Color code + dye lot */}
      <label>
        Färgkod  
        <input
          className={`opt ${styles.opt}`}
          {...register(name("colorCode"))}
        />
        Färgbad
        <input
        className={`opt ${styles.opt}`}
        {...register(name("dyeLot"))}
        />
      </label>

      {/* Skein section */}
      <span className={styles.yarnEntry}>
        <h4>Nystan</h4>

        <label>
          * Vikt (g)
          <input
            className={`opt ${styles.opt}`}
            type="number"
            {...register(name("weightPerSkeinGrams"), {
              valueAsNumber: true,
              required: "Vikt är obligatoriskt",
              min: { value: 1, message: "Vikt måste vara större än 0" },
            })}
          />
          {getError("weightPerSkeinGrams") && (
            <p className="error">
              {getError("weightPerSkeinGrams").message}
            </p>
          )}
        </label>

        <label>
          * Längd (m)
          <input
            className={`opt ${styles.opt}`}
            type="number"
            {...register(name("lengthPerSkeinMeters"), {
              valueAsNumber: true,
              required: "Längd är obligatoriskt",
              min: { value: 1, message: "Längd måste vara större än 0" },
            })}
          />
          {getError("lengthPerSkeinMeters") && (
            <p className="error">
              {getError("lengthPerSkeinMeters").message}
            </p>
          )}
        </label>

        <label>
          Pris
          <input
            className={`opt ${styles.opt}`}
            type="number"
            {...register(name("pricePerSkein"), { valueAsNumber: true })}
          />
        </label>
      </span>

      {/* Fibre */}
      <label className="col1">
        Fiber:&nbsp;
        <select
          className={styles.optDouble}
          {...register(name("fibreType"), { valueAsNumber: true })}
        >
          <option value="">Välj fiber</option>
          {FIBRE_TYPES.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      {/* Usage */}
      <label>
        Syfte:&nbsp;
        <select
          className={styles.optDouble}
          {...register(name("usageType"), { valueAsNumber: true })}
        >
          <option value="">Välj alternativ</option>
          {USAGE_TYPES.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      {/* Number of skeins */}
      <label>
        * Nystan:
        <input
          className={styles.optHalf}
          type="number"
          {...register(name("numberOfSkeins"), {
            valueAsNumber: true,
            required: "Lägg till minst 1 nystan",
            min: { value: 1, message: "Antal nystan måste vara 1 eller mer" },
          })}
        />
        {getError("numberOfSkeins") && (
          <p className="error">{getError("numberOfSkeins").message}</p>
        )}
      </label>

      {/* Notes */}
      <label className="span3">
        Anteckning
        <input className={styles.optLong} {...register(name("notes"))} />
      </label>

      {/* Optional remove button (array form only) */}
      {onRemove && (
        <button className="col2" type="button" onClick={onRemove}>
          Ta bort garn
        </button>
      )}
    </div>
  );
}

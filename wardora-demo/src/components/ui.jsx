import { BadgeCheck, Check, ChevronRight, Lock, Sparkles } from "lucide-react";

export function MetricCard({ icon: Icon, label, value, note }) {
  return (
    <article className="metric-card">
      <Icon size={22} />
      <span>{label}</span>
      <strong>{value}</strong>
      {note && <p>{note}</p>}
    </article>
  );
}

export function SelectField({ label, value, options, onChange }) {
  return (
    <label className="select-field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ControlGroup({ label, options, value, onChange }) {
  return (
    <div className="control-group">
      <span>{label}</span>
      <div className="chip-row">
        {options.map((option) => (
          <button key={option} type="button" className={value === option ? "chip active" : "chip"} onClick={() => onChange(option)}>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export function AnalysisRow({ label, value, score, loading }) {
  const width = loading ? 42 : score;

  return (
    <div className="analysis-row">
      <div>
        <strong>{label}</strong>
        <span>{loading ? "analizez..." : value}</span>
      </div>
      <div className="analysis-meter">
        <span style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

export function OutfitCard({ outfit, locked, onUnlock }) {
  return (
    <article className={locked ? "outfit-card locked" : "outfit-card"}>
      <div className="outfit-topline">
        <span>{outfit.premium ? "Premium" : "Free"}</span>
        {locked ? <Lock size={18} /> : <BadgeCheck size={18} />}
      </div>
      <h3>{outfit.title}</h3>
      <p>{outfit.recommendation || `Match AI: ${outfit.matchScore || 80}%`}</p>
      <ul>
        {outfit.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <small>{locked ? "Disponibil dupa plata simulata." : `Scor: ${outfit.matchScore || 80}%`}</small>
      {locked && (
        <button className="text-button" type="button" onClick={onUnlock}>
          Deblocheaza <ChevronRight size={16} />
        </button>
      )}
    </article>
  );
}

export function LockedPanel({ title, text, onClick }) {
  return (
    <div className="locked-panel">
      <Lock size={19} />
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
      <button className="text-button" type="button" onClick={onClick}>
        Upgrade
      </button>
    </div>
  );
}

export function PlanCard({ name, price, features, action, active, highlighted, onClick }) {
  return (
    <article className={highlighted ? "plan-card highlighted" : "plan-card"}>
      <div className="plan-heading">
        <span>{name}</span>
        {active && <BadgeCheck size={20} />}
      </div>
      <strong>{price}</strong>
      <ul>
        {features.map((feature) => (
          <li key={feature}>
            <Check size={16} />
            {feature}
          </li>
        ))}
      </ul>
      <button className={highlighted ? "primary-button wide" : "secondary-button wide"} type="button" onClick={onClick}>
        <Sparkles size={18} />
        {action}
      </button>
    </article>
  );
}

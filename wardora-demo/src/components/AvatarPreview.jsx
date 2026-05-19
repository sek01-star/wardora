import { Palette, Ruler, Sparkles, User } from "lucide-react";

function AvatarPreview({ account, aiProfile }) {
  const palette = aiProfile?.palette || aiProfile?.colorPalette || ["#ffffff", "#efe3ff", "#7a3cc7", "#d94f9b"];

  return (
    <article className="avatar-preview-card">
      <div className="avatar-image">
        {account?.photo ? <img src={account.photo} alt="Avatar Wardora" /> : <User size={54} />}
        <div className="avatar-glow" />
      </div>
      <div className="avatar-info">
        <p className="eyebrow">AI Avatar Preview</p>
        <h2>{account?.name || "Wardora Muse"}</h2>
        <p>{aiProfile?.styleProfile || "Incarca o poza pentru profil de stil, note de fit si paleta personalizata."}</p>
        <div className="avatar-tags">
          <span><Sparkles size={14} /> {aiProfile?.compatibilityScore || aiProfile?.contrast || 82}% style fit</span>
          <span><Ruler size={14} /> {aiProfile?.bodyFitNotes || "fit notes in asteptare"}</span>
          <span><Palette size={14} /> {aiProfile?.recommendedColors?.slice(0, 3).join(", ") || "lavanda, alb, rose"}</span>
        </div>
        <div className="palette-row">
          {palette.slice(0, 4).map((color) => (
            <span key={color} style={{ background: color }} />
          ))}
        </div>
      </div>
    </article>
  );
}

export default AvatarPreview;

import { Camera, Palette, Upload, WandSparkles } from "lucide-react";
import AvatarPreview from "../components/AvatarPreview";
import { AnalysisRow, ControlGroup, LockedPanel, OutfitCard, SelectField } from "../components/ui";
import { criteriaOptions, outfitTemplates } from "../data/wardoraData";

function StudioPage({
  account,
  isPremium,
  criteria,
  aiProfile,
  analysisLoading,
  generated,
  wardrobeItems,
  variants,
  updateCriteria,
  onPhoto,
  runAnalysis,
  generateOutfit,
  navigate,
  openAuth,
}) {
  const lockedTemplates = outfitTemplates.filter((template) => template.premium);

  return (
    <main className="page-shell">
      <section className="page-hero compact">
        <p className="eyebrow">AI Studio</p>
        <h1>Genereaza outfit din criterii reale</h1>
        <p>
          Wardora citeste local culorile din poza cu canvas, apoi combina rezultatul cu ocazie, vreme, dress code, buget si confort.
        </p>
      </section>

      <section className="studio-grid">
        <article className="panel upload-panel">
          <h2>Upload poza</h2>
          <label className="photo-dropzone">
            {account?.photo ? (
              <img src={account.photo} alt="Utilizator incarcat" />
            ) : (
              <span>
                <Upload size={30} />
                Incarca poza utilizatorului
              </span>
            )}
            <input type="file" accept="image/*" onChange={onPhoto} />
          </label>
          {!account && (
            <button className="secondary-button wide" type="button" onClick={() => openAuth("register")}>
              Creeaza cont ca sa salvezi poza
            </button>
          )}
          <button className="primary-button wide" type="button" onClick={runAnalysis}>
            <Camera size={18} />
            {analysisLoading ? "Analizez poza..." : "Ruleaza analiza AI"}
          </button>
        </article>

        <article className="panel criteria-panel">
          <h2>Criterii outfit</h2>
          <ControlGroup label="Profil cumparaturi" options={criteriaOptions.audience} value={criteria.audience} onChange={(value) => updateCriteria("audience", value)} />
          <p className="privacy-note">
            Wardora nu ghiceste daca persoana este baiat sau fata din poza. Foloseste profilul ales de utilizator pentru recomandari respectuoase si mai precise.
          </p>
          <ControlGroup label="Emotie" options={criteriaOptions.emotion} value={criteria.emotion} onChange={(value) => updateCriteria("emotion", value)} />
          <ControlGroup label="Stil" options={criteriaOptions.style} value={criteria.style} onChange={(value) => updateCriteria("style", value)} />
          <div className="criteria-grid">
            <SelectField label="Ocazie" value={criteria.occasion} options={criteriaOptions.occasion} onChange={(value) => updateCriteria("occasion", value)} />
            <SelectField label="Sezon" value={criteria.season} options={criteriaOptions.season} onChange={(value) => updateCriteria("season", value)} />
            <SelectField label="Vreme" value={criteria.weather} options={criteriaOptions.weather} onChange={(value) => updateCriteria("weather", value)} />
            <SelectField label="Dress code" value={criteria.dressCode} options={criteriaOptions.dressCode} onChange={(value) => updateCriteria("dressCode", value)} />
            <SelectField label="Focus corp" value={criteria.bodyFocus} options={criteriaOptions.bodyFocus} onChange={(value) => updateCriteria("bodyFocus", value)} />
            <SelectField label="Culoare" value={criteria.colorMood} options={criteriaOptions.colorMood} onChange={(value) => updateCriteria("colorMood", value)} />
            <SelectField label="Buget" value={criteria.budget} options={criteriaOptions.budget} onChange={(value) => updateCriteria("budget", value)} />
            <SelectField label="Confort" value={criteria.comfort} options={criteriaOptions.comfort} onChange={(value) => updateCriteria("comfort", value)} />
          </div>
        </article>

        <article className="panel analysis-panel">
          <div className="analysis-header">
            <Palette size={22} />
            <div>
              <h2>Analiza AI</h2>
              <p>{aiProfile ? aiProfile.insight : "Incarca poza si ruleaza analiza."}</p>
            </div>
          </div>

          <div className="palette-row">
            {(aiProfile?.palette || ["#f7f1ff", "#d8c7f2", "#7a3cc7", "#d94f9b"]).map((color) => (
              <span key={color} style={{ background: color }} aria-label={color} />
            ))}
          </div>

          <AnalysisRow label="Luminozitate" value={`${aiProfile?.brightness || 0}%`} score={aiProfile?.brightness || 10} loading={analysisLoading} />
          <AnalysisRow label="Caldura cromatica" value={`${aiProfile?.warmth || 0}%`} score={aiProfile?.warmth || 10} loading={analysisLoading} />
          <AnalysisRow label="Saturatie" value={`${aiProfile?.saturation || 0}%`} score={aiProfile?.saturation || 10} loading={analysisLoading} />
          <AnalysisRow label="Contrast outfit" value={`${aiProfile?.contrast || 0}%`} score={aiProfile?.contrast || 10} loading={analysisLoading} />

          {!isPremium && (
            <LockedPanel title="AI detaliat Premium" text="Premium pastreaza istoric, recomandari shopping si mai multe variante sortate dupa scor." onClick={() => navigate("plans")} />
          )}
        </article>
      </section>

      <AvatarPreview account={account} aiProfile={aiProfile} />

      <section className="generator-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Generare outfit</p>
            <h2>Rezultat calculat din scoruri</h2>
          </div>
          <button className="primary-button" type="button" onClick={generateOutfit}>
            <WandSparkles size={18} />
            Genereaza outfit
          </button>
        </div>

        {generated && (
          <article className="panel generated-focus">
            <div>
              <p className="eyebrow">Recomandarea principala</p>
              <h2>{generated.title}</h2>
              <p>{generated.recommendation}</p>
              <small>{wardrobeItems.length ? `${wardrobeItems.length} haine analizate din garderoba ta` : "Genereaza dupa ce incarci haine pentru rezultate mai precise."}</small>
            </div>
            <strong>{generated.matchScore}% match</strong>
          </article>
        )}

        {generated?.aiOutfits?.length > 0 && (
          <div className="ai-outfit-grid">
            {generated.aiOutfits.map((outfit) => (
              <article className="panel ai-outfit-card" key={outfit.title}>
                <div className="outfit-topline">
                  <span>{outfit.vibe}</span>
                  <strong>{outfit.score}%</strong>
                </div>
                <h3>{outfit.title}</h3>
                <ul>
                  {outfit.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
                <p>{outfit.explanation}</p>
                <small>{outfit.completionSuggestions.join(", ")}</small>
              </article>
            ))}
          </div>
        )}

        <div className="outfit-grid">
          {variants.map((outfit) => (
            <OutfitCard key={outfit.title} outfit={outfit} />
          ))}
          {!isPremium &&
            lockedTemplates.map((outfit) => (
              <OutfitCard key={outfit.title} outfit={outfit} locked onUnlock={() => navigate("plans")} />
            ))}
        </div>
        {!isPremium && <p className="unlock-note">Planul gratuit arata 2 rezultate. Premium deblocheaza inca {lockedTemplates.length} variante si scoruri detaliate.</p>}
        <div className="studio-shopping-cta panel">
          <div>
            <p className="eyebrow">Shopping partener</p>
            <h2>Asociaza outfitul cu produse reale</h2>
            <p>Wardora poate trimite utilizatorul spre Zara, ABOUT YOU, H&M sau Mango pentru articole care se potrivesc criteriilor.</p>
          </div>
          <button className="secondary-button" type="button" onClick={() => navigate("shopping")}>
            Vezi shopping
          </button>
        </div>
      </section>
    </main>
  );
}

export default StudioPage;

import { Shirt, Sparkles, Upload } from "lucide-react";
import { wardrobeItems as demoWardrobeItems } from "../data/wardoraData";

const categories = ["Top", "Bottom", "Layer", "Dress", "Shoes", "Accessory", "Outerwear"];
const seasons = ["Primavara", "Vara", "Toamna", "Iarna", "All season"];
const styles = ["Smart casual", "Elegant", "Street chic", "Soft glam", "Office", "Weekend", "Sport"];

function WardrobePage({ criteria, navigate, wardrobeItems, wardrobeForm, setWardrobeForm, onWardrobeUpload }) {
  const items = wardrobeItems.length
    ? wardrobeItems.map((item) => ({
        ...item,
        type: item.category,
        match: item.match || 86,
      }))
    : demoWardrobeItems;

  const sortedItems = [...items].sort((a, b) => {
    const colorBoostA = a.color === criteria.colorMood ? 15 : 0;
    const colorBoostB = b.color === criteria.colorMood ? 15 : 0;
    return (b.match || 80) + colorBoostB - ((a.match || 80) + colorBoostA);
  });

  return (
    <main className="page-shell">
      <section className="page-hero compact">
        <p className="eyebrow">Garderoba digitala</p>
        <h1>Upload haine si taguri AI</h1>
        <p>Incarca poze cu hainele tale. Fiecare articol primeste categorie, culoare, stil, sezon si taguri pentru OpenAI Vision.</p>
        <button className="primary-button" type="button" onClick={() => navigate("studio")}>
          <Sparkles size={18} />
          Genereaza outfit
        </button>
      </section>

      <section className="wardrobe-upload-grid">
        <form className="panel wardrobe-form">
          <h2>Adauga articol</h2>
          <label>
            <span>Nume articol</span>
            <input value={wardrobeForm.name} onChange={(event) => setWardrobeForm({ ...wardrobeForm, name: event.target.value })} placeholder="ex. Blazer lavanda" />
          </label>
          <div className="criteria-grid">
            <label>
              <span>Categorie</span>
              <select value={wardrobeForm.category} onChange={(event) => setWardrobeForm({ ...wardrobeForm, category: event.target.value })}>
                {categories.map((category) => <option key={category}>{category}</option>)}
              </select>
            </label>
            <label>
              <span>Culoare</span>
              <input value={wardrobeForm.color} onChange={(event) => setWardrobeForm({ ...wardrobeForm, color: event.target.value })} placeholder="mov, alb, negru" />
            </label>
            <label>
              <span>Stil</span>
              <select value={wardrobeForm.style} onChange={(event) => setWardrobeForm({ ...wardrobeForm, style: event.target.value })}>
                {styles.map((style) => <option key={style}>{style}</option>)}
              </select>
            </label>
            <label>
              <span>Sezon</span>
              <select value={wardrobeForm.season} onChange={(event) => setWardrobeForm({ ...wardrobeForm, season: event.target.value })}>
                {seasons.map((season) => <option key={season}>{season}</option>)}
              </select>
            </label>
          </div>
          <label>
            <span>Taguri AI</span>
            <input value={wardrobeForm.tags} onChange={(event) => setWardrobeForm({ ...wardrobeForm, tags: event.target.value })} placeholder="satin, oversized, elegant, confort" />
          </label>
          <label className="upload-button">
            <Upload size={18} />
            Incarca poza articol
            <input type="file" accept="image/*" onChange={onWardrobeUpload} />
          </label>
        </form>

        <article className="panel wardrobe-info">
          <h2>Ce trimitem catre AI</h2>
          <p>OpenAI Vision primeste poza utilizatorului si pozele hainelor incarcate, plus metadatele de mai jos.</p>
          <div className="criteria-summary">
            <span>{wardrobeForm.category}</span>
            <span>{wardrobeForm.color}</span>
            <span>{wardrobeForm.style}</span>
            <span>{wardrobeForm.season}</span>
          </div>
        </article>
      </section>

      <section className="wardrobe-grid">
        {sortedItems.map((item) => {
          const score = Math.min((item.match || 82) + (item.color === criteria.colorMood ? 5 : 0), 99);
          return (
            <article className="wardrobe-item" key={item.id || item.name}>
              {item.imageUrl ? (
                <img className="wardrobe-photo" src={item.imageUrl} alt={item.name || item.category} />
              ) : (
                <div className="wardrobe-icon">
                  <Shirt size={22} />
                </div>
              )}
              <h3>{item.name || item.category}</h3>
              <p>{item.type || item.category} / {item.color} / {item.season}</p>
              <small>{item.style || "Smart casual"} {item.tags ? `/ ${item.tags}` : ""}</small>
              <div className="match-bar" aria-label={`Compatibilitate ${score}%`}>
                <span style={{ width: `${score}%` }} />
              </div>
              <strong>{score}% match</strong>
            </article>
          );
        })}
      </section>
    </main>
  );
}

export default WardrobePage;

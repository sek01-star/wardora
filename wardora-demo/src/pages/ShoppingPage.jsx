import { ExternalLink, Search, ShoppingBag, Sparkles } from "lucide-react";
import { LockedPanel } from "../components/ui";
import { deliveryPartners, projectSignals } from "../data/wardoraData";

function ShoppingPage({ isPremium, products, criteria, generated, navigate, searchStatus, runLiveProductSearch }) {
  return (
    <main className="page-shell">
      <section className="page-hero compact">
        <p className="eyebrow">Shopping recomandat</p>
        <h1>Produse reale, livrabile in Romania</h1>
        <p>
          Pagina respecta proiectul Wardora: articole sugerate pe baza stilului, emotiei, vremii si outfitului generat, cu branduri partenere precum Zara, H&M si ABOUT YOU.
        </p>
        <div className="hero-actions">
          <button className="primary-button" type="button" onClick={() => navigate("studio")}>
            <Sparkles size={18} />
            Genereaza outfit
          </button>
          <button className="secondary-button light" type="button" onClick={runLiveProductSearch}>
            <Search size={18} />
            Cauta live AI
          </button>
          <button className="secondary-button light" type="button" onClick={() => navigate("wardrobe")}>
            Vezi garderoba
          </button>
        </div>
      </section>

      <section className="shopping-layout">
        <aside className="panel project-panel">
          <h2>Din proiectul PDF</h2>
          <p>
            Wardora trebuie sa puna accent pe starea emotionala, garderoba digitala, vreme, stil si shopping personalizat.
          </p>
          <ul className="signal-list">
            {projectSignals.map((signal) => (
              <li key={signal}>{signal}</li>
            ))}
          </ul>
        </aside>

        <section className="panel shopping-context">
          <div className="section-heading compact-heading">
            <div>
              <p className="eyebrow">Criterii curente</p>
              <h2>{generated?.title || "Fara outfit generat"}</h2>
            </div>
            <Search size={24} />
          </div>
          <div className="criteria-summary">
            <span>{criteria.emotion}</span>
            <span>{criteria.audience}</span>
            <span>{criteria.style}</span>
            <span>{criteria.occasion}</span>
            <span>{criteria.weather}</span>
            <span>{criteria.colorMood}</span>
            <span>{criteria.budget}</span>
          </div>
          <p>
            Recomandarile sunt linkuri catre pagini reale. Stocul, marimile si pretul trebuie reverificate in magazin inainte de cumparare.
          </p>
          {searchStatus && <p className="form-message">{searchStatus}</p>}
        </section>
      </section>

      <section className="shopping-grid">
        {products.map((product) => (
          <article className="shopping-card" key={product.id}>
            <div className="shopping-card-top">
              <span>{product.brand}</span>
              <strong>{product.matchScore}%</strong>
            </div>
            <h3>{product.name}</h3>
            <p>{product.why}</p>
            <div className="product-meta">
              <span>{product.category}</span>
              <span>{product.color}</span>
              <span>{product.price}</span>
            </div>
            <a className="primary-button wide" href={product.url} target="_blank" rel="noreferrer">
              <ShoppingBag size={18} />
              Vezi produsul
              <ExternalLink size={16} />
            </a>
          </article>
        ))}
      </section>

      {!isPremium && (
        <LockedPanel
          title="Shopping complet in Unlimited Couture"
          text="Planul gratuit afiseaza primele recomandari. Premium deblocheaza toate produsele, istoric si mai multe variante de outfit."
          onClick={() => navigate("plans")}
        />
      )}

      <section className="delivery-grid">
        {deliveryPartners.map((partner) => (
          <a className="delivery-card" href={partner.proofUrl} target="_blank" rel="noreferrer" key={partner.brand}>
            <strong>{partner.brand}</strong>
            <p>{partner.note}</p>
            <span>
              sursa livrare <ExternalLink size={14} />
            </span>
          </a>
        ))}
      </section>
    </main>
  );
}

export default ShoppingPage;

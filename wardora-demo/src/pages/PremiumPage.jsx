import { History, Palette, ShoppingBag, WandSparkles } from "lucide-react";
import { LockedPanel } from "../components/ui";
import { premiumFeatures } from "../data/wardoraData";

function PremiumPage({ isPremium, history, navigate, shoppingRecommendations }) {
  const shopping = shoppingRecommendations?.length ? shoppingRecommendations : [];

  return (
    <main className="page-shell">
      <section className="page-hero compact">
        <p className="eyebrow">Premium</p>
        <h1>{isPremium ? "Premium este activ" : "Deblocheaza Premium"}</h1>
        <p>
          Premium transforma demo-ul intr-un asistent mai complet: variante multiple, shopping, scoruri si istoric.
        </p>
        {!isPremium && (
          <button className="primary-button" type="button" onClick={() => navigate("plans")}>
            Vezi planuri
          </button>
        )}
      </section>

      <section className="premium-grid">
        <PremiumFeature icon={WandSparkles} title="Outfituri multiple" text="Mai multe propuneri si scoruri AI." unlocked={isPremium} />
        <PremiumFeature icon={Palette} title="Analiza detaliata" text="Lumina, caldura, saturatie, contrast." unlocked={isPremium} />
        <PremiumFeature icon={ShoppingBag} title="Shopping" text="Lista de itemuri recomandate dupa outfit." unlocked={isPremium} />
        <PremiumFeature icon={History} title="Istoric" text="Tinutele generate raman salvate local." unlocked={isPremium} />
      </section>

      <section className="premium-content-grid">
        <article className="panel">
          <h2>Recomandari shopping</h2>
          {isPremium ? (
            <div className="shopping-list">
              {shopping.map((item, index) => (
                <a className="shopping-row linked-row" href={item.url} target="_blank" rel="noreferrer" key={item.id}>
                  <div>
                    <strong>{item.name}</strong>
                    <p>{item.brand} / {item.why}</p>
                  </div>
                  <span>{index === 0 ? "prioritar" : item.price}</span>
                </a>
              ))}
            </div>
          ) : (
            <LockedPanel title="Shopping Premium" text="Activeaza Premium pentru lista de cumparaturi." onClick={() => navigate("plans")} />
          )}
        </article>

        <article className="panel">
          <h2>Istoric outfituri</h2>
          {isPremium ? (
            history.length ? (
              <div className="history-list">
                {history.map((item) => (
                  <div className="history-row" key={`${item.title}-${item.date}-${item.matchScore}`}>
                    <strong>{item.title}</strong>
                    <p>{item.criteria?.occasion || "Outfit"} / {item.criteria?.style || "Wardora"}</p>
                    <span>{item.matchScore}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <p>Genereaza un outfit in AI Studio ca sa apara aici.</p>
            )
          ) : (
            <LockedPanel title="Istoric Premium" text="Istoricul complet apare dupa plata simulata." onClick={() => navigate("plans")} />
          )}
        </article>
      </section>

      <section className="feature-strip text-strip">
        {premiumFeatures.map((feature) => (
          <button type="button" key={feature} onClick={() => navigate(feature.includes("shopping") ? "shopping" : isPremium ? "studio" : "plans")}>
            <WandSparkles size={18} />
            <span>{feature}</span>
          </button>
        ))}
      </section>
    </main>
  );
}

function PremiumFeature({ icon: Icon, title, text, unlocked }) {
  return (
    <article className={unlocked ? "premium-feature unlocked" : "premium-feature"}>
      <Icon size={24} />
      <h3>{title}</h3>
      <p>{text}</p>
      <span>{unlocked ? "Activ" : "Blocat"}</span>
    </article>
  );
}

export default PremiumPage;

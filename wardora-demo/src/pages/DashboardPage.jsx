import { Camera, Crown, History, LayoutDashboard, Palette, WandSparkles } from "lucide-react";
import { MetricCard } from "../components/ui";
import AvatarPreview from "../components/AvatarPreview";

function DashboardPage({ account, isPremium, history, aiProfile, generated, navigate, openAuth, wardrobeItems }) {
  return (
    <main className="page-shell">
      <section className="page-hero compact">
        <p className="eyebrow">Dashboard utilizator</p>
        <h1>{account ? `Buna, ${account.name}` : "Dashboard Wardora"}</h1>
        <p>Tot ce faci in demo ramane in browser: cont, poza, criterii, analiza AI, status Premium si istoric.</p>
        {!account && (
          <button className="primary-button" type="button" onClick={() => openAuth("login")}>
            Login pentru salvare
          </button>
        )}
      </section>

      <section className="metrics-grid">
        <MetricCard icon={LayoutDashboard} label="Profil" value={account ? "Activ" : "Neconectat"} note={account?.email || "LocalStorage"} />
        <MetricCard icon={Camera} label="Poza utilizator" value={account?.photo ? "Incarcata" : "Lipsa"} />
        <MetricCard icon={Palette} label="AI foto" value={aiProfile ? `${aiProfile.brightness}% lumina` : "Neanalizat"} note={aiProfile?.dominantColor} />
        <MetricCard icon={Crown} label="Plan" value={isPremium ? "Unlimited" : "Free"} note={`${wardrobeItems.length} haine`} />
      </section>

      <AvatarPreview account={account} aiProfile={aiProfile} />

      <section className="dashboard-grid">
        <article className="panel">
          <h2>Ultimul outfit</h2>
          {generated ? (
            <>
              <h3>{generated.title}</h3>
              <p>{generated.recommendation}</p>
              <button className="secondary-button" type="button" onClick={() => navigate("studio")}>
                <WandSparkles size={18} />
                Genereaza altul
              </button>
            </>
          ) : (
            <>
              <p>Nu ai generat inca un outfit in sesiunea aceasta.</p>
              <button className="primary-button" type="button" onClick={() => navigate("studio")}>
                Deschide AI Studio
              </button>
            </>
          )}
        </article>

        <article className="panel">
          <h2>Istoric</h2>
          {isPremium ? (
            history.length ? (
              <div className="history-list">
                {history.slice(0, 4).map((item) => (
                  <div className="history-row" key={`${item.title}-${item.date}-${item.matchScore}`}>
                    <strong>{item.title}</strong>
                    <p>{item.date}</p>
                    <span>{item.matchScore}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <p>Genereaza un outfit ca sa apara aici.</p>
            )
          ) : (
            <p>Istoricul complet este blocat pana activezi Premium.</p>
          )}
          <button className="secondary-button" type="button" onClick={() => navigate("premium")}>
            <History size={18} />
            Vezi Premium
          </button>
        </article>
      </section>
    </main>
  );
}

export default DashboardPage;

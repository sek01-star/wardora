import { ArrowRight, Camera, Crown, Palette, Shirt, Sparkles, Upload, WandSparkles } from "lucide-react";
import heroImage from "../assets/hero.png";

function LandingPage({ navigate, openAuth }) {
  return (
    <main className="page-shell">
      <section
        className="hero-section"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(44, 18, 68, 0.86), rgba(94, 38, 137, 0.54), rgba(255, 255, 255, 0.1)), url(${heroImage})`,
        }}
      >
        <div className="hero-copy">
          <p className="eyebrow">AI fashion stylist</p>
          <h1>Wardora</h1>
          <p className="hero-text">
            AI fashion stylist pentru garderoba ta: cont privat, upload poze, analiza OpenAI Vision, avatar preview si outfituri personalizate.
          </p>
          <div className="hero-actions">
            <button className="primary-button" type="button" onClick={() => openAuth("register")}>
              Sign up <ArrowRight size={18} />
            </button>
            <button className="secondary-button light" type="button" onClick={() => navigate("studio")}>
              <WandSparkles size={18} />
              Incearca AI Studio
            </button>
          </div>
        </div>
      </section>

      <section className="feature-strip" aria-label="Beneficii Wardora">
        <button type="button" onClick={() => navigate("studio")}>
          <Sparkles size={20} />
          <span>AI local pe poza</span>
        </button>
        <button type="button" onClick={() => navigate("wardrobe")}>
          <Shirt size={20} />
          <span>Garderoba digitala</span>
        </button>
        <button type="button" onClick={() => navigate("plans")}>
          <Crown size={20} />
          <span>Unlimited Couture</span>
        </button>
        <button type="button" onClick={() => navigate("shopping")}>
          <WandSparkles size={20} />
          <span>Shopping partener</span>
        </button>
      </section>

      <section className="landing-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Features</p>
            <h2>Fashion-tech construit pentru proiectul Wardora</h2>
          </div>
        </div>
        <div className="premium-grid">
          <Feature icon={Camera} title="OpenAI Vision" text="Analizeaza poza utilizatorului si hainele incarcate prin server securizat." />
          <Feature icon={Upload} title="Firebase Storage" text="Pozele de profil si garderoba se incarca in Storage, nu in cod." />
          <Feature icon={Palette} title="Profil cromatic" text="Palete, stil, fit notes si compatibilitate pentru outfit." />
          <Feature icon={Crown} title="Unlimited Couture" text="Structura pentru premium, istoric, shopping si garderoba prietenilor." />
        </div>
      </section>

      <section className="landing-section how-section">
        <div>
          <p className="eyebrow">How it works</p>
          <h2>Din poza la outfit in 3 pasi</h2>
        </div>
        <div className="steps-grid">
          <Step number="01" title="Creezi cont" text="Firebase Auth pastreaza sesiunea si protejeaza dashboard-ul." />
          <Step number="02" title="Incarci garderoba" text="Adaugi poza ta si haine cu categorie, culoare, sezon si taguri AI." />
          <Step number="03" title="Generezi outfituri" text="Alegi emotie si context, iar AI intoarce 3 combinatii explicate." />
        </div>
      </section>

      <section className="landing-section ai-demo-band">
        <div>
          <p className="eyebrow">AI Demo</p>
          <h2>Preview premium pentru avatar si outfituri</h2>
          <p>Endpointurile locale `/api/analyze` si `/api/generate-outfit` sunt gata pentru cheia OpenAI din environment variable.</p>
        </div>
        <button className="primary-button" type="button" onClick={() => navigate("studio")}>
          <WandSparkles size={18} />
          Deschide demo
        </button>
      </section>

      <section className="landing-section pricing-preview">
        <div className="plan-card">
          <div className="plan-heading"><span>Free</span></div>
          <strong>0 lei</strong>
          <p>3 outfituri/zi, upload limitat si analiza simpla.</p>
        </div>
        <div className="plan-card highlighted">
          <div className="plan-heading"><span>Wardora Unlimited Couture</span></div>
          <strong>29 lei</strong>
          <p>Outfituri nelimitate, AI detaliat, shopping si istoric.</p>
          <button className="primary-button" type="button" onClick={() => navigate("plans")}>Vezi pricing</button>
        </div>
      </section>
    </main>
  );
}

function Feature({ icon: Icon, title, text }) {
  return (
    <article className="premium-feature unlocked">
      <Icon size={24} />
      <h3>{title}</h3>
      <p>{text}</p>
      <span>Ready</span>
    </article>
  );
}

function Step({ number, title, text }) {
  return (
    <article className="step-card">
      <span>{number}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

export default LandingPage;

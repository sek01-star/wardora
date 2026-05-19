import { BadgeCheck, KeyRound, LogOut, Mail, User } from "lucide-react";
import { firebaseAuthConfigured } from "../services/authService";

function AuthPage({
  account,
  isPremium,
  authMode,
  setAuthMode,
  authForm,
  setAuthForm,
  authMessage,
  onSubmit,
  onLogout,
}) {
  return (
    <main className="page-shell">
      <section className="page-hero compact">
        <p className="eyebrow">{authMode === "register" ? "Sign up" : "Login"}</p>
        <h1>{authMode === "register" ? "Creeaza contul Wardora" : "Intra in Wardora"}</h1>
        <p>
          {firebaseAuthConfigured
            ? "Autentificarea foloseste Firebase Auth. Poza, Premium si istoricul raman sincronizate local in acest MVP."
            : "Firebase nu este configurat in .env, deci formularul foloseste temporar autentificarea demo locala."}
        </p>
      </section>

      <section className="auth-layout">
        <form className="panel auth-form" onSubmit={onSubmit}>
          <div className="segmented-control" aria-label="Mod autentificare">
            <button type="button" className={authMode === "register" ? "active" : ""} onClick={() => setAuthMode("register")}>
              Sign up
            </button>
            <button type="button" className={authMode === "login" ? "active" : ""} onClick={() => setAuthMode("login")}>
              Login
            </button>
          </div>

          {authMode === "register" && (
            <label>
              <span>Nume</span>
              <div className="input-wrap">
                <User size={18} />
                <input
                  value={authForm.name}
                  onChange={(event) => setAuthForm({ ...authForm, name: event.target.value })}
                  placeholder="Numele tau"
                />
              </div>
            </label>
          )}

          <label>
            <span>Email</span>
            <div className="input-wrap">
              <Mail size={18} />
              <input
                type="email"
                required
                value={authForm.email}
                onChange={(event) => setAuthForm({ ...authForm, email: event.target.value })}
                placeholder="tu@wardora.ro"
              />
            </div>
          </label>

          <label>
            <span>Parola demo</span>
            <div className="input-wrap">
              <KeyRound size={18} />
              <input
                type="password"
                required
                minLength={4}
                value={authForm.password}
                onChange={(event) => setAuthForm({ ...authForm, password: event.target.value })}
                placeholder="minim 4 caractere"
              />
            </div>
          </label>

          <button className="primary-button wide" type="submit">
            <BadgeCheck size={18} />
            {authMode === "register" ? "Salveaza cont local" : "Login"}
          </button>

          {authMessage && <p className="form-message">{authMessage}</p>}
        </form>

        <aside className="panel account-panel">
          <div className="profile-avatar">{account?.photo ? <img src={account.photo} alt="Profil Wardora" /> : <User size={44} />}</div>
          <div>
            <p className="eyebrow">Profil utilizator</p>
            <h2>{account?.name || "Vizitator Wardora"}</h2>
            <p>{account?.email || "Autentifica-te ca sa salvezi rezultatele AI."}</p>
          </div>
          <span className={isPremium ? "premium-badge" : "free-badge"}>{isPremium ? "Premium activ" : "Plan gratuit"}</span>
          {account && (
            <button className="secondary-button" type="button" onClick={onLogout}>
              <LogOut size={18} />
              Logout
            </button>
          )}
        </aside>
      </section>
    </main>
  );
}

export default AuthPage;

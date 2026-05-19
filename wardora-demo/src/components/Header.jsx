import { Crown, LogOut, Menu, Sparkles, UserPlus, X } from "lucide-react";
import { useState } from "react";
import { navItems } from "../data/wardoraData";

function Header({ account, isPremium, page, onNavigate, onAuth, onLogout }) {
  const [open, setOpen] = useState(false);

  const go = (nextPage) => {
    setOpen(false);
    onNavigate(nextPage);
  };

  return (
    <header className="site-header">
      <button className="brand-mark" type="button" onClick={() => go("landing")} aria-label="Wardora home">
        <span>W</span>
        <strong>Wardora</strong>
      </button>

      <nav className="desktop-nav" aria-label="Navigatie principala">
        {navItems.map((item) => (
          <button key={item.id} type="button" className={page === item.id ? "active" : ""} onClick={() => go(item.id)}>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="header-actions">
        <button className="status-pill" type="button" onClick={() => go("plans")}>
          {isPremium ? <Crown size={16} /> : <Sparkles size={16} />}
          {isPremium ? "Unlimited" : "Free"}
        </button>

        {!account ? (
          <div className="auth-top-actions">
            <button className="secondary-button small" type="button" onClick={() => onAuth("login")}>
              Login
            </button>
            <button className="primary-button small" type="button" onClick={() => onAuth("register")}>
              <UserPlus size={16} />
              Sign up
            </button>
          </div>
        ) : (
          <button className="text-button header-user" type="button" onClick={onLogout}>
            <LogOut size={16} />
            Logout
          </button>
        )}

        <button className="icon-button mobile-only" type="button" onClick={() => setOpen(true)} aria-label="Deschide meniul">
          <Menu size={21} />
        </button>
      </div>

      {open && (
        <div className="mobile-nav" role="dialog" aria-modal="true" aria-label="Meniu mobil">
          <div className="mobile-nav-header">
            <strong>Wardora</strong>
            <button className="icon-button" type="button" onClick={() => setOpen(false)} aria-label="Inchide meniul">
              <X size={21} />
            </button>
          </div>
          {navItems.map((item) => (
            <button key={item.id} type="button" className={page === item.id ? "active" : ""} onClick={() => go(item.id)}>
              {item.label}
            </button>
          ))}
          {!account && (
            <div className="mobile-auth-actions">
              <button className="secondary-button wide" type="button" onClick={() => onAuth("login")}>
                Login
              </button>
              <button className="primary-button wide" type="button" onClick={() => onAuth("register")}>
                Sign up
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;

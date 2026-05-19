import { Camera, Globe2, Music2 } from "lucide-react";

function Footer({ navigate }) {
  return (
    <footer className="site-footer">
      <div>
        <strong>Wardora SRL</strong>
        <p>AI fashion stylist pentru garderobe digitale, outfituri emotionale si shopping inteligent.</p>
      </div>

      <div>
        <span>Email</span>
        <a href="mailto:contact@wardora.ro">contact@wardora.ro</a>
        <span>Telefon</span>
        <a href="tel:+40700000000">+40 700 000 000</a>
      </div>

      <div>
        <span>Sediu</span>
        <p>Tulcea, Romania</p>
        <span>Social media</span>
        <div className="social-row">
          <a href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
            <Camera size={18} />
          </a>
          <a href="https://www.tiktok.com" target="_blank" rel="noreferrer" aria-label="TikTok">
            <Music2 size={18} />
          </a>
          <a href="https://www.facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
            <Globe2 size={18} />
          </a>
        </div>
      </div>

      <div>
        <button type="button" onClick={() => navigate("landing")}>Politica de confidentialitate</button>
        <button type="button" onClick={() => navigate("landing")}>Termeni si conditii</button>
        <button type="button" onClick={() => navigate("landing")}>Contact</button>
      </div>
    </footer>
  );
}

export default Footer;

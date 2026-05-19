import { Crown } from "lucide-react";
import { PlanCard } from "../components/ui";

function PlansPage({ isPremium, navigate }) {
  return (
    <main className="page-shell">
      <section className="page-hero compact">
        <p className="eyebrow">Plan gratuit si Premium</p>
        <h1>Alege nivelul Wardora</h1>
        <p>Planul Premium deblocheaza mai multe rezultate, explicatii mai bune si istoric outfituri.</p>
      </section>

      <section className="plans-grid">
        <PlanCard
          name="Free"
          price="0 lei"
          active={!isPremium}
          features={["5 sugestii la 6 ore", "analiza foto de baza", "criterii multiple", "garderoba demo"]}
          action="Foloseste Free"
          onClick={() => navigate("studio")}
        />
        <PlanCard
          name="Unlimited Couture"
          price="4.99€ / lună"
          highlighted
          active={isPremium}
          features={["sugestii nelimitate", "recomandari shopping", "istoric outfituri", "garderoba prietenilor"]}
          action={isPremium ? "Premium activ" : "Continua la plata"}
          onClick={() => navigate(isPremium ? "premium" : "checkout")}
        />
      </section>

      <section className="panel plan-note">
        <Crown size={22} />
        <p>Plata este simulata. Dupa confirmare, contul primeste `premium: true` in localStorage.</p>
      </section>
    </main>
  );
}

export default PlansPage;

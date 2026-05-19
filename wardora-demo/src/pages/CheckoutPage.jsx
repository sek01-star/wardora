import { CreditCard } from "lucide-react";

function CheckoutPage({ paymentForm, setPaymentForm, activatePremium }) {
  return (
    <main className="page-shell">
      <section className="checkout-layout">
        <div className="page-hero compact checkout-copy">
          <p className="eyebrow">Plata simulata</p>
          <h1>Activeaza Wardora Unlimited Couture</h1>
          <p>Formularul nu trimite date nicaieri. Este doar o simulare pentru MVP si modifica statusul local al contului.</p>
        </div>

        <form className="panel payment-panel" onSubmit={activatePremium}>
          <div className="payment-summary">
            <CreditCard size={24} />
            <div>
              <h2>Wardora Unlimited Couture</h2>
              <p>29 lei / luna, demo local</p>
            </div>
          </div>

          <label>
            <span>Nume pe card</span>
            <input
              value={paymentForm.cardName}
              onChange={(event) => setPaymentForm({ ...paymentForm, cardName: event.target.value })}
              placeholder="Nume Prenume"
              required
            />
          </label>

          <label>
            <span>Numar card demo</span>
            <input
              inputMode="numeric"
              value={paymentForm.cardNumber}
              onChange={(event) => setPaymentForm({ ...paymentForm, cardNumber: event.target.value })}
              placeholder="4242 4242 4242 4242"
              required
            />
          </label>

          <label>
            <span>Expira</span>
            <input
              value={paymentForm.expiry}
              onChange={(event) => setPaymentForm({ ...paymentForm, expiry: event.target.value })}
              placeholder="12/29"
              required
            />
          </label>

          <button className="primary-button wide" type="submit">
            Confirma plata simulata
          </button>
        </form>
      </section>
    </main>
  );
}

export default CheckoutPage;

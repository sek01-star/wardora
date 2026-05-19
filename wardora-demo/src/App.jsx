import { useEffect, useMemo, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { pages } from "./data/wardoraData";
import AuthPage from "./pages/AuthPage";
import CheckoutPage from "./pages/CheckoutPage";
import DashboardPage from "./pages/DashboardPage";
import LandingPage from "./pages/LandingPage";
import PlansPage from "./pages/PlansPage";
import PremiumPage from "./pages/PremiumPage";
import ShoppingPage from "./pages/ShoppingPage";
import StudioPage from "./pages/StudioPage";
import WardrobePage from "./pages/WardrobePage";
import {
  firebaseAuthConfigured,
  firebaseUserToAccount,
  signInWithFirebase,
  signOutFirebase,
  signUpWithFirebase,
  subscribeToFirebaseAuth,
  addWardrobeItem,
  getUserProfile,
  getWardrobeItems,
  saveAiAnalysis,
  saveOutfitHistory,
  saveUserProfile,
  updatePremiumStatus,
  uploadUserPhoto,
} from "./services/authService";
import { searchLiveProducts } from "./services/productSearchService";
import {
  STORAGE_KEYS,
  buildAccount,
  getInitialAccount,
  getInitialAiProfile,
  getInitialCriteria,
  getInitialHistory,
  getInitialWardrobe,
  readJson,
  writeJson,
} from "./utils/storage";
import { analyzeImageDataUrl, buildOutfitRecommendation, getOutfitVariants, getShoppingRecommendations } from "./utils/styleAi";

function getPageFromHash() {
  const route = window.location.hash.replace("#/", "") || "landing";
  if (route === "login" || route === "signup") return "auth";
  return pages.includes(route) ? route : "landing";
}

function getAuthModeFromHash() {
  const route = window.location.hash.replace("#/", "");
  return route === "login" ? "login" : "register";
}

function App() {
  const [page, setPage] = useState(getPageFromHash);
  const [account, setAccount] = useState(getInitialAccount);
  const [history, setHistory] = useState(getInitialHistory);
  const [wardrobeItems, setWardrobeItems] = useState(getInitialWardrobe);
  const [criteria, setCriteria] = useState(getInitialCriteria);
  const [aiProfile, setAiProfile] = useState(getInitialAiProfile);
  const [authMode, setAuthMode] = useState(getAuthModeFromHash);
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [authMessage, setAuthMessage] = useState("");
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [generated, setGenerated] = useState(null);
  const [paymentForm, setPaymentForm] = useState({ cardName: "", cardNumber: "", expiry: "" });
  const [liveProducts, setLiveProducts] = useState([]);
  const [searchStatus, setSearchStatus] = useState("");
  const [wardrobeForm, setWardrobeForm] = useState({
    name: "",
    category: "Top",
    color: "Alb",
    style: "Smart casual",
    season: "All season",
    tags: "",
  });

  const isPremium = Boolean(account?.premium);
  const variants = useMemo(() => getOutfitVariants(criteria, aiProfile || undefined, isPremium), [aiProfile, criteria, isPremium]);
  const shoppingRecommendations = useMemo(
    () => getShoppingRecommendations(criteria, generated, isPremium),
    [criteria, generated, isPremium],
  );
  const productsForShopping = liveProducts.length ? liveProducts : shoppingRecommendations;
  const privatePages = ["dashboard", "studio", "wardrobe", "checkout", "premium"];

  const persistAccount = (nextAccount) => {
    setAccount(nextAccount);

    if (!nextAccount) {
      window.localStorage.setItem(STORAGE_KEYS.session, "signed-out");
      return;
    }

    writeJson(STORAGE_KEYS.account, nextAccount);
    window.localStorage.setItem(STORAGE_KEYS.session, "active");
    window.localStorage.setItem(STORAGE_KEYS.premium, nextAccount.premium ? "true" : "false");
  };

  const persistWardrobe = (nextWardrobe) => {
    setWardrobeItems(nextWardrobe);
    writeJson(STORAGE_KEYS.wardrobe, nextWardrobe);
  };

  useEffect(() => {
    const syncRoute = () => {
      setPage(getPageFromHash());
      setAuthMode(getAuthModeFromHash());
      window.scrollTo({ top: 0, behavior: "auto" });
    };

    window.addEventListener("hashchange", syncRoute);
    return () => window.removeEventListener("hashchange", syncRoute);
  }, []);

  useEffect(() => {
    if (!firebaseAuthConfigured) return undefined;

    return subscribeToFirebaseAuth((user) => {
      if (!user) return;
      const storedAccount = readJson(STORAGE_KEYS.account, {});
      const nextAccount = firebaseUserToAccount(user, storedAccount);
      persistAccount(nextAccount);
      getUserProfile(user.uid).then((profile) => {
        if (profile) persistAccount({ ...nextAccount, ...profile });
      });
      getWardrobeItems(user.uid).then((items) => {
        if (items.length) persistWardrobe(items);
      });
    });
  }, []);

  const navigate = (nextPage) => {
    const route = nextPage === "auth" ? authMode : nextPage;
    if (window.location.hash !== `#/${route}`) {
      window.location.hash = `#/${route}`;
      return;
    }
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openAuth = (mode) => {
    setAuthMode(mode);
    window.location.hash = mode === "login" ? "#/login" : "#/signup";
  };

  const persistHistory = (nextHistory) => {
    setHistory(nextHistory);
    writeJson(STORAGE_KEYS.history, nextHistory);
  };

  const updateCriteria = (field, value) => {
    const nextCriteria = { ...criteria, [field]: value };
    setCriteria(nextCriteria);
    writeJson(STORAGE_KEYS.criteria, nextCriteria);
  };

  const ensureAccount = () => {
    if (account) return true;
    setAuthMessage("Intra in cont sau creeaza unul ca sa salvezi poza, AI-ul si Premium.");
    openAuth("login");
    return false;
  };

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    const storedAccount = readJson(STORAGE_KEYS.account, null);
    const sameStoredEmail = storedAccount?.email && authForm.email.trim() === storedAccount.email;
    const source = sameStoredEmail ? storedAccount : null;
    let nextAccount;

    try {
      if (firebaseAuthConfigured) {
        nextAccount =
          authMode === "login"
            ? await signInWithFirebase(authForm, source)
            : await signUpWithFirebase(authForm, source);
        const profile = await getUserProfile(nextAccount.uid);
        if (profile) nextAccount = { ...nextAccount, ...profile };
        await saveUserProfile(nextAccount);
        setAuthMessage(authMode === "login" ? "Ai intrat cu Firebase Auth." : "Contul Firebase a fost creat.");
      } else {
        nextAccount = buildAccount(authForm, source);
        setAuthMessage("Firebase nu este configurat. Am folosit autentificarea demo locala.");
      }

      persistAccount(nextAccount);
      setAuthForm({ name: "", email: "", password: "" });
      navigate("dashboard");
    } catch (error) {
      setAuthMessage(error.message || "Autentificarea a esuat.");
    }
  };

  const handleLogout = async () => {
    await signOutFirebase();
    persistAccount(null);
    persistWardrobe([]);
    setAuthMessage("Sesiunea a fost inchisa. Contul salvat ramane in localStorage.");
    navigate("landing");
  };

  const saveAiProfile = (profile) => {
    setAiProfile(profile);
    writeJson(STORAGE_KEYS.aiProfile, profile);
    if (account?.uid) saveAiAnalysis(account.uid, profile).catch(() => {});
  };

  const analyzeCurrentPhoto = async (dataUrl = account?.photo) => {
    if (!ensureAccount()) return null;

    setAnalysisLoading(true);
    let profile;
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userPhoto: dataUrl,
          wardrobeItems,
          criteria,
        }),
      });
      if (!response.ok) throw new Error("Serverul AI nu a raspuns.");
      const data = await response.json();
      const localProfile = await analyzeImageDataUrl(dataUrl);
      profile = {
        ...localProfile,
        ...data,
        insight: data.motivation || data.observations?.[0] || localProfile.insight,
        palette: data.colorPalette?.length ? data.colorPalette : localProfile.palette,
        brightness: localProfile.brightness,
        warmth: localProfile.warmth,
        saturation: localProfile.saturation,
        contrast: data.compatibilityScore || localProfile.contrast,
      };
    } catch {
      profile = await analyzeImageDataUrl(dataUrl);
    }
    saveAiProfile(profile);
    setAnalysisLoading(false);
    return profile;
  };

  const handlePhoto = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!ensureAccount()) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const localPhoto = String(reader.result);
      let photo = localPhoto;
      if (firebaseAuthConfigured && account?.uid) {
        try {
          photo = await uploadUserPhoto(account.uid, file);
        } catch {
          photo = localPhoto;
        }
      }
      const nextAccount = { ...account, photo };
      persistAccount(nextAccount);
      if (nextAccount.uid) await saveUserProfile(nextAccount);
      setGenerated(null);
      await analyzeCurrentPhoto(photo);
    };
    reader.readAsDataURL(file);
  };

  const handleWardrobeUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!ensureAccount()) return;

    const metadata = {
      ...wardrobeForm,
      tags: wardrobeForm.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
        .join(", "),
    };

    const reader = new FileReader();
    reader.onload = async () => {
      let item = {
        id: crypto.randomUUID(),
        ...metadata,
        imageUrl: String(reader.result),
        createdAt: new Date().toISOString(),
      };

      if (firebaseAuthConfigured && account?.uid) {
        try {
          item = await addWardrobeItem(account.uid, file, metadata);
        } catch {
          // Keep local fallback item.
        }
      }

      persistWardrobe([item, ...wardrobeItems]);
      setWardrobeForm({ name: "", category: "Top", color: "Alb", style: "Smart casual", season: "All season", tags: "" });
    };
    reader.readAsDataURL(file);
  };

  const generateOutfit = async () => {
    if (!ensureAccount()) return;

    setAnalysisLoading(true);
    const profile = aiProfile || (await analyzeImageDataUrl(account?.photo));
    saveAiProfile(profile);
    let outfit = buildOutfitRecommendation(criteria, profile, isPremium, history.length);
    try {
      const response = await fetch("/api/generate-outfit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wardrobeItems,
          criteria,
          analysis: profile,
        }),
      });
      if (!response.ok) throw new Error("Serverul AI nu a raspuns.");
      const data = await response.json();
      if (data.outfits?.length) {
        outfit = {
          ...outfit,
          title: data.outfits[0].title,
          items: data.outfits[0].items,
          recommendation: data.outfits[0].explanation,
          matchScore: data.outfits[0].score,
          vibe: data.outfits[0].vibe,
          completionSuggestions: data.outfits[0].completionSuggestions,
          aiOutfits: data.outfits,
          source: data.source,
        };
      }
    } catch {
      // Keep local fallback.
    }
    setGenerated(outfit);
    const nextHistory = [outfit, ...history].slice(0, 12);
    persistHistory(nextHistory);
    if (account?.uid) saveOutfitHistory(account.uid, outfit).catch(() => {});
    setAnalysisLoading(false);
  };

  const runLiveProductSearch = async () => {
    setSearchStatus("Caut produse live...");
    try {
      const result = await searchLiveProducts({ criteria, generated, aiProfile });
      setLiveProducts(result.products);
      setSearchStatus(result.message);
    } catch (error) {
      setSearchStatus(error.message || "Cautarea live nu a reusit. Raman recomandarile din catalog.");
    }
  };

  const activatePremium = (event) => {
    event.preventDefault();
    if (!ensureAccount()) return;

    const nextAccount = { ...account, premium: true, upgradedAt: new Date().toISOString() };
    persistAccount(nextAccount);
    if (nextAccount.uid) {
      updatePremiumStatus(nextAccount.uid, true).catch(() => {});
      saveUserProfile(nextAccount).catch(() => {});
    }
    setPaymentForm({ cardName: "", cardNumber: "", expiry: "" });
    setAuthMessage("Plata simulata a fost aprobata. Premium este activ.");
    navigate("premium");
  };

  const sharedProps = {
    account,
    isPremium,
    history,
    wardrobeItems,
    wardrobeForm,
    setWardrobeForm,
    criteria,
    aiProfile,
    analysisLoading,
    generated,
    variants,
    shoppingRecommendations,
    productsForShopping,
    searchStatus,
    runLiveProductSearch,
    navigate,
    openAuth,
    updateCriteria,
    onPhoto: handlePhoto,
    onWardrobeUpload: handleWardrobeUpload,
    runAnalysis: () => analyzeCurrentPhoto(),
    generateOutfit,
  };

  const privatePageRequested = privatePages.includes(page) && !account;

  const currentPage = privatePageRequested ? (
    <AuthPage
      account={account}
      isPremium={isPremium}
      authMode="login"
      setAuthMode={setAuthMode}
      authForm={authForm}
      setAuthForm={setAuthForm}
      authMessage={authMessage || "Aceasta pagina este privata. Autentifica-te ca sa continui."}
      onSubmit={handleAuthSubmit}
      onLogout={handleLogout}
    />
  ) : {
    landing: <LandingPage navigate={navigate} openAuth={openAuth} />,
    auth: (
      <AuthPage
        account={account}
        isPremium={isPremium}
        authMode={authMode}
        setAuthMode={setAuthMode}
        authForm={authForm}
        setAuthForm={setAuthForm}
        authMessage={authMessage}
        onSubmit={handleAuthSubmit}
        onLogout={handleLogout}
      />
    ),
    dashboard: <DashboardPage {...sharedProps} />,
    studio: <StudioPage {...sharedProps} />,
    wardrobe: <WardrobePage {...sharedProps} />,
    shopping: <ShoppingPage {...sharedProps} products={productsForShopping} />,
    plans: <PlansPage isPremium={isPremium} navigate={navigate} />,
    checkout: <CheckoutPage paymentForm={paymentForm} setPaymentForm={setPaymentForm} activatePremium={activatePremium} />,
    premium: <PremiumPage isPremium={isPremium} history={history} generated={generated} navigate={navigate} shoppingRecommendations={productsForShopping} />,
  }[page];

  return (
    <div className="app-shell">
      <Header account={account} isPremium={isPremium} page={page} onNavigate={navigate} onAuth={openAuth} onLogout={handleLogout} />
      {currentPage}
      <Footer navigate={navigate} />
    </div>
  );
}

export default App;

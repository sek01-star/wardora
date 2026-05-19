import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firebaseAuthConfigured = Object.values(firebaseConfig).every(Boolean);
export const firebaseConfigured = firebaseAuthConfigured;

let auth = null;
let db = null;
let storage = null;

if (firebaseAuthConfigured) {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
}

function toAccount(user, previousAccount = {}) {
  return {
    ...previousAccount,
    uid: user.uid,
    name: user.displayName || previousAccount.name || user.email?.split("@")[0] || "Wardora Muse",
    email: user.email || previousAccount.email || "",
    provider: "firebase",
    premium: Boolean(previousAccount.premium),
    photo: previousAccount.photo || "",
    createdAt: previousAccount.createdAt || new Date().toISOString(),
  };
}

export async function signUpWithFirebase({ name, email, password }, previousAccount) {
  if (!auth) throw new Error("Firebase Auth nu este configurat.");
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  if (name) await updateProfile(credential.user, { displayName: name });
  return toAccount({ ...credential.user, displayName: name || credential.user.displayName }, previousAccount);
}

export async function signInWithFirebase({ email, password }, previousAccount) {
  if (!auth) throw new Error("Firebase Auth nu este configurat.");
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return toAccount(credential.user, previousAccount);
}

export async function signOutFirebase() {
  if (auth) await signOut(auth);
}

export function subscribeToFirebaseAuth(callback) {
  if (!auth) return () => {};
  return onAuthStateChanged(auth, callback);
}

export function firebaseUserToAccount(user, previousAccount) {
  return toAccount(user, previousAccount);
}

export async function saveUserProfile(account) {
  if (!db || !account?.uid) return account;
  const profileRef = doc(db, "users", account.uid);
  await setDoc(
    profileRef,
    {
      ...account,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
  return account;
}

export async function getUserProfile(uid) {
  if (!db || !uid) return null;
  const snapshot = await getDoc(doc(db, "users", uid));
  return snapshot.exists() ? snapshot.data() : null;
}

export async function uploadUserPhoto(uid, file) {
  if (!storage || !uid || !file) throw new Error("Firebase Storage nu este configurat.");
  const photoRef = ref(storage, `users/${uid}/profile/${Date.now()}-${file.name}`);
  await uploadBytes(photoRef, file, { contentType: file.type });
  return getDownloadURL(photoRef);
}

export async function addWardrobeItem(uid, file, metadata) {
  if (!storage || !db || !uid || !file) throw new Error("Firebase Storage/Firestore nu este configurat.");
  const itemRef = ref(storage, `users/${uid}/wardrobe/${Date.now()}-${file.name}`);
  await uploadBytes(itemRef, file, { contentType: file.type });
  const imageUrl = await getDownloadURL(itemRef);
  const docRef = await addDoc(collection(db, "users", uid, "wardrobe"), {
    ...metadata,
    imageUrl,
    fileName: file.name,
    createdAt: serverTimestamp(),
  });

  return {
    id: docRef.id,
    ...metadata,
    imageUrl,
  };
}

export async function getWardrobeItems(uid) {
  if (!db || !uid) return [];
  const wardrobeQuery = query(collection(db, "users", uid, "wardrobe"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(wardrobeQuery);
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function saveAiAnalysis(uid, analysis) {
  if (!db || !uid) return analysis;
  await setDoc(
    doc(db, "users", uid, "ai", "latestAnalysis"),
    {
      ...analysis,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
  return analysis;
}

export async function saveOutfitHistory(uid, outfit) {
  if (!db || !uid) return outfit;
  await addDoc(collection(db, "users", uid, "outfits"), {
    ...outfit,
    createdAt: serverTimestamp(),
  });
  return outfit;
}

export async function updatePremiumStatus(uid, premium) {
  if (!db || !uid) return;
  await setDoc(
    doc(db, "users", uid),
    {
      premium,
      premiumUpdatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}
